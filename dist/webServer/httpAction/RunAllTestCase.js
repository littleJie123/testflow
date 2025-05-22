"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../../testflow");
class default_1 {
    process(param) {
        let ids = param.ids;
        let testRunner = testflow_1.TestRunner.get();
        for (let id of ids) {
            try {
                let testCase = testRunner.getTestById(id);
                if (testCase) {
                    testCase.run({});
                }
            }
            catch (e) {
            }
        }
    }
}
exports.default = default_1;
