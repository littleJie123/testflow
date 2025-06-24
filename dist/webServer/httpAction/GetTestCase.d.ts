import BaseAction from "../BaseAction";
export default class GetTestCase extends BaseAction {
    process(param?: any): Promise<{
        name?: undefined;
        actions?: undefined;
        logs?: undefined;
    } | {
        name: string;
        actions: {
            name: string;
            status: string;
            id: string;
        }[];
        logs: import("../../inf/ILog").default[];
    }>;
}
