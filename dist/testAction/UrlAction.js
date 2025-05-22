"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTest_1 = __importDefault(require("../testCase/BaseTest"));
const TestConfig_1 = __importDefault(require("../testRunner/TestConfig"));
const TestRunner_1 = __importDefault(require("../testRunner/TestRunner"));
const HttpUtil_1 = __importDefault(require("../util/HttpUtil"));
const JsonUtil_1 = __importDefault(require("../util/JsonUtil"));
const StrUtil_1 = require("../util/StrUtil");
class UrlAction extends BaseTest_1.default {
    async checkResult(result) {
        this.checkHttpStatus(result);
    }
    checkHttpStatus(result) {
        if (this.httpStatus != null) {
            if (this.httpStatus >= 400) {
                let loger = this.getTestLogger();
                loger.error(JSON.stringify(result));
                throw new Error(`${this.getName()} http status: ${this.httpStatus}`);
            }
        }
    }
    getHttpParam() {
        return {};
    }
    getMethod() {
        return 'GET';
    }
    getHeader() {
        return {};
    }
    parseHttpUrl() {
        let testRunner = TestRunner_1.default.get();
        let url = this.getHttpUrl();
        if (!url.startsWith('http')) {
            let host = testRunner.getEnvConfig(TestConfig_1.default.S_Host, this.env);
            if (host) {
                if (!url.startsWith('/')) {
                    url = '/' + url;
                }
                if (host.endsWith('/')) {
                    host = host.substring(0, host.length - 1);
                }
                url = host + url;
            }
        }
        return url;
    }
    async doTest() {
        let httpUtil = HttpUtil_1.default.get();
        let datas = this.getDatas();
        let url = StrUtil_1.StrUtil.format(this.parseHttpUrl(), datas);
        let httpParam = JsonUtil_1.default.parseJson(this.getHttpParam(), datas);
        let headers = JsonUtil_1.default.parseJson(this.getHeader(), datas);
        let result = await httpUtil.requestStatusAndResult(url, this.getMethod(), httpParam, headers);
        this.httpStatus = result.status;
        return result.result;
    }
}
exports.default = UrlAction;
