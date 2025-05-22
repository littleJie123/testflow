export default interface ILog{
  level:number;
  message:string;
  type:'log'|'error';
  stack?:string;
}