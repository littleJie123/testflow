import BaseAction from "../BaseAction";
export default class GetTestCase extends BaseAction {
    process(param?: any): Promise<{
        name?: undefined;
        paramMeta?: undefined;
        logs?: undefined;
        defParam?: undefined;
        status?: undefined;
    } | {
        name: string;
        paramMeta: any;
        logs: import("../../inf/ILog").default[];
        defParam: {};
        status: string;
    }>;
}
