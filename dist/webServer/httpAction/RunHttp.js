"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = __importDefault(require("../BaseAction"));
const HttpUtil_1 = __importDefault(require("../../util/HttpUtil"));
class RunHttp extends BaseAction_1.default {
    async process(param) {
        let httpUtil = HttpUtil_1.default.get();
        let result = await httpUtil.requestStatusAndResult(param.url, param.method, param.param, param.headers);
        return result;
    }
}
exports.default = RunHttp;
