import ILog from "../inf/ILog";
export default class TestLogger {
    private level;
    private logs;
    getLogs(): ILog[];
    errorOnException(e: Error): void;
    private addLogObj;
    log(message: string): void;
    error(message: string): void;
    private addLog;
    addLevel(): void;
    subLevel(): void;
}
