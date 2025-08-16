import BaseTest from "./BaseTest";
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
export default abstract class TestCase extends BaseTest {
    protected index: number;
    setIndex(index: any): void;
    protected processError(e: Error): void;
    needInScreen(): boolean;
    protected needThrowError(): boolean;
    protected couldLookDetail(): boolean;
    doTest(): Promise<any>;
    getActions(): BaseTest[];
    protected abstract buildActions(): BaseTest[];
    abstract getName(): string;
    toJson(): any;
}
