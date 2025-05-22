"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
class RunTest {
    process(param) {
        let testRunner = testflow_1.TestRunner.get();
        let testCase = testRunner.getTestById(param.id);
        if (testCase) {
            testCase.run({});
        }
    }
}
exports.default = RunTest;
