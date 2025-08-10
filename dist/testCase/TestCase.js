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
        this.error(`${this.getName()} 运行出错!!`);
    }
    needInScreen() {
        return true;
    }
    needThrowError() {
        return false;
    }
    couldLookDetail() {
        return false;
    }
    async doTest() {
        let result = null;
        let actions = this.getActions();
        for (let action of actions) {
            action.setWebSocket(this.webSocket);
            let objAction = action;
            if (objAction.beforeRun) {
                objAction.beforeRun();
            }
        }
        for (let action of actions) {
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
        let list = this.buildActions();
        let id = 0;
        for (let row of list) {
            row.setTestId(`${this.testId}-${id++}`);
        }
        return list;
    }
    ;
    toJson() {
        let json = {
            id: this.testId,
            name: this.getName(),
            status: this.getRunStatus(),
        };
        return json;
    }
}
exports.default = TestCase;
