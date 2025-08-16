"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
const BaseAction_1 = __importDefault(require("../BaseAction"));
class RunTest extends BaseAction_1.default {
    async process(param) {
        let testRunner = testflow_1.TestRunner.get();
        let testCase = testRunner.getTestById(param.id);
        if (testCase) {
            testCase.setIndex(param.index);
            testCase.setWebSocket(this.getWebSocket());
            testCase.run(param.env, param.param);
        }
    }
}
exports.default = RunTest;
