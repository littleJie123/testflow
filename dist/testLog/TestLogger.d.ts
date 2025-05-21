export default class TestLogger {
    errorOnException(e: Error): void;
    private addLogObj;
    save(): void;
    private level;
    private logs;
    log(message: string): void;
    error(message: string): void;
    private addLog;
    addLevel(): void;
    subLevel(): void;
}
