import { TestCase, TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";

export default class GetTestCase extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let test:TestCase =testRunner.getTestById(param.id);
    if(test == null){
      return {};
    }
    let logger = test.getTestLogger()
    return {
      name: test.getName(),
      actions:test.getActions().map((item)=>{
        return item.toJson();
      }),
      logs:logger.getLogs()
    }
  }

}