import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";

export default class RunTest extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let baseTest = testRunner.getActionById(param.id);
    if(baseTest){
 
      
      baseTest.setWebSocket(this.getWebSocket());
      baseTest.run(param.env,{variable:param.param});
      return {
        logs:baseTest.getTestLogger().getLogs(),
        status:baseTest.getRunStatus()
        
      }
    }
     
  }

}