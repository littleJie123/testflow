import BaseAction from "../BaseAction";
export default class ListTestCase extends BaseAction {
    process(param: any): Promise<{
        list: any[];
    }>;
}
