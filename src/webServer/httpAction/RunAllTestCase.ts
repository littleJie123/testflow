import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";

export default class  implements IControl {
  process(param?: any) {
    let ids:string[] = param.ids;
    let testRunner = TestRunner.get();
    for(let id of ids){
      try{
        let testCase = testRunner.getTestById(id);
        if(testCase){
          testCase.run({});
        }
      }catch(e){
        
      }
    }
     
  }

}