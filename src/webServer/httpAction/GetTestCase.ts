import { BaseTest, TestCase, TestRunner } from "../../testflow";
import BaseAction from "../BaseAction";

export default class GetTestCase extends BaseAction {
  async process(param?: any) {
    let testRunner = TestRunner.get();
    let test: TestCase = testRunner.getTestById(param.id);
    if (test == null) {
      return {};
    }
    return {
      id: param.id,
      name: test.getName(),
      actions: test.getActions().map((item) => this.serializeAction(item))
    }
  }

  private serializeAction(item: BaseTest): any {
    const json: any = item.toJson();
    if (item instanceof TestCase) {
      const subActions = item.getActions();
      if (subActions.length > 0) {
        json.actionType = 'testCase';
        json.couldLookDetail = true;
        json.actions = subActions.map(sub => sub.toJson());
      }
    }
    return json;
  }

}
