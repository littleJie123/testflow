import { after } from "node:test";
import IAfterProcess from "../inf/IAfterProcess";
import IRunOpt from "../inf/IRunOpt";
import ITest from "../inf/ITest";
import ITestCaseInfo from "../inf/ITestCaseInfo";
import TestLogger from "../testLog/TestLogger";
import TestRunner from "../testRunner/TestRunner";
import JsonUtil from "../util/JsonUtil";
import { StrUtil } from "../util/StrUtil";
import WsUtil from "../util/WsUtil";
import CheckUtil from "../util/CheckUtil";

const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
export default abstract class BaseTest implements ITest {

  static readonly S_Init = S_Init;
  static readonly S_Runing = S_Runing;
  static readonly S_Processed = S_Processed;
  static readonly S_Error = S_Error;

  protected afterProcess: IAfterProcess;

  protected clazz: any

  protected testLogger: TestLogger;
  protected variable: any;



  protected env: string;

  protected runStatus: string = S_Init;

  protected info: ITestCaseInfo;

  protected testId: string;

  protected webSocket: WebSocket;



  constructor(afterProcess?: IAfterProcess) {
    this.afterProcess = afterProcess;
  }

  protected needThrowError() {
    return true;
  }

  protected sendMsg(eventId: string, param: any) {
    WsUtil.send(this.webSocket, param, eventId)
  }


  protected setRunStatus(status: string) {
    this.runStatus = status;
    WsUtil.send(this.webSocket, {
      id: this.testId,
      status: this.runStatus
    }, 'runStatus');
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
  needInScreen() {
    return false;
  }

  protected setClazz(clazz) {
    this.clazz = clazz;
  }

  clone() {
    let clazz = this.clazz;

    let ret = new clazz();
    ret.setTestId(this.getTestId());
    return ret;
  }

  protected init() {
    this.variable = null;

  }

  async run(env?: string, opt?: IRunOpt): Promise<any> {
    let ret: any = null;
    this.init()
    this.setEnv(env)
    if (opt) {
      this.setVariable(opt.variable);
    }
    try {
      ret = await this.test();
    } catch (e) {
      this.error(e.message);
      this.setRunStatus(S_Error);
    }
    return ret;
  }

  setTestId(testId: string) {
    this.testId = testId;
  }


  getTestId(): string {
    return this.testId;
  }
  getInfo(): ITestCaseInfo {
    return this.info;
  }

  setInfo(info: ITestCaseInfo) {
    this.info = info;
  }

  getRunStatus(): string {
    return this.runStatus;
  }
  beforeRun() {
    this.runStatus = S_Init;
  }
  setEnv(env: string) {
    this.env = env;
  }

  setVariable(variable: any) {
    this.variable = variable;
  }
  protected getVariable(): any {
    if (this.variable == null) {
      this.variable = TestRunner.get().getVariable();
    }
    return this.variable;
  }

  protected addVariable(variable: any) {
    if (this.variable == null) {
      this.variable = TestRunner.get().getVariable();
    }

    let cnt = 0
    for (let key in variable) {
      if (!StrUtil.isStr(variable[key])) {
        this.log(`添加变量 ${key} = ${JSON.stringify(variable[key])}`)
      } else {
        let str = variable[key];
        if (str.length > 50) {
          str = str.substring(0, 50) + '...'
        }
        this.log(`添加变量 ${key} = ${str}`)

      }
      this.variable[key] = variable[key];
      cnt++;
    }
    this.log(`添加变量 共 ${cnt} 个`)

  }
  setTestLogger(logger: TestLogger) {
    this.testLogger = logger;
  }
  getTestLogger(): TestLogger {
    if (this.testLogger == null) {
      this.testLogger = new TestLogger();
    }
    return this.testLogger;
  }

  isStop(): boolean {
    return this.info?.config?.stop;
  }

  async test(): Promise<any> {
    let logger = this.getTestLogger();
    this.setRunStatus(S_Runing);
    this.log(`${this.getName()} 开始运行`)
    logger.addLevel();
    let result = null;
    try {
      result = await this.doTest();
      await this.checkResult(result);
      await this.processResult(result);
      this.setRunStatus(S_Processed);
    } catch (e) {
      this.processError(e);
      this.setRunStatus(S_Error);
      if (this.needThrowError()) {
        throw e;
      }
    }

    logger.subLevel();
    this.log(`${this.getName()} 运行结束`)
    return result;
  };

  protected processError(e: Error) {
    console.error(e);
    this.error(`${this.getName()} 运行出错`)
    this.error(e.message);
  }

  protected error(message: string) {
    let logger = this.getTestLogger();
    logger.error(message, this.getTestId());
  }
  protected log(message: string) {
    let logger = this.getTestLogger();
    logger.log(message, this.getTestId());
  }


  /**
   * 检查结果是否正确
   * @param result 
   */
  protected async checkResult(result: any): Promise<void> {
    let afterProcess = this.afterProcess
    if (afterProcess?.check != null) {
      await afterProcess?.check(result);
    }
  }

  protected async processResult(result: any): Promise<void> {
    try {
      let variable = this.buildVariable(result);
      if (variable != null) {
        this.addVariable(variable);
      }
    } catch (e) {
      throw new Error('添加变量出错:' + e.message);
    }
  }

  /**
   * 根据返回结构构建变量
   * @param result 
   * @returns 
   */
  protected buildVariable(result: any): any {
    let afterProcess = this.afterProcess;
    if (afterProcess?.buildVariable) {
      return afterProcess.buildVariable(result);
    }
    return null;
  }

  abstract getName(): string;

  protected abstract doTest(): Promise<any>;


  toJson() {
    return {
      name: this.getName(),
      status: this.runStatus,
      id: this.testId,
      couldLookDetail: this.couldLookDetail()
    }
  }

  protected couldLookDetail() {
    return true;
  }



  getParamMeta(): any {
    return null;
  }

  buildDefParam() {
    return {};
  }

  protected expectEqual(value1, value2, msg?: string) {
    CheckUtil.expectEqual(value1, value2, msg)
  }

  protected expectFind(array: any[], findObj: any, msg?: string) {
    CheckUtil.expectFind(array, findObj, msg)
  }
  protected expectFindByArray(array: any[], findObjs: any[], msg?: string) {
    CheckUtil.expectFindByArray(array, findObjs, msg)
  }



  protected expectNotFind(array: any[], findObj: any, msg?: string) {
    CheckUtil.expectNotFind(array, findObj, msg)
  }

  protected expectEqualObj(obj1: any, obj2: any, msg?: string) {
    CheckUtil.expectEqualObj(obj1,obj2,msg);
  }
}