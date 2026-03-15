import ITestParam from '../inf/ITestParam';
import TestCase from '../testCase/TestCase';
import Directory from '../testCase/Directory';
interface EnvConfig {
    host: string;
    env?: string;
}
export default class TestRunner {
    private variable;
    private beanMap;
    private envConfig;
    private defEnv;
    private directory;
    private constructor();
    getEnvs(): EnvConfig[];
    /**
     * 根据
     * @param strPath
     */
    getStringArrayFromPath(strPath: string): string[];
    getTestById(id: string, path?: string): TestCase;
    findAllTest(path: string): TestCase[];
    private getDirectoryByPath;
    /**
     * 扫描指定目录下的文件，
     * 如果文件是js 或者ts（排除d.ts），
     * 并且文件名Test开头
     * 则实例化出来放到testMap中
     * testMap的key为文件名，value为实例化出来的对象
     * @param testPath
     */
    scan(testPath: string, directory: Directory): Promise<void>;
    /**
     * 注册环境变量
     * @param env
     * @param envConfig
     */
    regEnvConfig(env: string, envConfig: EnvConfig): void;
    getEnvConfig(key: string, env?: string): any;
    getDefEnv(): string;
    setDefEnv(env: string): void;
    /**
     * 注册bean
     * @param key
     * @param bean
     */
    regBean(key: string, bean: any): void;
    /**
     * 获取bean
     * @param key
     * @returns
     */
    getBean(key: string): any;
    addVariable(variable: any): void;
    getVariable(): any;
    start(param?: ITestParam): Promise<void>;
    private static ins;
    static get(): TestRunner;
}
export {};
