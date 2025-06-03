import { TestCase, TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";

export default class GetTestCase implements IControl {
  process(param?: any) {
    let testRunner = TestRunner.get();
    let action =testRunner.getActionById(param.id);
    if(action == null){
      return {};
    }
    let logger = action.getTestLogger()
    return {
      paramMeta:action.getParamMeta(),
      logs:logger.getLogs(),
      defParam:action.buildDefParam(),
      status:action.getStatus()
    }
  }

}