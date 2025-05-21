"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTest_1 = __importDefault(require("./BaseTest"));
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
class TestCase extends BaseTest_1.default {
    setTestId(testId) {
        this.testId = testId;
    }
    getTestId() {
        return this.testId;
    }
    async run(param, env) {
        this.setParam(param);
        this.init();
        this.setEnv(env);
        let log = this.getTestLogger();
        await log.save();
    }
    init() {
        this.variable = null;
        this.testLogger = null;
    }
    async doTest() {
        let result = null;
        for (let action of this.getActions()) {
            let objAction = action;
            if (objAction.beforeRun) {
                objAction.beforeRun();
            }
        }
        for (let action of this.getActions()) {
            let objAction = action;
            if (objAction.setLogger) {
                objAction.setLogger(this.getTestLogger());
            }
            if (objAction.setVar) {
                objAction.setVariable(this.getVariable());
            }
            if (objAction.setParam) {
                objAction.setParam(this.getParam());
            }
            if (objAction.setResult) {
                objAction.setResult(result);
            }
            if (objAction.setEnv) {
                objAction.setEnv(this.env);
            }
            result = await action.test();
        }
        return result;
    }
}
exports.default = TestCase;
