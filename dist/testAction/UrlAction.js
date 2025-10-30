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
        await super.checkResult(result);
    }
    checkHttpStatus(result) {
        var _a, _b;
        if (this.httpStatus != null) {
            if (this.httpStatus >= 400) {
                let loger = this.getTestLogger();
                loger.error(JSON.stringify(result));
                let msg = '';
                if ((_a = result === null || result === void 0 ? void 0 : result.error) === null || _a === void 0 ? void 0 : _a.message) {
                    msg = (_b = result === null || result === void 0 ? void 0 : result.error) === null || _b === void 0 ? void 0 : _b.message;
                }
                throw new Error(`${this.getName()} http status: ${this.httpStatus}。${msg}`);
            }
        }
    }
    getHttpParam() {
        return {};
    }
    getMethod() {
        return 'POST';
    }
    getHeader() {
        return {};
    }
    parseHttpUrl() {
        let testRunner = TestRunner_1.default.get();
        let url = this.getHttpUrl();
        if (url == null) {
            throw new Error('请设置url');
        }
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
    parseHttpParam() {
        var _a;
        let datas = this.getVariable();
        let ret = JsonUtil_1.default.parseJson(this.getHttpParam(), datas, { keyMap: this.getParamMeta() });
        if ((_a = this.afterProcess) === null || _a === void 0 ? void 0 : _a.parseHttpParam) {
            ret = this.afterProcess.parseHttpParam(ret);
        }
        return ret;
    }
    parseHttpHeaders() {
        var _a;
        let datas = this.getVariable();
        let headers = JsonUtil_1.default.parseJson(this.getHeader(), datas, { keyMap: this.getHeaderMeta() });
        if ((_a = this.afterProcess) === null || _a === void 0 ? void 0 : _a.parseHttpHeader) {
            headers = this.afterProcess.parseHttpHeader;
        }
        return headers;
    }
    async doTest() {
        let httpUtil = HttpUtil_1.default.get();
        let datas = this.getVariable();
        let url = StrUtil_1.StrUtil.format(this.parseHttpUrl(), datas);
        let httpParam = this.parseHttpParam();
        let headers = this.parseHttpHeaders();
        let result = await httpUtil.requestStatusAndResult(url, this.getMethod(), httpParam, headers);
        this.sendMsg('httpParam', {
            id: this.getTestId(),
            url,
            param: httpParam,
            headers,
            result,
            method: this.getMethod()
        });
        this.httpStatus = result.status;
        return result.result;
    }
    buildDefParam() {
        let httpParam = this.getHttpParam();
        return JsonUtil_1.default.deParseJson(httpParam, { keyMap: this.getParamMeta() });
    }
    getHeaderMeta() {
        return null;
    }
}
exports.default = UrlAction;
