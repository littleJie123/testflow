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
    processError(e) {
        let logger = this.getTestLogger();
        logger.error(`${this.getName()} 运行出错`);
    }
    needInScreen() {
        return true;
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
            if (objAction.setTestLogger) {
                objAction.setTestLogger(this.getTestLogger());
            }
            if (objAction.setVariable) {
                objAction.setVariable(this.getVariable());
            }
            if (objAction.setEnv) {
                objAction.setEnv(this.env);
            }
            result = await action.test();
        }
        return result;
    }
    getActions() {
        return this.buildActions();
    }
    ;
    toJson() {
        let json = {
            id: this.testId,
            name: this.getName(),
            status: this.getStatus(),
        };
        return json;
    }
}
exports.default = TestCase;
