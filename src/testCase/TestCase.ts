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

  

  

  async doTest(): Promise<any> {
    
    let result = null;
    let actions = this.getActions();
    for(let action of actions){
      action.setWebSocket(this.webSocket);
      let objAction:any = action as any;
      if(objAction.beforeRun){
        objAction.beforeRun();
      }
    }
    for(let action of actions){
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
    
    let list = this.buildActions();
    let id = 0;
    for(let row of list){
      row.setTestId(`${this.testId}-${id++}`);
    }
    return list;
  };

  protected abstract buildActions():BaseTest[];

 
  abstract getName():string;

  toJson(): any {
    
    let json = {
      id:this.testId,
      name:this.getName(),
      status:this.getRunStatus(),
      
    }
    return json;
  }
}