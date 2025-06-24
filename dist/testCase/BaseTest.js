"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestLogger_1 = __importDefault(require("../testLog/TestLogger"));
const TestRunner_1 = __importDefault(require("../testRunner/TestRunner"));
const WsUtil_1 = __importDefault(require("../util/WsUtil"));
const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
class BaseTest {
    constructor() {
        this.runStatus = S_Init;
    }
    setRunStatus(status) {
        this.runStatus = status;
        WsUtil_1.default.send(this.webSocket, {
            id: this.testId,
            status: this.runStatus
        }, 'runStatus');
    }
    setWebSocket(webSocket) {
        this.webSocket = webSocket;
        let logger = this.getTestLogger();
        logger.setWebSocket(webSocket);
    }
    /**
     * 是否要出现在web界面的屏幕上
     * @returns
     */
    needInScreen() {
        return false;
    }
    setClazz(clazz) {
        this.clazz = clazz;
    }
    clone() {
        let clazz = this.clazz;
        let ret = new clazz();
        ret.setTestId(this.getTestId());
        return ret;
    }
    init() {
        this.variable = null;
    }
    async run(env, opt) {
        this.init();
        this.setEnv(env);
        if (opt) {
            this.setVariable(opt.variable);
        }
        try {
            await this.test();
        }
        catch (e) {
            this.getTestLogger().error(e);
            this.setRunStatus(S_Error);
        }
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
    getRunStatus() {
        return this.runStatus;
    }
    beforeRun() {
        this.runStatus = S_Init;
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
        let logger = this.getTestLogger();
        let cnt = 0;
        for (let key in variable) {
            logger.log(`添加变量 ${key} = ${JSON.stringify(variable[key])}`);
            this.variable[key] = variable[key];
            cnt++;
        }
        logger.log(`添加变量 共 ${cnt} 个`);
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
        this.setRunStatus(S_Runing);
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
            this.setRunStatus(S_Error);
            throw e;
        }
        this.setRunStatus(S_Processed);
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
            status: this.runStatus,
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
