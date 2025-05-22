import IControl from "../../inf/IControl";
export default class GetTestCase implements IControl {
    process(param?: any): {
        actions?: undefined;
        logs?: undefined;
    } | {
        actions: any[];
        logs: import("../../inf/ILog").default[];
    };
}
