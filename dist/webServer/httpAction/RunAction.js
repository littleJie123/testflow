"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
class RunTest {
    async process(param) {
        let testRunner = testflow_1.TestRunner.get();
        let baseTest = testRunner.getActionById(param.id);
        if (baseTest) {
            await baseTest.run(param.env, { variable: param.param });
            return {
                logs: baseTest.getTestLogger().getLogs(),
                status: baseTest.getStatus()
            };
        }
    }
}
exports.default = RunTest;
