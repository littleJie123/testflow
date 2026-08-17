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
 * 将下载流解析成 any[]（第一行为表头，作为每行的 key），作为 result 给下一个步骤。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
export default class DownloadExcelAction extends HttpAction {
    private sheetName?;
    constructor(param?: DownloadExcelActionParam, afterProcess?: IAfterProcess);
    protected getMethod(): string;
    protected submit(url: string, httpParam: any, headers: any): Promise<any>;
    /** 将参数拼到 URL query（复杂对象转 JSON 字符串） */
    private appendQuery;
    private resolveSheetName;
    /**
     * 解析 excel buffer：默认第一个 sheet，可指定 sheetName；第一行为表头
     */
    protected parseExcel(buffer: Buffer): any[];
}
