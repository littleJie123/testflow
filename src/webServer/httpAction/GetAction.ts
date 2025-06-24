import { TestCase, TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";

export default class GetTestCase extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let action =testRunner.getActionById(param.id);
    if(action == null){
      return {};
    }
    let logger = action.getTestLogger()
    return {
      name: action.getName(),
      paramMeta:action.getParamMeta(),
      logs:logger.getLogs(),
      defParam:action.buildDefParam(),
      status:action.getRunStatus()
    }
  }

}