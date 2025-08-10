import BaseAction from "../BaseAction";
export default class GetTestCase extends BaseAction {
    process(param?: any): Promise<{
        name?: undefined;
        actions?: undefined;
    } | {
        name: string;
        actions: {
            name: string;
            status: string;
            id: string;
            couldLookDetail: boolean;
        }[];
    }>;
}
