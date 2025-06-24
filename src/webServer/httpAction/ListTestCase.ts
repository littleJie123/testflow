import IControl from "../../inf/IControl";
import TestRunner from "../../testRunner/TestRunner";
import BaseAction from "../BaseAction";

export default class ListTestCase extends BaseAction {

  async process(param: any) {
    let testRunner = TestRunner.get();
    let testCaseList = testRunner.findAllTest();
    return {
      list:testCaseList.map(item=>{
        return item.toJson();
      })
    }
  }
}