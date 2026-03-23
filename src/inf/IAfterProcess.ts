export default interface IAfterProcess {
  check?(result);

  buildVariable?(result):any;

  parseHttpParam?(param,variable?:any):any;

  parseHttpHeader?(header):any;
}