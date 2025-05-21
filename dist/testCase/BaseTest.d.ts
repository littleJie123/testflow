import ITest from "../inf/ITest";
import TestLogger from "../testLog/TestLogger";
export default abstract class BaseTest implements ITest {
    static readonly S_Init = "init";
    static readonly S_Runing = "runing";
    static readonly S_Processed = "processed";
    static readonly S_Error = "error";
    protected testLogger: TestLogger;
    protected variable: any;
    protected param: any;
    protected result: any;
    protected env: string;
    protected status: string;
    getStatus(): string;
    beforeRun(): void;
    setEnv(env: string): void;
    protected getDatas(): any;
    setResult(result: any): void;
    setParam(param: any): void;
    protected getParam(): any;
    protected getVariable(): any;
    protected addVariable(variable: any): void;
    protected getTestLogger(): TestLogger;
    test(): Promise<any>;
    /**
     * 检查结果是否正确
     * @param result
     */
    protected checkResult(result: any): Promise<void>;
    protected processResult(result: any): Promise<void>;
    /**
     * 根据返回结构构建变量
     * @param result
     * @returns
     */
    protected buildVariable(result: any): any;
    abstract getName(): string;
    protected abstract doTest(): Promise<void>;
}
