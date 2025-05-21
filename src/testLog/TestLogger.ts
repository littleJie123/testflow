interface ILog{
  level:number;
  message:string;
  type:'log'|'error';
  stack?:string;
}
export default class TestLogger{
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
  save() {
    throw new Error("Method not implemented.");
  }
  
  private level = 0;
  private logs:ILog[] = [];
  log(message: string) {
    this.addLog('log',message);
  }
  error(message: string) {
    this.addLog('error',message);
  }
  private addLog(type:'log'|'error',message:string){
    this.logs.push({
      level:this.level,
      message,
      type
    })
  }
  addLevel(){
    this.level++;
  }
  subLevel(){
    this.level--;
  }
}