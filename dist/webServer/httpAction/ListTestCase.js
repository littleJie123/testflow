"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestRunner_1 = __importDefault(require("../../testRunner/TestRunner"));
class ListTestCase {
    process(param) {
        let testRunner = TestRunner_1.default.get();
        let testCaseList = testRunner.findAllTest();
        return {
            list: testCaseList.map(item => {
                return item.toJson();
            })
        };
    }
}
exports.default = ListTestCase;
