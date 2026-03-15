import { TestRunner } from "../../testflow";
import BaseAction from "../BaseAction";

export default class GetTestCase extends BaseAction {
  async process(param?: any): Promise<any> {
    let testRunner = TestRunner.get();
    return {
      list: testRunner.getEnvs()
    }
  }

}