import * as XLSX from "xlsx";
import HttpUtil from "../util/HttpUtil";
import HttpAction from "./HttpAction";

/**
 * 请求返回 excel 下载流的接口。
 * 将下载流解析成 any[]（第一行为表头，作为每行的 key），作为 result 给下一个步骤。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
export default class DownloadExcelAction extends HttpAction {

  protected async submit(url: string, httpParam: any, headers: any): Promise<any> {
    let httpUtil = HttpUtil.get();
    let ret = await httpUtil.requestBuffer(
      url,
      this.getMethod(),
      httpParam,
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

  /**
   * 解析 excel buffer，取第一个 sheet，第一行为表头
   */
  protected parseExcel(buffer: Buffer): any[] {
    let workbook = XLSX.read(buffer, { type: 'buffer' });
    let sheetName = workbook.SheetNames[0];
    if (sheetName == null) {
      return [];
    }
    let sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }
}
