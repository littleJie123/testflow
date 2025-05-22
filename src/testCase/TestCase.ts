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
  
  private actions:ITest[];
  setTestId(testId:string){
    this.testId = testId;
  }


  getTestId():string{
    return this.testId;
  }

  protected processError(e:Error){
    let logger = this.getTestLogger();
    logger.error(`${this.getName()} 运行出错`) 
  }
  async run(param?,env?:string): Promise<void> {
    if(param == null){
      param = {};
    }
    this.setParam(param);
    this.init()
    this.setEnv(env)  
    await this.test();
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
  

  getActions():ITest[]{
    if(this.actions == null){
      this.actions = this.buildActions();
    }
    return this.actions;
  };

  protected abstract buildActions():ITest[];

 
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