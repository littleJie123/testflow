import { TestRunner } from "../../testflow";
import WsUtil from "../../util/WsUtil";
import BaseAction from "../BaseAction";

export default class RunTest extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let testCase = testRunner.getTestById(param.id);
    if (testCase) {
      testCase.setIndex(param.index);
      testCase.setWebSocket(this.getWebSocket());
      testCase.run(param.env,param.param);
    }
  }
}