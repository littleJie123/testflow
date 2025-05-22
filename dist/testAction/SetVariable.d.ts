import { BaseTest } from "../testflow";
import ISetVariableParam from "../inf/ISetVarableParam";
export default class SetVariable extends BaseTest {
    private variableParam;
    constructor(opt?: ISetVariableParam);
    getName(): string;
    protected doTest(): Promise<any>;
    protected buildVariable(result: any): any;
}
