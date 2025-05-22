import fs from 'fs';
import path from 'path';
import ITestParam from '../inf/ITestParam';
import HttpServer from '../webServer/HttpServer';
import TestCase from '../testCase/TestCase';
export default class TestRunner {
  
  private variable: any;
  private beanMap:any = {};

  private envConfig:any = {}; 

  private defEnv:string = 'local';

  private testMap:{[key:string]:TestCase} = {};

  private constructor(){

  }

  getTestById(id: string): TestCase {
    return this.testMap[id];
  }

  findAllTest():TestCase[]{
    let result:TestCase[] = [];
    for(let key in this.testMap){
      result.push(this.testMap[key]);
    }
    return result;
  }
  /**
   * 扫描指定目录下的文件，
   * 如果文件是js 或者ts（排除d.ts），
   * 并且文件名Test开头
   * 则实例化出来放到testMap中
   * testMap的key为文件名，value为实例化出来的对象
   * @param testPath 
   */
  async scan(testPath: string) {
    
    if(testPath == null || testPath == ''){
      return ;
    }
    try {
      // 读取目录内容
      const files = fs.readdirSync(testPath);

      for (const file of files) {
        const fullPath = path.join(testPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 如果是目录，递归扫描
          await this.scan(fullPath);
        } else {
          // 检查文件是否符合条件：
          // 1. 文件名以Test开头
          // 2. 扩展名为.js或.ts（排除.d.ts）
          if (
             
            (file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))
          ) {
            try {
              // 动态导入测试文件
              const TestClass = require(fullPath).default;
              if (TestClass) {
                // 实例化测试类并存储到testMap中
                const testInstance = new TestClass();
                const fileName = path.basename(file, path.extname(file));
                if(testInstance.setTestId){
                  testInstance.setTestId(fileName);
                  this.testMap[fileName] = testInstance;
                }
              }
            } catch (error) {
              console.error(`加载测试文件失败: ${fullPath}`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error(`扫描目录失败: ${testPath}`, error);
      throw error;
    }
  }

  /**
   * 注册环境变量
   * @param env 
   * @param envConfig 
   */
  regEnvConfig(env:string,envConfig:any){
    this.envConfig[env] = envConfig;
  }

  getEnvConfig(key:string,env?:string):any{
    if(env == null || env == ''){
      env = this.getDefEnv();
    }
    return this.envConfig[env][key];
  }

  getDefEnv():string{
    return this.defEnv;
  }

  setDefEnv(env:string){
    this.defEnv = env;
  }


  /**
   * 注册bean
   * @param key 
   * @param bean 
   */
  regBean(key:string,bean:any){
    this.beanMap[key] = bean;
  }
  /**
   * 获取bean
   * @param key 
   * @returns 
   */
  getBean(key:string){
    return this.beanMap[key];
  }



  addVariable(variable: any) {
    if(this.variable == null) {
      this.variable = {}
    }
    for(let key in variable){
      this.variable[key] = variable[key];
    }
  }
  getVariable(): any {
    if(this.variable == null) {
      return {}
    }
    return {
      ... this.variable
    }
  }


  start(param?:ITestParam){
    console.log('--------- scan ----------------');
    this.scan(param?.testPath);
    if(param?.testId ){
      let testCase = this.testMap[param.testId];
      if(testCase){
        testCase.run({});
      }
    }else{
      new HttpServer().start(param);
    }
    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err.stack);
    });
  }

  private static ins:TestRunner;
  static get(){
    if(TestRunner.ins == null){
      TestRunner.ins = new TestRunner();
    }
    return TestRunner.ins;
  }
}