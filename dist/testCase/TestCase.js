"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTest_1 = __importDefault(require("./BaseTest"));
const MdFileAction_1 = __importDefault(require("../testAction/MdFileAction"));
const MdPathUtil_1 = __importDefault(require("../util/MdPathUtil"));
/**
 * 测试用例
 * 子类请以Test开头命名，这回被TestRunner 识别为测试用例
 */
class TestCase extends BaseTest_1.default {
    setIndex(index) {
        this.index = index;
    }
    setAutoMdFilePath(filePath) {
        this.autoMdFilePath = filePath;
    }
    setSourceFilePath(filePath) {
        this.sourceFilePath = filePath;
    }
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
    clone() {
        let ret = super.clone();
        ret.setAutoMdFilePath(this.autoMdFilePath);
        ret.setSourceFilePath(this.sourceFilePath);
        return ret;
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
            if (action.getRunStatus() === BaseTest_1.default.S_Error) {
                throw new Error(`${action.getName()} 运行失败`);
            }
        }
        return result;
    }
    getActions() {
        let list = this.buildActions();
        list = this.mergeAutoMdAction(list);
        let id = 0;
        for (let row of list) {
            row.setTestId(`${this.testId}-${id++}`);
        }
        if (this.index == null) {
            return list;
        }
        else {
            return list.slice(0, this.index + 1);
        }
    }
    ;
    mergeAutoMdAction(list) {
        if (this.autoMdFilePath == null) {
            return list;
        }
        const alreadyHas = list.some((a) => {
            return a instanceof MdFileAction_1.default
                && MdPathUtil_1.default.sameMdFile(a.getFilePath(), this.autoMdFilePath);
        });
        if (alreadyHas) {
            return list;
        }
        return [new MdFileAction_1.default(this.autoMdFilePath), ...list];
    }
    toJson() {
        let json = {
            id: this.testId,
            name: this.getName(),
            status: this.getRunStatus(),
        };
        return json;
    }
    toString() {
        return `testcase:${this.getName()}`;
    }
}
exports.default = TestCase;
