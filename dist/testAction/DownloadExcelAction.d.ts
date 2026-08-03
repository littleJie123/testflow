import HttpAction from "./HttpAction";
/**
 * 请求返回 excel 下载流的接口。
 * 将下载流解析成 any[]（第一行为表头，作为每行的 key），作为 result 给下一个步骤。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
export default class DownloadExcelAction extends HttpAction {
    protected submit(url: string, httpParam: any, headers: any): Promise<any>;
    /**
     * 解析 excel buffer，取第一个 sheet，第一行为表头
     */
    protected parseExcel(buffer: Buffer): any[];
}
