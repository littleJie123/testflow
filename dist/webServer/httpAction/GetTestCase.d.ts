import BaseAction from "../BaseAction";
export default class GetTestCase extends BaseAction {
    process(param?: any): Promise<{
        id?: undefined;
        name?: undefined;
        actions?: undefined;
    } | {
        id: any;
        name: string;
        actions: {
            name: string;
            status: string;
            id: string;
            couldLookDetail: boolean;
        }[];
    }>;
}
