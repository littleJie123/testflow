import IControl from "../../inf/IControl";
export default class RunTest implements IControl {
    process(param?: any): Promise<{
        logs: import("../../inf/ILog").default[];
        status: string;
    }>;
}
