import TestRunner from "../../testRunner/TestRunner";
import MdPathUtil from "../../util/MdPathUtil";
import BaseAction from "../BaseAction";

export default class ListTestCase extends BaseAction {

  async process(param: any) {
    let testRunner = TestRunner.get();
    const basePath = param.path ?? '';
    if (param.keyword != null && param.keyword !== '') {
      return {
        list: testRunner.searchAll(basePath, param.keyword),
      };
    }
    let testCaseList = testRunner.findAllTest(basePath);
    let list = testCaseList.map(item => item.toJson());
    let mdFiles = testRunner.findMdFiles(basePath);
    for (let mdPath of mdFiles) {
      list.push(MdPathUtil.toListJson(mdPath));
    }
    return {
      list,
    }
  }
}
