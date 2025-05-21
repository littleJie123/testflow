import BaseTest from "../testCase/BaseTest";
import TestRunner from "../testRunner/TestRunner";
import HttpUtil from "../util/HttpUtil";
import JsonUtil from "../util/JsonUtil";
import { StrUtil } from "../util/StrUtil";

export default abstract class UrlAction extends BaseTest{
  
  protected abstract getHttpPram():any;
  protected abstract getHttpUrl():string;
 
  protected getMethod():string{
    return 'GET';
  }

  protected getHeader():any{
    return {}
  }

  protected parseHttpUrl():string{
    let testRunner = TestRunner.get()
    let url = this.getHttpUrl();
    if(!url.startsWith('http')){
      let host:string = testRunner.getEnvConfig('S_Host');
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
  protected async doTest(): Promise<void> {
    let httpUtil = HttpUtil.get()
    let datas = this.getDatas()
    let url = StrUtil.format(this.parseHttpUrl(),datas);
    let httpParam = JsonUtil.parseJson(this.getHttpPram(),datas)
    let headers = JsonUtil.parseJson(this.getHeader(),datas)
    return await httpUtil.request(url,
      this.getMethod(),httpParam,headers)
  }
}