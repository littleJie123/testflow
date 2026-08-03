import { BaseTest } from "../testflow";
import ISetVariableParam from "../inf/ISetVarableParam";

export default class SetVariable extends BaseTest{
  private variableParam:ISetVariableParam;
  constructor(opt?:ISetVariableParam){
    super();
    this.variableParam = opt;
    if (opt?.remark != null) {
      this.remark = opt.remark;
    }
    if (opt?.highlight != null) {
      this.highlight = opt.highlight;
    }
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