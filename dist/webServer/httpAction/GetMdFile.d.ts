import BaseAction from '../BaseAction';
export default class GetMdFile extends BaseAction {
    process(param?: any): Promise<{
        content: string;
        srcPath: string;
        distPath: string;
    }>;
}
