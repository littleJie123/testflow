"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
const BaseAction_1 = __importDefault(require("../BaseAction"));
class GetTestCase extends BaseAction_1.default {
    async process(param) {
        let testRunner = testflow_1.TestRunner.get();
        let action = testRunner.getActionById(param.id);
        if (action == null) {
            return {};
        }
        let logger = action.getTestLogger();
        return {
            name: action.getName(),
            paramMeta: action.getParamMeta(),
            logs: logger.getLogs(),
            defParam: action.buildDefParam(),
            status: action.getRunStatus()
        };
    }
}
exports.default = GetTestCase;
