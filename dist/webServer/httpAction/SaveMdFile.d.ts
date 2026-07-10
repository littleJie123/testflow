import BaseAction from '../BaseAction';
export default class SaveMdFile extends BaseAction {
    process(param?: any): Promise<{
        ok: boolean;
        srcPath: string;
        distPath: string;
    }>;
}
