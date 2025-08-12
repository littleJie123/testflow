"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestLogger_1 = __importDefault(require("../testLog/TestLogger"));
const TestRunner_1 = __importDefault(require("../testRunner/TestRunner"));
const JsonUtil_1 = __importDefault(require("../util/JsonUtil"));
const StrUtil_1 = require("../util/StrUtil");
const WsUtil_1 = __importDefault(require("../util/WsUtil"));
const S_Init = 'init';
const S_Runing = 'runing';
const S_Processed = 'processed';
const S_Error = 'error';
class BaseTest {
    constructor() {
        this.runStatus = S_Init;
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
        return ret;
    }
    init() {
        this.variable = null;
    }
    async run(env, opt) {
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
    async test() {
        let logger = this.getTestLogger();
        this.setRunStatus(S_Runing);
        this.log(`${this.getName()} 开始运行`);
        logger.addLevel();
        let result = null;
        try {
            result = await this.doTest();
            await this.checkResult(result);
            await this.processResult(result);
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
        this.log(`${this.getName()} 运行结束`);
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
    expectEqualObj(obj1, obj2, msg) {
        if (msg == null) {
            msg = `检查:期望是${JSON.stringify(obj2)},实际是${JSON.stringify(JsonUtil_1.default.inKey(obj1, obj2))}`;
        }
        console.log('JsonUtil.isEqualObj(obj1,obj2)', JsonUtil_1.default.isEqualObj(obj1, obj2));
        if (!JsonUtil_1.default.isEqualObj(obj1, obj2)) {
            throw new Error(msg);
        }
    }
    /**
     * 检查结果是否正确
     * @param result
     */
    async checkResult(result) {
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
        return null;
    }
    toJson() {
        return {
            name: this.getName(),
            status: this.runStatus,
            id: this.testId,
            couldLookDetail: this.couldLookDetail()
        };
    }
    couldLookDetail() {
        return true;
    }
    getParamMeta() {
        return null;
    }
    buildDefParam() {
        return {};
    }
    expectEqual(value1, value2, msg) {
        if (msg == null) {
            msg = `检查出错：期望是${value2}，实际是${value1}`;
        }
        if (value1 != value2) {
            throw new Error(msg);
        }
    }
    expectFind(array, findObj, msg) {
        if (msg == null) {
            msg = `没找到${JSON.stringify(findObj)}的数据`;
        }
        let row = array.find(function (obj) {
            for (let e in findObj) {
                let val = JsonUtil_1.default.getByKeys(obj, e);
                if (val != findObj[e]) {
                    return false;
                }
            }
            return true;
        });
        if (row == null) {
            throw new Error(msg);
        }
    }
    expectFindByArray(array, findObjs, msg) {
        for (let findObj of findObjs) {
            this.expectFind(array, findObj);
        }
    }
    expectNotFind(array, findObj, msg) {
        if (msg == null) {
            msg = `找到了${JSON.stringify(findObj)}的数据，本来觉得应该找不到`;
        }
        let row = array.find(function (obj) {
            for (let e in findObj) {
                let val = JsonUtil_1.default.getByKeys(obj, e);
                if (val != findObj[e]) {
                    return false;
                }
            }
            return true;
        });
        if (row != null) {
            throw new Error(msg);
        }
    }
}
BaseTest.S_Init = S_Init;
BaseTest.S_Runing = S_Runing;
BaseTest.S_Processed = S_Processed;
BaseTest.S_Error = S_Error;
exports.default = BaseTest;
