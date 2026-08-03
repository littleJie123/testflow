"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestLogger_1 = __importDefault(require("../testLog/TestLogger"));
const TestRunner_1 = __importDefault(require("../testRunner/TestRunner"));
const StrUtil_1 = require("../util/StrUtil");
const WsUtil_1 = __importDefault(require("../util/WsUtil"));
const CheckUtil_1 = __importDefault(require("../util/CheckUtil"));
const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
class BaseTest {
    constructor(afterProcess) {
        this.runStatus = S_Init;
        /** 是否在 detail 页面高亮显示该步骤 */
        this.highlight = false;
        this.afterProcess = afterProcess;
    }
    needThrowError() {
        return true;
    }
    sendMsg(eventId, param) {
        WsUtil_1.default.send(this.webSocket, param, eventId);
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
        ret.setRemark(this.remark);
        ret.setHighlight(this.highlight);
        return ret;
    }
    init() {
        this.variable = null;
    }
    async run(env, opt, index) {
        let ret = null;
        this.init();
        this.setEnv(env);
        if (opt) {
            this.setVariable(opt.variable);
        }
        try {
            ret = await this.test();
        }
        catch (e) {
            this.error(e.message);
            this.setRunStatus(S_Error);
        }
        return ret;
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
        let cnt = 0;
        for (let key in variable) {
            if (!StrUtil_1.StrUtil.isStr(variable[key])) {
                this.log(`添加变量 ${key} = ${JSON.stringify(variable[key])}`);
            }
            else {
                let str = variable[key];
                if (str.length > 50) {
                    str = str.substring(0, 50) + '...';
                }
                this.log(`添加变量 ${key} = ${str}`);
            }
            this.variable[key] = variable[key];
            cnt++;
        }
        this.log(`添加变量 共 ${cnt} 个`);
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
    needRun(variable) {
        var _a, _b, _c, _d, _e;
        if (((_a = this.afterProcess) === null || _a === void 0 ? void 0 : _a.needRunVariable) == null) {
            return true;
        }
        let key = (_c = (_b = this.afterProcess) === null || _b === void 0 ? void 0 : _b.needRunVariable) === null || _c === void 0 ? void 0 : _c.key;
        let not = (_e = (_d = this.afterProcess) === null || _d === void 0 ? void 0 : _d.needRunVariable) === null || _e === void 0 ? void 0 : _e.not;
        if (key == null) {
            return true;
        }
        let ret = variable === null || variable === void 0 ? void 0 : variable[key];
        if (not) {
            ret = !ret;
        }
        return ret;
    }
    async test() {
        let logger = this.getTestLogger();
        this.setRunStatus(S_Runing);
        this.log(`${this.getName()} 开始运行`);
        logger.addLevel();
        let result = null;
        let times = 0;
        try {
            let date = new Date();
            let variable = this.getVariable();
            if (this.needRun(variable)) {
                result = await this.doTest();
                times = new Date().getTime() - date.getTime();
                await this.checkResult(result);
                await this.processResult(result);
            }
            this.setRunStatus(S_Processed);
        }
        catch (e) {
            this.processError(e);
            this.setRunStatus(S_Error);
            if (this.needThrowError()) {
                throw e;
            }
        }
        logger.subLevel();
        this.log(`${this.getName()} 运行结束，耗时：${times}毫秒`);
        return result;
    }
    ;
    processError(e) {
        console.error(e);
        this.error(`${this.getName()} 运行出错`);
        this.error(e.message);
    }
    error(message) {
        let logger = this.getTestLogger();
        logger.error(message, this.getTestId());
    }
    log(message) {
        let logger = this.getTestLogger();
        logger.log(message, this.getTestId());
    }
    /**
     * 检查结果是否正确
     * @param result
     */
    async checkResult(result) {
        let afterProcess = this.afterProcess;
        if ((afterProcess === null || afterProcess === void 0 ? void 0 : afterProcess.check) != null) {
            await (afterProcess === null || afterProcess === void 0 ? void 0 : afterProcess.check(result));
        }
    }
    async processResult(result) {
        try {
            let variable = this.buildVariable(result);
            if (variable != null) {
                this.addVariable(variable);
            }
        }
        catch (e) {
            throw new Error('添加变量出错:' + e.message);
        }
    }
    /**
     * 根据返回结构构建变量
     * @param result
     * @returns
     */
    buildVariable(result) {
        let afterProcess = this.afterProcess;
        if (afterProcess === null || afterProcess === void 0 ? void 0 : afterProcess.buildVariable) {
            return afterProcess.buildVariable(result);
        }
        return null;
    }
    toJson() {
        return {
            name: this.getName(),
            status: this.runStatus,
            id: this.testId,
            couldLookDetail: this.couldLookDetail(),
            highlight: this.needHighlight(),
            remark: this.getRemark()
        };
    }
    getRemark() {
        return this.remark;
    }
    /**
     * 设置备注，可链式调用：new XxxAction().setRemark('...')
     */
    setRemark(remark) {
        this.remark = remark;
        return this;
    }
    couldLookDetail() {
        return true;
    }
    /**
     * 是否在客户端步骤列表中高亮显示
     */
    needHighlight() {
        return this.highlight;
    }
    /**
     * 设置是否高亮，可链式调用：new XxxAction().setHighlight()
     */
    setHighlight(highlight = true) {
        this.highlight = highlight;
        return this;
    }
    getParamMeta() {
        return null;
    }
    buildDefParam() {
        return {};
    }
    expectEqual(value1, value2, msg) {
        CheckUtil_1.default.expectEqual(value1, value2, msg);
    }
    expectFind(array, findObj, msg) {
        CheckUtil_1.default.expectFind(array, findObj, msg);
    }
    expectFindByArray(array, findObjs, msg) {
        CheckUtil_1.default.expectFindByArray(array, findObjs, msg);
    }
    expectNotFind(array, findObj, msg) {
        CheckUtil_1.default.expectNotFind(array, findObj, msg);
    }
    expectEqualObj(obj1, obj2, msg) {
        CheckUtil_1.default.expectEqualObj(obj1, obj2, msg);
    }
}
BaseTest.S_Init = S_Init;
BaseTest.S_Runing = S_Runing;
BaseTest.S_Processed = S_Processed;
BaseTest.S_Error = S_Error;
exports.default = BaseTest;
