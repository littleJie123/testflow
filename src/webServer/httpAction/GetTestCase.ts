import { TestCase, TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";

export default class GetTestCase extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let test:TestCase =testRunner.getTestById(param.id);
    if(test == null){
      return {};
    }
    return {
      id:param.id,
      name: test.getName(),
      actions:test.getActions().map((item)=>{
        return item.toJson();
      })
    }
  }

}