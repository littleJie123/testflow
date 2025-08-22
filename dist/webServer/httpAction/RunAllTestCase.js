"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
const BaseAction_1 = __importDefault(require("../BaseAction"));
class default_1 extends BaseAction_1.default {
    async process(param) {
        this.run(param);
    }
    async run(param) {
        let ids = param.ids;
        let testRunner = testflow_1.TestRunner.get();
        for (let id of ids) {
            try {
                let testCase = testRunner.getTestById(id);
                if (testCase) {
                    testCase.setWebSocket(this.getWebSocket());
                    await testCase.run();
                }
            }
            catch (e) {
            }
        }
    }
}
exports.default = default_1;
