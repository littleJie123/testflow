import IControl from "../../inf/IControl";
export default class GetTestCase implements IControl {
    process(param?: any): {
        paramMeta?: undefined;
        logs?: undefined;
        defParam?: undefined;
        status?: undefined;
    } | {
        paramMeta: any;
        logs: import("../../inf/ILog").default[];
        defParam: {};
        status: string;
    };
}
