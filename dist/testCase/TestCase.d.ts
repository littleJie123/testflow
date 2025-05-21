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
    run(param: any, env?: string): Promise<void>;
    protected init(): void;
    doTest(): Promise<any>;
    abstract getActions(): ITest[];
    abstract getName(): string;
}
