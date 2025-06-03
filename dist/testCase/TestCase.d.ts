import BaseTest from "./BaseTest";
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
export default abstract class TestCase extends BaseTest {
    protected processError(e: Error): void;
    protected init(): void;
    doTest(): Promise<any>;
    getActions(): BaseTest[];
    protected abstract buildActions(): BaseTest[];
    abstract getName(): string;
    toJson(): any;
}
