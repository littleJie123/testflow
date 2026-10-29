import IBaseTestOpt from "../inf/IBaseTestOpt";
import BaseTest from "./BaseTest";
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
export default abstract class TestCase extends BaseTest {
    protected index: number;
    protected autoMdFilePath: string;
    protected sourceFilePath: string;
    constructor(opt?: IBaseTestOpt);
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
    /**
     * 自身标记了高亮，或任一子步骤高亮，都视为高亮。
     * 子步骤如果也是 TestCase，会继续看它的子步骤。
     */
    needHighlight(): boolean;
    toJson(): any;
    toString(): string;
}
