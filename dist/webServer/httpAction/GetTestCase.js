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
            id: param.id,
            name: test.getName(),
            actions: test.getActions().map((item) => this.serializeAction(item))
        };
    }
    serializeAction(item) {
        const json = item.toJson();
        if (item instanceof testflow_1.TestCase) {
            const subActions = item.getActions();
            if (subActions.length > 0) {
                json.actionType = 'testCase';
                json.couldLookDetail = true;
                json.actions = subActions.map(sub => sub.toJson());
            }
        }
        return json;
    }
}
exports.default = GetTestCase;
