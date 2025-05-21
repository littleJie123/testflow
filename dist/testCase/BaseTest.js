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
    getStatus() {
        return this.status;
    }
    beforeRun() {
        this.status = S_Init;
    }
    setEnv(env) {
        this.env = env;
    }
    getDatas() {
        return {
            param: this.getParam(),
            result: this.result,
            variable: this.getVariable()
        };
    }
    setResult(result) {
        this.result = result;
    }
    setParam(param) {
        this.param = param;
    }
    getParam() {
        return this.param;
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
    getTestLogger() {
        if (this.testLogger == null) {
            this.testLogger = new TestLogger_1.default();
        }
        return this.testLogger;
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
            logger.error(`${this.getName()} 运行出错`);
            logger.errorOnException(e);
            this.status = S_Error;
            throw e;
        }
        this.status = S_Processed;
        logger.subLevel();
        logger.log(`${this.getName()} 运行结束`);
        return result;
    }
    ;
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
}
BaseTest.S_Init = S_Init;
BaseTest.S_Runing = S_Runing;
BaseTest.S_Processed = S_Processed;
BaseTest.S_Error = S_Error;
exports.default = BaseTest;
