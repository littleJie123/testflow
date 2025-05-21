import BaseTest from "../testCase/BaseTest";
export default abstract class UrlAction extends BaseTest {
    protected abstract getHttpPram(): any;
    protected abstract getHttpUrl(): string;
    protected getMethod(): string;
    protected getHeader(): any;
    protected parseHttpUrl(): string;
    protected doTest(): Promise<void>;
}
