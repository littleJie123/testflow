export default interface ITestConfig {
  stop?:boolean;
  changeMap?:{
    [key:string]:string|string[];
  }
}