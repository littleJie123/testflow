import ITest from "../inf/ITest";
import BaseTest from "./BaseTest";
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
export default abstract class TestCase extends BaseTest {
    private testId;
    setTestId(testId: string): void;
    getTestId(): string;
    protected processError(e: Error): void;
    run(param?: any, env?: string): Promise<void>;
    protected init(): void;
    doTest(): Promise<any>;
    getActions(): ITest[];
    protected abstract buildActions(): ITest[];
    abstract getName(): string;
    toJson(): any;
}
