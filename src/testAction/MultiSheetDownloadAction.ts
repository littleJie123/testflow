import DownloadExcelAction from "./DownloadExcelAction";

export type MultiSheetExcelResult = { [sheetName: string]: any[] };

/**
 * 下载 excel 并解析全部 sheet。
 * 请求方式与 DownloadExcelAction 相同（GET、参数挂 URL、下载流）。
 * result 为 { [sheet名称]: any[] }，每个 sheet 第一行为表头。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
export default class MultiSheetDownloadAction extends DownloadExcelAction {
  protected parseExcel(buffer: Buffer): MultiSheetExcelResult {
    let workbook = this.readWorkbook(buffer);
    let ret: MultiSheetExcelResult = {};
    for (let name of workbook.SheetNames) {
      ret[name] = this.sheetToJson(workbook.Sheets[name]);
    }
    return ret;
  }
}
