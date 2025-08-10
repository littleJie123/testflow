import BaseAction from "../BaseAction";
export default class GetTestCase extends BaseAction {
    process(param?: any): Promise<{
        name?: undefined;
        paramMeta?: undefined;
        defParam?: undefined;
        status?: undefined;
    } | {
        name: string;
        paramMeta: any;
        defParam: {};
        status: string;
    }>;
}
