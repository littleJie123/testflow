import ITest from "../inf/ITest";
import TestCase from "../testCase/TestCase";

export default class  extends TestCase{
  getActions(): ITest[] {
    return [];
  }
  getName(): string {
    return '新增物料'
  }
  
}