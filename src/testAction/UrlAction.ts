import BaseTest from "../testCase/BaseTest";
import TestConfig from "../testRunner/TestConfig";
import TestRunner from "../testRunner/TestRunner";
import HttpUtil from "../util/HttpUtil";
import JsonUtil from "../util/JsonUtil";
import { StrUtil } from "../util/StrUtil";

export default abstract class UrlAction extends BaseTest{
  protected httpStatus?:number;

  protected async checkResult(result: any): Promise<void> {
    await super.checkResult(result);
    this.checkHttpStatus(result);
  }

  protected checkHttpStatus(result:any){ 
    if(this.httpStatus != null){ 
      if(this.httpStatus >= 400){
        let loger = this.getTestLogger();
        loger.error(JSON.stringify(result));
        throw new Error(`${this.getName()} http status: ${this.httpStatus}`)
      }
    }
  }
  protected getHttpParam():any{
    return {};
  }
  protected abstract getHttpUrl():string;
 
  protected getMethod():string{
    return 'POST';
  }

  protected getHeader():any{
    return {}
  }

  protected parseHttpUrl():string{
    let testRunner = TestRunner.get()
    let url = this.getHttpUrl();
    if(url == null){
      throw new Error('请设置url');
    }
    if(!url.startsWith('http')){
      let host:string = testRunner.getEnvConfig(TestConfig.S_Host,this.env);
      if(host){
        if(!url.startsWith('/')){
          url = '/' + url;
        }
        if(host.endsWith('/')){
          host = host.substring(0,host.length - 1);
        }
        url = host + url;
      }
    }
    return url;
  }

  protected parseHttpParam(){
    let datas = this.getVariable();
    let ret =  JsonUtil.parseJson(this.getHttpParam(),datas,{keyMap:this.getParamMeta()})
    if(this.afterProcess?.parseHttpParam){
      ret = this.afterProcess.parseHttpParam(ret)
    }
    return ret;
  }

  protected parseHttpHeaders(){
    let datas = this.getVariable();
    let headers = JsonUtil.parseJson(this.getHeader(),datas,{keyMap:this.getHeaderMeta()})
    if(this.afterProcess?.parseHttpHeader){
      headers = this.afterProcess.parseHttpHeader
    }
    return headers;
  }
  protected async doTest(): Promise<void> {
    let httpUtil = HttpUtil.get()
    let datas = this.getVariable();
    let url = StrUtil.format(this.parseHttpUrl(),datas);
    let httpParam = this.parseHttpParam();
    let headers = this.parseHttpHeaders()
    let result = await httpUtil.requestStatusAndResult(
      url,
      this.getMethod(),
      httpParam,
      headers)
    this.sendMsg('httpParam',{
      id:this.getTestId(),
      url,
      param:httpParam,
      headers,
      result,
      method:this.getMethod()
    });
    this.httpStatus = result.status;
    return result.result;
  }



  buildDefParam(){
    let httpParam = this.getHttpParam();
    return JsonUtil.deParseJson(httpParam,{keyMap:this.getParamMeta()});
  }

  getHeaderMeta(){
    return null;
  }
}