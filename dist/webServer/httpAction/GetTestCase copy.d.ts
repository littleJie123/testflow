import IControl from "../../inf/IControl";
export default class GetTestCase implements IControl {
    process(param?: any): {
        actions?: undefined;
        logs?: undefined;
    } | {
        actions: {
            name: string;
            status: string;
            id: string;
        }[];
        logs: import("../../inf/ILog").default[];
    };
}
