import ITestParam from '../inf/ITestParam';
import TestCase from '../testCase/TestCase';
export default class TestRunner {
    private variable;
    private beanMap;
    private envConfig;
    private defEnv;
    private testMap;
    private constructor();
    getTestById(id: string): TestCase;
    findAllTest(): TestCase[];
    /**
     * 扫描指定目录下的文件，
     * 如果文件是js 或者ts（排除d.ts），
     * 并且文件名Test开头
     * 则实例化出来放到testMap中
     * testMap的key为文件名，value为实例化出来的对象
     * @param testPath
     */
    scan(testPath: string): Promise<void>;
    /**
     * 注册环境变量
     * @param env
     * @param envConfig
     */
    regEnvConfig(env: string, envConfig: any): void;
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
