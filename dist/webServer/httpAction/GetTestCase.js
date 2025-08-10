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
        let test = testRunner.getTestById(param.id);
        if (test == null) {
            return {};
        }
        return {
            name: test.getName(),
            actions: test.getActions().map((item) => {
                return item.toJson();
            })
        };
    }
}
exports.default = GetTestCase;
