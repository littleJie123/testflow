import IAfterProcess from "../inf/IAfterProcess";
import IHttpActionParam from "../inf/IHttpActionParam";
import UrlAction from "./UrlAction";


export default class extends UrlAction{
  protected opt:IHttpActionParam;

  needInScreen(){
    return true;
  }
  constructor(param?:IHttpActionParam,afterProcess?:IAfterProcess){
    super(afterProcess);
    if(param == null){
      param = {};
    }else{
      param = {... param}
    }
    let def = this.getDefHttpParam();
    if(def != null){
      for(let key in def){
        if(param[key] == undefined){
          param[key] = def[key];
        }
      }
    }
    this.opt = param;
  }

  protected getDefHttpParam():IHttpActionParam{
    return null
  }
  protected getMethod(): string {
    let method = this.opt.method;
    if(method == undefined){
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
    if(param == undefined){
      param = {};
    }
    return param;
  }


  protected getHeader() {
    let headers = this.opt?.headers;
    if(headers == null){
      headers = {}
    }
    return headers;
  }
}