import IRunOpt from "../inf/IRunOpt";
import ITest from "../inf/ITest";
import ITestCaseInfo from "../inf/ITestCaseInfo";
import TestLogger from "../testLog/TestLogger";
import TestRunner from "../testRunner/TestRunner";
import WsUtil from "../util/WsUtil";

const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
export default abstract class BaseTest implements ITest {

  static readonly S_Init = S_Init;
  static readonly S_Runing = S_Runing;
  static readonly S_Processed = S_Processed;
  static readonly S_Error = S_Error;


  protected clazz:any

  protected testLogger:TestLogger;
  protected variable:any;
 


  protected env:string;

  protected runStatus:string = S_Init;

  protected info:ITestCaseInfo ;

  protected testId:string;
  
  protected webSocket:WebSocket;


  protected setRunStatus(status:string){
    this.runStatus = status;   
    WsUtil.send(this.webSocket, {
      id:this.testId,
      status: this.runStatus
    },'runStatus');
  }

  setWebSocket(webSocket: WebSocket) {
    this.webSocket = webSocket;
    let logger = this.getTestLogger();
    logger.setWebSocket(webSocket);
  }


  /**
   * 是否要出现在web界面的屏幕上
   * @returns 
   */
  needInScreen(){
    return false;
  }

  protected setClazz(clazz){
    this.clazz = clazz;
  }

  clone(){
    let clazz = this.clazz;
    
    let ret = new clazz();
    ret.setTestId(this.getTestId());
    return ret;
  }

  protected init(){
    this.variable = null;
    
  }

  async run(env?:string,opt?:IRunOpt): Promise<any> {
    let ret:any = null;
    this.init()
    this.setEnv(env)  
    if(opt){
      this.setVariable(opt.variable);
    }
    try{
      ret = await this.test();
    }catch(e){
      this.getTestLogger().error(e);
      this.setRunStatus(S_Error);
    }
    return ret;
  }

  setTestId(testId:string){
    this.testId = testId;
  }


  getTestId():string{
    return this.testId;
  }
  getInfo():ITestCaseInfo {
    return this.info;
  }

  setInfo(info:ITestCaseInfo){
    this.info = info;
  }

  getRunStatus():string{
    return this.runStatus;
  }
  beforeRun(){
    this.runStatus = S_Init; 
  }
  setEnv(env:string){
    this.env = env;
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
    let logger = this.getTestLogger();
    let cnt = 0
    for(let key in variable){
      logger.log(`添加变量 ${key} = ${JSON.stringify(variable[key])}`)
      this.variable[key] = variable[key];
      cnt++;
    }
    logger.log(`添加变量 共 ${cnt} 个`)
       
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

  isStop():boolean{
    return this.info?.config?.stop;
  }

  async test():Promise<any>{
    let logger = this.getTestLogger();
    this.setRunStatus( S_Runing);
    logger.log(`${this.getName()} 开始运行`)
    logger.addLevel();
    let result = null;
    try{
      result = await this.doTest();
      await this.checkResult(result);
      await this.processResult(result);
    }catch(e){
      this.processError(e);
      this.setRunStatus(S_Error);
      throw e;
    }
    this.setRunStatus(S_Processed);
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
      status:this.runStatus,
      id:this.testId
    }
  }

  getParamMeta():any{
    return null;
  }

  buildDefParam(){
    return {};
  }
}