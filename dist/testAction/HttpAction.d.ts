import IHttpActionParam from "../inf/IHttpActionParam";
import UrlAction from "./UrlAction";
export default class extends UrlAction {
    private opt;
    constructor(param?: IHttpActionParam);
    protected getDefHttpParam(): IHttpActionParam;
    protected getMethod(): string;
    protected getHttpUrl(): string;
    getName(): string;
    protected getHttpParam(): any;
}
