import BaseTest from '../testCase/BaseTest';
export default class MdFileAction extends BaseTest {
    private filePath;
    constructor(filePath: string, dirname?: string);
    getName(): string;
    needInScreen(): boolean;
    protected couldLookDetail(): boolean;
    protected doTest(): Promise<void>;
    getFilePath(): string;
    toJson(): {
        name: string;
        status: string;
        id: string;
        couldLookDetail: boolean;
        actionType: string;
        filePath: string;
        srcPath: string;
        distPath: string;
    };
}
