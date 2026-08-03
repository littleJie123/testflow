import IAfterProcess from "../inf/IAfterProcess";
import IHttpActionParam from "../inf/IHttpActionParam";
import { TestRunner } from "../testflow";
import HttpUtil from "../util/HttpUtil";
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

  needInScreen() {
    return true;
  }
  constructor(param?: IUploadActionParam, afterProcess?: IAfterProcess) {
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
  
  protected async submit(url: string, httpParam: any, headers: any): Promise<any> {
    let httpUtil = HttpUtil.get();
    return await httpUtil.upload(url,this.getFilePath(),httpParam,headers);
  }

  protected getFilePath(): string {
    return this.opt.filePath;
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