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
    return {
      name: action.getName(),
      paramMeta:action.getParamMeta(),
      defParam:action.buildDefParam(),
      status:action.getRunStatus()
    }
  }

}