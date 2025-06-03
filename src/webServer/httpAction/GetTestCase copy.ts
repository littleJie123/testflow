import { TestCase, TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";

export default class GetTestCase implements IControl {
  process(param?: any) {
    let testRunner = TestRunner.get();
    let test:TestCase =testRunner.getTestById(param.id);
    if(test == null){
      return {};
    }
    let logger = test.getTestLogger()
    return {
      actions:test.getActions().map((item)=>{
        return item.toJson();
      }),
      logs:logger.getLogs()
    }
  }

}