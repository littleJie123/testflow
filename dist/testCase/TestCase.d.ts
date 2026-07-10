import BaseTest from "./BaseTest";
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
export default abstract class TestCase extends BaseTest {
    protected index: number;
    protected autoMdFilePath: string;
    protected sourceFilePath: string;
    setIndex(index: any): void;
    setAutoMdFilePath(filePath: string): void;
    setSourceFilePath(filePath: string): void;
    protected processError(e: Error): void;
    needInScreen(): boolean;
    protected needThrowError(): boolean;
    protected couldLookDetail(): boolean;
    clone(): TestCase;
    doTest(): Promise<any>;
    getActions(): BaseTest[];
    private mergeAutoMdAction;
    protected abstract buildActions(): BaseTest[];
    abstract getName(): string;
    toJson(): any;
    toString(): string;
}
