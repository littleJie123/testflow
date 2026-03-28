export default interface IAfterProcess {
    check?(result: any): any;
    buildVariable?(result: any): any;
    parseHttpParam?(param: any, variable?: any): any;
    parseHttpHeader?(header: any): any;
}
