export default interface IAfterProcess {
  check?(result);

  buildVariable?(result):any;

  parseHttpParam?(param):any;

  parseHttpHeader?(header):any;
}