import * as XLSX from "xlsx";
import HttpUtil from "../util/HttpUtil";
import HttpAction from "./HttpAction";
import IHttpActionParam from "../inf/IHttpActionParam";
import IAfterProcess from "../inf/IAfterProcess";
import { StrUtil } from "../util/StrUtil";

export interface DownloadExcelActionParam extends IHttpActionParam {
  /** 要解析的 sheet 名；默认第一个 sheet；支持 ${var} */
  sheetName?: string;
}

/**
 * 请求返回 excel 下载流的接口。
 * 与客户端 downloadExcel 一致：参数挂在 URL 上（GET）。
 * 将下载流解析成 any[]（第一行为表头，作为每行的 key），作为 result 给下一个步骤。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
export default class DownloadExcelAction extends HttpAction {
  private sheetName?: string;

  constructor(param?: DownloadExcelActionParam, afterProcess?: IAfterProcess) {
    super(param, afterProcess);
    this.sheetName = param?.sheetName;
  }

  protected getMethod(): string {
    return 'GET';
  }

  protected async submit(url: string, httpParam: any, headers: any): Promise<any> {
    let httpUtil = HttpUtil.get();
    url = this.appendQuery(url, httpParam);
    let ret = await httpUtil.requestBuffer(
      url,
      this.getMethod(),
      null,
      headers
    );
    if (ret.isJson) {
      return ret;
    }
    return {
      status: ret.status,
      result: this.parseExcel(ret.result)
    };
  }

  /** 将参数拼到 URL query（复杂对象转 JSON 字符串） */
  private appendQuery(url: string, httpParam: any): string {
    if (httpParam == null) {
      return url;
    }
    let parts: string[] = [];
    for (let key in httpParam) {
      let val = httpParam[key];
      if (val == null || val instanceof Function) {
        continue;
      }
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
    }
    if (parts.length === 0) {
      return url;
    }
    return url + (url.includes('?') ? '&' : '?') + parts.join('&');
  }

  private resolveSheetName(): string {
    if (this.sheetName == null || this.sheetName === '') {
      return null;
    }
    return StrUtil.format(this.sheetName, this.getVariable());
  }

  protected readWorkbook(buffer: Buffer) {
    return XLSX.read(buffer, { type: 'buffer' });
  }

  protected sheetToJson(sheet: XLSX.WorkSheet): any[] {
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }

  /**
   * 解析 excel buffer：默认第一个 sheet，可指定 sheetName；第一行为表头
   */
  protected parseExcel(buffer: Buffer): any {
    let workbook = this.readWorkbook(buffer);
    let want = this.resolveSheetName();
    let sheetName = want ?? workbook.SheetNames[0];
    if (sheetName == null) {
      return [];
    }
    if (want != null && workbook.SheetNames.indexOf(want) < 0) {
      throw new Error(
        `Excel 无 sheet「${want}」，实际: ${JSON.stringify(workbook.SheetNames)}`
      );
    }
    return this.sheetToJson(workbook.Sheets[sheetName]);
  }
}
