import BaseAction from "../BaseAction";
export default class extends BaseAction {
    process(param?: any): Promise<void>;
    run(param?: any): Promise<void>;
}
