import IControl from "../inf/IControl";

export default abstract class BaseAction implements IControl {
  
  private ws: WebSocket;
  abstract process(param?: any) :Promise<any>;
  setWebSocket(ws: WebSocket): void {
    this.ws = ws;
  }


  getWebSocket(): WebSocket {
    return this.ws;
  }
}