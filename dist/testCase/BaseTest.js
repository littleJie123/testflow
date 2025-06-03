"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestLogger_1 = __importDefault(require("../testLog/TestLogger"));
const TestRunner_1 = __importDefault(require("../testRunner/TestRunner"));
const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
class BaseTest {
    constructor() {
        this.status = S_Init;
    }
    setClazz(clazz) {
        this.clazz = clazz;
    }
    clone() {
        let clazz = this.clazz;
        return new clazz();
    }
    init() {
        this.variable = null;
        this.testLogger = null;
    }
    async run(env, opt) {
        this.init();
        this.setEnv(env);
        if (opt) {
            this.setVariable(opt.variable);
        }
        await this.test();
    }
    setTestId(testId) {
        this.testId = testId;
    }
    getTestId() {
        return this.testId;
    }
    getInfo() {
        return this.info;
    }
    setInfo(info) {
        this.info = info;
    }
    getStatus() {
        return this.status;
    }
    beforeRun() {
        this.status = S_Init;
    }
    setEnv(env) {
        this.env = env;
    }
    setVariable(variable) {
        this.variable = variable;
    }
    getVariable() {
        if (this.variable == null) {
            this.variable = TestRunner_1.default.get().getVariable();
        }
        return this.variable;
    }
    addVariable(variable) {
        if (this.variable == null) {
            this.variable = TestRunner_1.default.get().getVariable();
        }
        for (let key in variable) {
            this.variable[key] = variable[key];
        }
    }
    setTestLogger(logger) {
        this.testLogger = logger;
    }
    getTestLogger() {
        if (this.testLogger == null) {
            this.testLogger = new TestLogger_1.default();
        }
        return this.testLogger;
    }
    isStop() {
        var _a, _b;
        return (_b = (_a = this.info) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.stop;
    }
    async test() {
        let logger = this.getTestLogger();
        this.status = S_Runing;
        logger.log(`${this.getName()} 开始运行`);
        logger.addLevel();
        let result = null;
        try {
            result = await this.doTest();
            await this.checkResult(result);
            await this.processResult(result);
        }
        catch (e) {
            this.processError(e);
            this.status = S_Error;
            throw e;
        }
        this.status = S_Processed;
        logger.subLevel();
        logger.log(`${this.getName()} 运行结束`);
        return result;
    }
    ;
    processError(e) {
        let logger = this.getTestLogger();
        logger.error(`${this.getName()} 运行出错`);
        logger.errorOnException(e);
    }
    /**
     * 检查结果是否正确
     * @param result
     */
    async checkResult(result) {
    }
    async processResult(result) {
        let variable = this.buildVariable(result);
        if (variable != null) {
            this.addVariable(variable);
        }
    }
    /**
     * 根据返回结构构建变量
     * @param result
     * @returns
     */
    buildVariable(result) {
        return null;
    }
    toJson() {
        return {
            name: this.getName(),
            status: this.status,
            id: this.testId
        };
    }
    getParamMeta() {
        return null;
    }
    buildDefParam() {
        return {};
    }
}
BaseTest.S_Init = S_Init;
BaseTest.S_Runing = S_Runing;
BaseTest.S_Processed = S_Processed;
BaseTest.S_Error = S_Error;
exports.default = BaseTest;
