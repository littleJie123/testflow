import BaseAction from "../BaseAction";
export default class RunTest extends BaseAction {
    process(param?: any): Promise<{
        logs: import("../../inf/ILog").default[];
        status: string;
    }>;
}
