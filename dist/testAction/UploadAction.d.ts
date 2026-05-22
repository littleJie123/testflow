import IAfterProcess from "../inf/IAfterProcess";
import IHttpActionParam from "../inf/IHttpActionParam";
import UrlAction from "./UrlAction";
export interface IUploadActionParam extends IHttpActionParam {
    filePath?: string;
}
/**
 *
 * 请求http接口的接口
 */
export default class extends UrlAction {
    protected opt: IUploadActionParam;
    needInScreen(): boolean;
    constructor(param?: IUploadActionParam, afterProcess?: IAfterProcess);
    protected getDefHttpParam(): IHttpActionParam;
    protected getHttpUrl(): string;
    getName(): string;
    protected getHttpParam(): any;
    protected submit(url: string, httpParam: any, headers: any): Promise<any>;
    protected getFilePath(): string;
    protected getHeader(): any;
}
