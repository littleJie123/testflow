import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";

export default class RunTest implements IControl {
  process(param?: any) {
    let testRunner = TestRunner.get();
    let testCase = testRunner.getTestById(param.id);
    if(testCase){
      testCase.run(param.env,param.param);
    }
     
  }

}