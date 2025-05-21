import IHttpAction from "../../inf/IHttpAction";
import TestRunner from "../../testRunner/TestRunner";

export default class ListTestCase implements IHttpAction {

  process(param: any): any {
    let testRunner = TestRunner.get();
    let testCaseList = testRunner.findAllTest();
    return {
      list:testCaseList.map(item=>{
        return {
          name:item.getName(),
          id:item.getTestId(),
          status:item.getStatus()
        }
      })
    }
  }
}