import BaseTest from "../testCase/BaseTest";
export default abstract class UrlAction extends BaseTest {
    protected httpStatus?: number;
    protected checkResult(result: any): Promise<void>;
    protected checkHttpStatus(result: any): void;
    protected getHttpParam(): any;
    protected abstract getHttpUrl(): string;
    protected getMethod(): string;
    protected getHeader(): any;
    protected parseHttpUrl(): string;
    protected parseHttpParam(): any;
    protected parseHttpHeaders(): any;
    protected doTest(): Promise<void>;
    buildDefParam(): any;
    getHeaderMeta(): any;
}
