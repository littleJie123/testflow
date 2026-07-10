import ITest from "../inf/ITest";
import TestLogger from "../testLog/TestLogger";
import TestRunner from "../testRunner/TestRunner";
import BaseTest from "./BaseTest";
import MdFileAction from "../testAction/MdFileAction";
import MdPathUtil from "../util/MdPathUtil";

/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例 
 */
export default abstract class TestCase extends BaseTest {
  protected index: number;
  protected autoMdFilePath: string;
  protected sourceFilePath: string;

  setIndex(index: any) {
    this.index = index;
  }

  setAutoMdFilePath(filePath: string) {
    this.autoMdFilePath = filePath;
  }

  setSourceFilePath(filePath: string) {
    this.sourceFilePath = filePath;
  }

  protected processError(e: Error) {
    this.error(`${this.getName()} 运行出错!!`)
  }

  needInScreen() {
    return true;
  }

  protected needThrowError(): boolean {
    return false;
  }

  protected couldLookDetail() {
    return false;
  }

  clone(): TestCase {
    let ret: TestCase = super.clone() as TestCase;
    ret.setAutoMdFilePath(this.autoMdFilePath);
    ret.setSourceFilePath(this.sourceFilePath);
    return ret;
  }

  async doTest(): Promise<any> {

    let result = null;
    let actions = this.getActions();
    for (let action of actions) {
      action.setWebSocket(this.webSocket);
      let objAction: any = action as any;
      if (objAction.beforeRun) {
        objAction.beforeRun();
      }
    }
    for (let action of actions) {
      let objAction: any = action as any;
      if (objAction.setTestLogger) {
        objAction.setTestLogger(this.getTestLogger());
      }
      if (objAction.setVariable) {
        objAction.setVariable(this.getVariable());
      }

      if (objAction.setEnv) {
        objAction.setEnv(this.env);
      }
      result = await action.test();
      if (action.getRunStatus() === BaseTest.S_Error) {
        throw new Error(`${action.getName()} 运行失败`);
      }
    }
    return result;


  }


  getActions(): BaseTest[] {

    let list = this.buildActions();
    list = this.mergeAutoMdAction(list);
    let id = 0;
    for (let row of list) {
      row.setTestId(`${this.testId}-${id++}`);
    }
    if (this.index == null) {
      return list;
    } else {
      return list.slice(0, this.index + 1);
    }
  };

  private mergeAutoMdAction(list: BaseTest[]): BaseTest[] {
    if (this.autoMdFilePath == null) {
      return list;
    }
    const alreadyHas = list.some((a) => {
      return a instanceof MdFileAction
        && MdPathUtil.sameMdFile(a.getFilePath(), this.autoMdFilePath);
    });
    if (alreadyHas) {
      return list;
    }
    return [new MdFileAction(this.autoMdFilePath), ...list];
  }

  protected abstract buildActions(): BaseTest[];


  abstract getName(): string;

  toJson(): any {

    let json = {
      id: this.testId,
      name: this.getName(),
      status: this.getRunStatus(),

    }
    return json;
  }

  toString(): string {
    return `testcase:${this.getName()}`;
  }
}
