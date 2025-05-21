import ITest from "../inf/ITest";
import TestLogger from "../testLog/TestLogger";
import TestRunner from "../testRunner/TestRunner";
import BaseTest from "./BaseTest";

/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例 
 */
export default abstract class TestCase extends BaseTest  {
  
  private testId:string;
  
  setTestId(testId:string){
    this.testId = testId;
  }

  getTestId():string{
    return this.testId;
  }

  async run(param,env?:string): Promise<void> {
    this.setParam(param);
    this.init()
    this.setEnv(env)
    let log = this.getTestLogger();
    await log.save();
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
      if(objAction.setLogger){
        objAction.setLogger(this.getTestLogger());
      }
      if(objAction.setVar){
        objAction.setVariable(this.getVariable());
      }
      if(objAction.setParam){
        objAction.setParam(this.getParam());
      }
      if(objAction.setResult){
        objAction.setResult(result);
      }
      if(objAction.setEnv){
        objAction.setEnv(this.env);
      }
      result = await action.test();
    }
    return result;
    
    
  }
  

  abstract getActions():ITest[];

 
  abstract getName():string;
}