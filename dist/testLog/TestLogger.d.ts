import ILog from "../inf/ILog";
export default class TestLogger {
    private level;
    private logs;
    private ws;
    setWebSocket(ws: WebSocket): void;
    getLogs(): ILog[];
    log(message: string, id?: string): void;
    error(message: string, id?: string): void;
    private addLog;
    addLevel(): void;
    subLevel(): void;
}
