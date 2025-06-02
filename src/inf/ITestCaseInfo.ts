import ITestConfig from "./ITestConfig";
import ITestResult from "./ITestResult";


export default class ITestCaseInfo {
  result?:ITestResult;
  config?:ITestConfig;
  name?:string;
  status?:string;
  testId?:string;
}