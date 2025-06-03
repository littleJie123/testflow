import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";

export default class RunTest implements IControl {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let baseTest = testRunner.getActionById(param.id);
    if(baseTest){
      await baseTest.run(param.env,{variable:param.param});
      return {
        logs:baseTest.getTestLogger().getLogs(),
        status:baseTest.getStatus()
        
      }
    }
     
  }

}