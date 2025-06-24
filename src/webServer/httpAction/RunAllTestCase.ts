import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";

export default class  extends BaseAction {
  async process(param?: any) {
    let ids:string[] = param.ids;
    let testRunner = TestRunner.get();
    for(let id of ids){
      try{
        let testCase = testRunner.getTestById(id);
        if(testCase){
          testCase.setWebSocket(this.getWebSocket());
          testCase.run( );
        }
      }catch(e){
        
      }
    }
     
  }

}