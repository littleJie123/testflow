"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const HttpServer_1 = __importDefault(require("../webServer/HttpServer"));
class TestRunner {
    constructor() {
        this.beanMap = {};
        this.envConfig = {};
        this.defEnv = 'local';
        this.testMap = {};
    }
    getTestById(id) {
        return this.testMap[id];
    }
    findAllTest() {
        let result = [];
        for (let key in this.testMap) {
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
    async scan(testPath) {
        if (testPath == null || testPath == '') {
            return;
        }
        try {
            // 读取目录内容
            const files = fs_1.default.readdirSync(testPath);
            for (const file of files) {
                const fullPath = path_1.default.join(testPath, file);
                const stat = fs_1.default.statSync(fullPath);
                if (stat.isDirectory()) {
                    // 如果是目录，递归扫描
                    await this.scan(fullPath);
                }
                else {
                    // 检查文件是否符合条件：
                    // 1. 文件名以Test开头
                    // 2. 扩展名为.js或.ts（排除.d.ts）
                    if ((file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))) {
                        try {
                            // 动态导入测试文件
                            const TestClass = require(fullPath).default;
                            if (TestClass) {
                                // 实例化测试类并存储到testMap中
                                const testInstance = new TestClass();
                                const fileName = path_1.default.basename(file, path_1.default.extname(file));
                                if (testInstance.setTestId) {
                                    testInstance.setTestId(fileName);
                                    this.testMap[fileName] = testInstance;
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
        this.envConfig[env] = envConfig;
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
    start(param) {
        console.log('--------- scan ----------------');
        this.scan(param === null || param === void 0 ? void 0 : param.testPath);
        if (param === null || param === void 0 ? void 0 : param.testId) {
            let testCase = this.testMap[param.testId];
            if (testCase) {
                testCase.run({});
            }
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
