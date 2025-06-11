import ITest from "../inf/ITest";
import TestLogger from "../testLog/TestLogger";
import TestRunner from "../testRunner/TestRunner";
import BaseTest from "./BaseTest";

/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例 
 */
export default abstract class TestCase extends BaseTest  {
  
  

  protected processError(e:Error){
    let logger = this.getTestLogger();
    logger.error(`${this.getName()} 运行出错`) 
  }
  
  needInScreen(){
    return true;
  }

  protected init(){
    this.variable = null;
    this.testLogger = null;
    
  }

  

  async doTest(): Promise<any> {
    
    let result = null;
    for(let action of this.getActions()){
      let objAction:any = action as any;
      if(objAction.beforeRun){
        objAction.beforeRun();
      }
    }
    for(let action of this.getActions()){
      let objAction:any = action as any;
      if(objAction.setTestLogger){
        objAction.setTestLogger(this.getTestLogger());
      }
      if(objAction.setVariable){
        objAction.setVariable(this.getVariable());
      }
     
      if(objAction.setEnv){
        objAction.setEnv(this.env);
      }
      result = await action.test();
    }
    return result;
    
    
  }
  

  getActions():BaseTest[]{
    
    return this.buildActions();
  };

  protected abstract buildActions():BaseTest[];

 
  abstract getName():string;

  toJson(): any {
    
    let json = {
      id:this.testId,
      name:this.getName(),
      status:this.getStatus(),
      
    }
    return json;
  }
}