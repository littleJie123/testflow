import { BaseTest } from "../testflow";
import ISetVariableParam from "../inf/ISetVarableParam";

export default class SetVariable extends BaseTest{
  private variableParam:ISetVariableParam;
  constructor(opt?:ISetVariableParam){
    super();
    this.variableParam = opt;
  }
  getName(): string {
    return `设置变量:${this.variableParam.name}`
  }
  protected async doTest(): Promise<any> {
     
  }

  protected buildVariable(result: any) {
    return this.variableParam.variable;
  }

}