import IAfterProcess from "../inf/IAfterProcess";
import IHttpActionParam from "../inf/IHttpActionParam";
import UrlAction from "./UrlAction";
/**
 * 请求http接口的接口
 */
export default class extends UrlAction {
    protected opt: IHttpActionParam;
    needInScreen(): boolean;
    protected checkHttpStatus(result: any): void;
    constructor(param?: IHttpActionParam, afterProcess?: IAfterProcess);
    protected getDefHttpParam(): IHttpActionParam;
    protected getMethod(): string;
    protected getHttpUrl(): string;
    getName(): string;
    protected getHttpParam(): any;
    protected getHeader(): any;
}
