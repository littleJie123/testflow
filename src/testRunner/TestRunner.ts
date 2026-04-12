import fs from 'fs';
import path from 'path';
import ITestParam from '../inf/ITestParam';
import HttpServer from '../webServer/HttpServer';
import TestCase from '../testCase/TestCase';
import FileUtil from '../util/FileUtil';
import { BaseTest } from '../testflow';
import Directory from '../testCase/Directory';
import { dir } from 'console';

interface EnvConfig {
  host: string;
  env?: string;
}

interface HeaderProcess {
  processHeader(header: any): any;
}
export default class TestRunner {



  private variable: any;
  private beanMap: any = {};

  private envConfig: { [key: string]: EnvConfig } = {};

  private defEnv: string = 'local';

  private directory: Directory = new Directory('');


  private headerProcess: HeaderProcess = null;

  setHeadProcess(headerProcess: HeaderProcess) {
    this.headerProcess = headerProcess;
  }

  getHeadProcess() {
    return this.headerProcess
  }
  private constructor() {

  }
  getEnvs(): EnvConfig[] {
    let list: EnvConfig[] = [];
    for (let e in this.envConfig) {
      list.push(this.envConfig[e])
    }
    return list;
  }

  /**
   * 根据
   * @param strPath 
   */
  getStringArrayFromPath(strPath: string): string[] {
    let array = strPath.split('/');
    return array;
  }





  getTestById(id: string, path?: string): TestCase {
    if (path == null) {
      let index = id.lastIndexOf('/')
      path = '';
      if (index != -1) {
        path = id.substring(0, index)
        id = id.substring(index + 1);
      }

    }
    let directory = this.getDirectoryByPath(path);
    if (directory != null) {

      let testCase = directory.getChildById(id);
      if (testCase == null) {
        return null;
      }
      return testCase.clone();
    }
    return null;
  }

  findAllTest(path: string): TestCase[] {

    let directory = this.getDirectoryByPath(path);
    if (directory != null) {
      return directory.getChildren()
    }
    return []
  }

  private getDirectoryByPath(path: string): Directory {
    if (path == null || path == '') {
      return this.directory
    }
    let directory = this.directory;
    let array = this.getStringArrayFromPath(path);
    for (let str of array) {

      let child = directory.getDirectoryById(str);
      if (child) {
        directory = child;
      } else {
        return directory;
      }
    }
    return directory;
  }
  /**
   * 扫描指定目录下的文件，
   * 如果文件是js 或者ts（排除d.ts），
   * 并且文件名Test开头
   * 则实例化出来放到testMap中
   * testMap的key为文件名，value为实例化出来的对象
   * @param testPath 
   */


  async scan(testPath: string, directory: Directory) {
    if (testPath == null || testPath == '') {
      return;
    }



    try {
      const files = fs.readdirSync(testPath);

      for (const file of files) {
        const fullPath = path.join(testPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          let childDirectory = new Directory(file);
          childDirectory.setTestId(file);
          directory.addChild(childDirectory);
          await this.scan(fullPath, childDirectory);
        } else {
          if ((file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))) {
            try {
              const TestClass = require(fullPath).default;
              if (TestClass) {
                const testInstance = new TestClass();
                if (testInstance.needInScreen()) {
                  testInstance.setClazz(TestClass);
                  const fileName = path.basename(file, path.extname(file));
                  if (testInstance.setTestId) {
                    testInstance.setTestId(fileName);
                    directory.addChild(testInstance);
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
  regEnvConfig(env: string, envConfig: EnvConfig) {
    if (envConfig != null) {
      envConfig.env = env;
      this.envConfig[env] = envConfig;
    }
  }

  getEnvConfig(key: string, env?: string): any {
    if (env == null || env == '') {
      env = this.getDefEnv();
    }
    return this.envConfig[env][key];
  }

  getDefEnv(): string {
    return this.defEnv;
  }

  setDefEnv(env: string) {
    this.defEnv = env;
  }


  /**
   * 注册bean
   * @param key 
   * @param bean 
   */
  regBean(key: string, bean: any) {
    this.beanMap[key] = bean;
  }
  /**
   * 获取bean
   * @param key 
   * @returns 
   */
  getBean(key: string) {
    return this.beanMap[key];
  }



  addVariable(variable: any) {
    if (this.variable == null) {
      this.variable = {}
    }
    for (let key in variable) {
      this.variable[key] = variable[key];
    }
  }
  getVariable(): any {
    if (this.variable == null) {
      return {}
    }
    return {
      ... this.variable
    }
  }


  async start(param?: ITestParam) {
    this.scan(param?.testPath, this.directory);
    if (param?.testId) {


    } else {
      new HttpServer().start(param);
    }
    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err.stack);
    });
  }

  private static ins: TestRunner;
  static get() {
    if (TestRunner.ins == null) {
      TestRunner.ins = new TestRunner();
    }
    return TestRunner.ins;
  }
}