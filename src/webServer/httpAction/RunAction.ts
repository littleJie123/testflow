import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";
import WsUtil from "../../util/WsUtil";

export default class RunTest extends BaseAction {
  async process(param?: any) {
    this.runParam(param)
     
  }

  private async runParam(param){
    let testRunner = TestRunner.get();
    let baseTest = testRunner.getActionById(param.id);
    if(baseTest){
 
      
      baseTest.setWebSocket(this.getWebSocket());
      let ret =await baseTest.run(param.env,{variable:param.param});
      WsUtil.send(this.getWebSocket(),ret,'runResult');
    }
  }
}