"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
class GetTestCase {
    process(param) {
        let testRunner = testflow_1.TestRunner.get();
        let test = testRunner.getTestById(param.id);
        if (test == null) {
            return {};
        }
        let logger = test.getTestLogger();
        return {
            actions: test.getActions().map((item) => {
                return item.toJson();
            }),
            logs: logger.getLogs()
        };
    }
}
exports.default = GetTestCase;
