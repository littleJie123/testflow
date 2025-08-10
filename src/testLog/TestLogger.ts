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
 

 
  
  
  
  log(message: string,id?:string) {
    this.addLog('log',message,id);
  }
  error(message: string,id?:string) {
    this.addLog('error',message,id);
  }
  private addLog(type:LogType,message:string,id?:string){
    const log = {
      level:this.level,
      message,
      type,
      id
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