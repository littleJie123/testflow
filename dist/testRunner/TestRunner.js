"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const HttpServer_1 = __importDefault(require("../webServer/HttpServer"));
const Directory_1 = __importDefault(require("../testCase/Directory"));
class TestRunner {
    setHeadProcess(headerProcess) {
        this.headerProcess = headerProcess;
    }
    getHeadProcess() {
        return this.headerProcess;
    }
    constructor() {
        this.beanMap = {};
        this.envConfig = {};
        this.defEnv = 'local';
        this.directory = new Directory_1.default('');
        this.headerProcess = null;
    }
    getEnvs() {
        let list = [];
        for (let e in this.envConfig) {
            list.push(this.envConfig[e]);
        }
        return list;
    }
    /**
     * 根据
     * @param strPath
     */
    getStringArrayFromPath(strPath) {
        let array = strPath.split('/');
        return array;
    }
    getTestById(id, path) {
        if (path == null) {
            let index = id.lastIndexOf('/');
            path = '';
            if (index != -1) {
                path = id.substring(0, index);
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
    findAllTest(path) {
        let directory = this.getDirectoryByPath(path);
        if (directory != null) {
            return directory.getChildren();
        }
        return [];
    }
    getDirectoryByPath(path) {
        if (path == null || path == '') {
            return this.directory;
        }
        let directory = this.directory;
        let array = this.getStringArrayFromPath(path);
        for (let str of array) {
            let child = directory.getDirectoryById(str);
            if (child) {
                directory = child;
            }
            else {
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
    async scan(testPath, directory) {
        if (testPath == null || testPath == '') {
            return;
        }
        try {
            const files = fs_1.default.readdirSync(testPath);
            for (const file of files) {
                const fullPath = path_1.default.join(testPath, file);
                const stat = fs_1.default.statSync(fullPath);
                if (stat.isDirectory()) {
                    let childDirectory = new Directory_1.default(file);
                    childDirectory.setTestId(file);
                    directory.addChild(childDirectory);
                    await this.scan(fullPath, childDirectory);
                }
                else {
                    if ((file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))) {
                        try {
                            const TestClass = require(fullPath).default;
                            if (TestClass) {
                                const testInstance = new TestClass();
                                if (testInstance.needInScreen()) {
                                    testInstance.setClazz(TestClass);
                                    const fileName = path_1.default.basename(file, path_1.default.extname(file));
                                    if (testInstance.setTestId) {
                                        testInstance.setTestId(fileName);
                                        directory.addChild(testInstance);
                                    }
                                }
                            }
                        }
                        catch (error) {
                            console.error(`加载测试文件失败: ${fullPath}`, error);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(`扫描目录失败: ${testPath}`, error);
            throw error;
        }
    }
    /**
     * 注册环境变量
     * @param env
     * @param envConfig
     */
    regEnvConfig(env, envConfig) {
        if (envConfig != null) {
            envConfig.env = env;
            this.envConfig[env] = envConfig;
        }
    }
    getEnvConfig(key, env) {
        if (env == null || env == '') {
            env = this.getDefEnv();
        }
        return this.envConfig[env][key];
    }
    getDefEnv() {
        return this.defEnv;
    }
    setDefEnv(env) {
        this.defEnv = env;
    }
    /**
     * 注册bean
     * @param key
     * @param bean
     */
    regBean(key, bean) {
        this.beanMap[key] = bean;
    }
    /**
     * 获取bean
     * @param key
     * @returns
     */
    getBean(key) {
        return this.beanMap[key];
    }
    addVariable(variable) {
        if (this.variable == null) {
            this.variable = {};
        }
        for (let key in variable) {
            this.variable[key] = variable[key];
        }
    }
    getVariable() {
        if (this.variable == null) {
            return {};
        }
        return {
            ...this.variable
        };
    }
    async start(param) {
        this.scan(param === null || param === void 0 ? void 0 : param.testPath, this.directory);
        if (param === null || param === void 0 ? void 0 : param.testId) {
        }
        else {
            new HttpServer_1.default().start(param);
        }
        process.on('uncaughtException', (err) => {
            console.error('Uncaught exception:', err.stack);
        });
    }
    static get() {
        if (TestRunner.ins == null) {
            TestRunner.ins = new TestRunner();
        }
        return TestRunner.ins;
    }
}
exports.default = TestRunner;
