import ILog from "../inf/ILog";
import WsUtil from "../util/WsUtil";

type LogType='log'|'error';
export default class TestLogger{
  
  private level = 0;
  private logs:ILog[] = [];
  private ws:WebSocket;
  setWebSocket(ws: WebSocket) {
    this.ws = ws;
  }
  getLogs() {
    let logs = [... this.logs]
    return logs;
  }
  errorOnException(e: Error) {
    this.addLogObj({
      level:this.level,
      message:e.message,
      type:'error',
      stack:e.stack
    })
  }

  private addLogObj(log: ILog) {
    this.logs.push(log);
  }
  
  
  
  log(message: string) {
    this.addLog('log',message);
  }
  error(message: string) {
    this.addLog('error',message);
  }
  private addLog(type:LogType,message:string){
    const log = {
      level:this.level,
      message,
      type
    }
    this.logs.push(log)
    console.log(log)
    WsUtil.send(this.ws, log,'log');
  }
  addLevel(){
    this.level++;
  }
  subLevel(){
    this.level--;
  }
}