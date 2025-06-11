import IHttpActionParam from "../inf/IHttpActionParam";
import UrlAction from "./UrlAction";


export default class extends UrlAction{
  private opt:IHttpActionParam;

  needInScreen(){
    return true;
  }
  constructor(param?:IHttpActionParam){
    super();
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
      method = 'GET';
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

}