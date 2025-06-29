"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
const BaseAction_1 = __importDefault(require("../BaseAction"));
const WsUtil_1 = __importDefault(require("../../util/WsUtil"));
class RunTest extends BaseAction_1.default {
    async process(param) {
        this.runParam(param);
    }
    async runParam(param) {
        let testRunner = testflow_1.TestRunner.get();
        let baseTest = testRunner.getActionById(param.id);
        if (baseTest) {
            baseTest.setWebSocket(this.getWebSocket());
            let ret = await baseTest.run(param.env, { variable: param.param });
            WsUtil_1.default.send(this.getWebSocket(), ret, 'runResult');
        }
    }
}
exports.default = RunTest;
