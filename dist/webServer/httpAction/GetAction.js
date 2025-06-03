"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
class GetTestCase {
    process(param) {
        let testRunner = testflow_1.TestRunner.get();
        let action = testRunner.getActionById(param.id);
        if (action == null) {
            return {};
        }
        let logger = action.getTestLogger();
        return {
            paramMeta: action.getParamMeta(),
            logs: logger.getLogs(),
            defParam: action.buildDefParam(),
            status: action.getStatus()
        };
    }
}
exports.default = GetTestCase;
