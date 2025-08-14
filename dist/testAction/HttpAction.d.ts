import IAfterProcess from "../inf/IAfterProcess";
import IHttpActionParam from "../inf/IHttpActionParam";
import UrlAction from "./UrlAction";
export default class extends UrlAction {
    protected opt: IHttpActionParam;
    needInScreen(): boolean;
    constructor(param?: IHttpActionParam, afterProcess?: IAfterProcess);
    protected getDefHttpParam(): IHttpActionParam;
    protected getMethod(): string;
    protected getHttpUrl(): string;
    getName(): string;
    protected getHttpParam(): any;
    protected getHeader(): any;
}
