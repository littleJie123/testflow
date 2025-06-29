import BaseAction from "../BaseAction";
export default class RunTest extends BaseAction {
    process(param?: any): Promise<void>;
    private runParam;
}
