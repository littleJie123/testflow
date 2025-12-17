import { TestRunner } from "../../testflow";
import WsUtil from "../../util/WsUtil";
import BaseAction from "../BaseAction";

export default class RunTest extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let id = param.id;
    if (id instanceof Array) {
      id = id[0];
    }
    let testCase = testRunner.getTestById(id, param.path);
    if (testCase) {
      testCase.setIndex(param.index);
      testCase.setWebSocket(this.getWebSocket());
      testCase.run(param.env, param.param);
    }
  }
}