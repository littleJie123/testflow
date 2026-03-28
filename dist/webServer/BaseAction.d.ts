import IControl from "../inf/IControl";
export default abstract class BaseAction implements IControl {
    private ws;
    abstract process(param?: any): Promise<any>;
    setWebSocket(ws: WebSocket): void;
    getWebSocket(): WebSocket;
}
