import fs from 'fs';
import path from 'path';
import ITestParam from '../inf/ITestParam';
import HttpServer from '../webServer/HttpServer';
import TestCase from '../testCase/TestCase';
import FileUtil from '../util/FileUtil';
import { BaseTest } from '../testflow';
export default class TestRunner {
  
  
  
  private variable: any;
  private beanMap:any = {};

  private envConfig:any = {}; 

  private defEnv:string = 'local';

  private testMap:{[key:string]:TestCase} = {};

  private actionMap:{[key:string]:BaseTest} = {};
  private constructor(){

  }

  getActionById(id: string):BaseTest {
    let ret = this.actionMap[id];
    if(ret == null){
      return null;
    }
    return ret.clone();
  }

  findAllAction():BaseTest[] {
    let ret:BaseTest[] = [];
    for(let key in this.actionMap){
      ret.push(this.actionMap[key]);
    }
    return ret;
  }
  getTestById(id: string): TestCase {
    let ret:TestCase = this.testMap[id];
    if(ret){
      
      let clone = ret.clone();
      return clone;
    }
    return null;
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

  
  async scan(testPath: string,map:any,rootTestPath?:string[]) {
    if(testPath == null || testPath == ''){
      return ;
    }
  
    // 第一次调用时保存根路径
    if(!rootTestPath) {
      rootTestPath = [];
    }
    
    try {
      const files = fs.readdirSync(testPath);

      for (const file of files) {
        const fullPath = path.join(testPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          await this.scan(fullPath,map,[... rootTestPath,file]);
        } else {
          if ((file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))) {
            try {
              const TestClass = require(fullPath).default;
              if (TestClass) {
                const testInstance = new TestClass();
                if(testInstance.needInScreen()){
                  testInstance.setClazz(TestClass);
                  const fileName = path.basename(file, path.extname(file));
                  
                  // 计算相对路径
                  //let relativePath = path.relative(rootTestPath, path.dirname(fullPath));
                  // 如果有相对路径，则组合路径和文件名
                  let testId = `${rootTestPath.join('_')}_${fileName}`;
                  
                  if(testInstance.setTestId){
                    testInstance.setTestId(testId);
                    map[testId] = testInstance;
                  }
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


  async start(param?:ITestParam){
    console.log('--------- scan ----------------');
    this.scan(param?.testPath,this.testMap);
    this.scan(param?.actionPath,this.actionMap);
    if(param?.testId ){
      
      
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