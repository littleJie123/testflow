import IControl from "../../inf/IControl";
import TestRunner from "../../testRunner/TestRunner";

export default class ListTestCase implements IControl {

  process(param: any): any {
    let testRunner = TestRunner.get();
    let actionList = testRunner.findAllAction();
    return {
      list:actionList.map(item=>{
        return item.toJson();
      })
    }
  }
}