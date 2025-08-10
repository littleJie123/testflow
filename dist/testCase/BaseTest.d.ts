import IRunOpt from "../inf/IRunOpt";
import ITest from "../inf/ITest";
import ITestCaseInfo from "../inf/ITestCaseInfo";
import TestLogger from "../testLog/TestLogger";
export default abstract class BaseTest implements ITest {
    static readonly S_Init = "init";
    static readonly S_Runing = "runing";
    static readonly S_Processed = "processed";
    static readonly S_Error = "error";
    protected clazz: any;
    protected testLogger: TestLogger;
    protected variable: any;
    protected env: string;
    protected runStatus: string;
    protected info: ITestCaseInfo;
    protected testId: string;
    protected webSocket: WebSocket;
    protected needThrowError(): boolean;
    protected sendMsg(eventId: string, param: any): void;
    protected setRunStatus(status: string): void;
    setWebSocket(webSocket: WebSocket): void;
    /**
     * 是否要出现在web界面的屏幕上
     * @returns
     */
    needInScreen(): boolean;
    protected setClazz(clazz: any): void;
    clone(): any;
    protected init(): void;
    run(env?: string, opt?: IRunOpt): Promise<any>;
    setTestId(testId: string): void;
    getTestId(): string;
    getInfo(): ITestCaseInfo;
    setInfo(info: ITestCaseInfo): void;
    getRunStatus(): string;
    beforeRun(): void;
    setEnv(env: string): void;
    setVariable(variable: any): void;
    protected getVariable(): any;
    protected addVariable(variable: any): void;
    setTestLogger(logger: TestLogger): void;
    getTestLogger(): TestLogger;
    isStop(): boolean;
    test(): Promise<any>;
    protected processError(e: Error): void;
    protected error(message: string): void;
    protected log(message: string): void;
    expectEqualObj(obj1: any, obj2: any, msg?: string): void;
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
    protected abstract doTest(): Promise<any>;
    toJson(): {
        name: string;
        status: string;
        id: string;
        couldLookDetail: boolean;
    };
    protected couldLookDetail(): boolean;
    getParamMeta(): any;
    buildDefParam(): {};
    protected expectEqual(value1: any, value2: any, msg?: string): void;
}
