import HttpAction from "./HttpAction";
import IHttpActionParam from "../inf/IHttpActionParam";
import IAfterProcess from "../inf/IAfterProcess";
export interface DownloadExcelActionParam extends IHttpActionParam {
    /** 要解析的 sheet 名；默认第一个 sheet；支持 ${var} */
    sheetName?: string;
}
/**
 * 请求返回 excel 下载流的接口。
 * 与客户端 downloadExcel 一致：参数挂在 URL 上（GET）。
 */
export default class DownloadExcelAction extends HttpAction {
    private sheetName?;
    constructor(param?: DownloadExcelActionParam, afterProcess?: IAfterProcess);
    protected getMethod(): string;
    protected submit(url: string, httpParam: any, headers: any): Promise<any>;
    private appendQuery;
    private resolveSheetName;
    protected parseExcel(buffer: Buffer): any[];
}
