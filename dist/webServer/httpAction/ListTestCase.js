"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestRunner_1 = __importDefault(require("../../testRunner/TestRunner"));
const MdPathUtil_1 = __importDefault(require("../../util/MdPathUtil"));
const BaseAction_1 = __importDefault(require("../BaseAction"));
class ListTestCase extends BaseAction_1.default {
    async process(param) {
        var _a;
        let testRunner = TestRunner_1.default.get();
        const basePath = (_a = param.path) !== null && _a !== void 0 ? _a : '';
        if (param.keyword != null && param.keyword !== '') {
            return {
                list: testRunner.searchAll(basePath, param.keyword),
            };
        }
        let testCaseList = testRunner.findAllTest(basePath);
        let list = testCaseList.map(item => item.toJson());
        let mdFiles = testRunner.findMdFiles(basePath);
        for (let mdPath of mdFiles) {
            list.push(MdPathUtil_1.default.toListJson(mdPath));
        }
        return {
            list,
        };
    }
}
exports.default = ListTestCase;
