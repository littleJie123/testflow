import IAfterProcess from "../inf/IAfterProcess";
import IHttpActionParam from "../inf/IHttpActionParam";
import { TestRunner } from "../testflow";
import UrlAction from "./UrlAction";

/**
 * 请求http接口的接口
 */
export default class extends UrlAction {
  protected opt: IHttpActionParam;

  needInScreen() {
    return true;
  }

  protected checkHttpStatus(result: any): void {
    let expectHttpStatus = this.opt?.exceptHttpStatus;
    if(expectHttpStatus == null){
      super.checkHttpStatus(result)
    }else{
      if(this.httpStatus != expectHttpStatus){
        throw new Error(`期望的状态是${expectHttpStatus},实际是${this.httpStatus}`);
        
      }
    }
  }
  constructor(param?: IHttpActionParam, afterProcess?: IAfterProcess) {
    super(afterProcess);
    if (param == null) {
      param = {};
    } else {
      param = { ...param }
    }
    let def = this.getDefHttpParam();
    if (def != null) {
      for (let key in def) {
        if (param[key] == undefined) {
          param[key] = def[key];
        }
      }
    }

    this.opt = param;
    this.highlight = param?.highlight
    if (param?.remark != null) {
      this.remark = param.remark;
    }
  }

  protected getDefHttpParam(): IHttpActionParam {
    return null
  }
  protected getMethod(): string {
    let method = this.opt.method;
    if (method == undefined) {
      method = 'POST';
    }
    return method;
  }
  protected getHttpUrl(): string {
    return this.opt.url;
  }
  getName(): string {
    return this.opt.name;
  }

  protected getHttpParam() {
    let param = this.opt.param;
    if (param == undefined) {
      param = {};
    }
    return param;
  }


  protected getHeader() {
    let headers = this.opt?.headers;
    if (headers == null) {
      headers = {}
    }
    let headerProcess = TestRunner.get().getHeadProcess();
    if (headerProcess) {
      headerProcess.processHeader(headers);
    }

    return headers;
  }
}