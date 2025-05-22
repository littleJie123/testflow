import ITest from "../inf/ITest";
import TestLogger from "../testLog/TestLogger";
import TestRunner from "../testRunner/TestRunner";

const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
export default abstract class BaseTest implements ITest {

  static readonly S_Init = S_Init;
  static readonly S_Runing = S_Runing;
  static readonly S_Processed = S_Processed;
  static readonly S_Error = S_Error;
  protected testLogger:TestLogger;
  protected variable:any;
  protected param:any;
  protected result:any;

  protected env:string;

  protected status:string = S_Init;

  getStatus():string{
    return this.status;
  }
  beforeRun(){
    this.status = S_Init; 
  }
  setEnv(env:string){
    this.env = env;
  }
  protected getDatas():any{
    return {
      param:this.getParam(),
      result:this.result,
      variable:this.getVariable()
    }
  }
  setResult(result:any){
    this.result = result;
  }

   

  setParam(param:any){
    this.param = param;
  }
  protected getParam():any{
    return this.param;
  }
  setVariable(variable:any){
    this.variable = variable;
  }
  protected getVariable():any{
    if(this.variable == null){
      this.variable = TestRunner.get().getVariable();
    }
    return this.variable;
  }

  protected addVariable(variable:any){
    if(this.variable == null){
      this.variable = TestRunner.get().getVariable();
    }
    for(let key in variable){
      this.variable[key] = variable[key];
    }
       
  }
  setTestLogger(logger:TestLogger){
    this.testLogger = logger;
  }
  getTestLogger():TestLogger {
    if(this.testLogger == null){
      this.testLogger = new TestLogger();
    }
    return this.testLogger;
  }

  async test():Promise<any>{
    let logger = this.getTestLogger();
    this.status = S_Runing;
    logger.log(`${this.getName()} 开始运行`)
    logger.addLevel();
    let result = null;
    try{
      result = await this.doTest();
      await this.checkResult(result);
      await this.processResult(result);
    }catch(e){
      this.processError(e);
      this.status = S_Error;
      throw e;
    }
    this.status = S_Processed;
    logger.subLevel();
    logger.log(`${this.getName()} 运行结束`)
    return result;
  };

  protected processError(e:Error){
    let logger = this.getTestLogger();
    logger.error(`${this.getName()} 运行出错`)
    logger.errorOnException(e);
  }

  /**
   * 检查结果是否正确
   * @param result 
   */
  protected async checkResult(result:any):Promise<void>{
    
  }

  protected async processResult(result:any):Promise<void>{
    let variable = this.buildVariable(result);
    if(variable!= null){
      this.addVariable(variable);
    }
  }

  /**
   * 根据返回结构构建变量
   * @param result 
   * @returns 
   */
  protected buildVariable(result:any):any{
    return null;
  }

  abstract getName():string;

  protected abstract doTest():Promise<any>;


  toJson(){
    return {
      name:this.getName(),
      status:this.status
    }
  }
}