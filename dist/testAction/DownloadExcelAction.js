"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
const HttpUtil_1 = __importDefault(require("../util/HttpUtil"));
const HttpAction_1 = __importDefault(require("./HttpAction"));
const StrUtil_1 = require("../util/StrUtil");
/**
 * 请求返回 excel 下载流的接口。
 * 与客户端 downloadExcel 一致：参数挂在 URL 上（GET）。
 */
class DownloadExcelAction extends HttpAction_1.default {
    constructor(param, afterProcess) {
        super(param, afterProcess);
        this.sheetName = param?.sheetName;
    }
    getMethod() {
        return 'GET';
    }
    async submit(url, httpParam, headers) {
        let httpUtil = HttpUtil_1.default.get();
        url = this.appendQuery(url, httpParam);
        let ret = await httpUtil.requestBuffer(url, this.getMethod(), null, headers);
        if (ret.isJson) {
            return ret;
        }
        return {
            status: ret.status,
            result: this.parseExcel(ret.result)
        };
    }
    appendQuery(url, httpParam) {
        if (httpParam == null) {
            return url;
        }
        let parts = [];
        for (let key in httpParam) {
            let val = httpParam[key];
            if (val == null || val instanceof Function) {
                continue;
            }
            if (typeof val === 'object') {
                val = JSON.stringify(val);
            }
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
        }
        if (parts.length === 0) {
            return url;
        }
        return url + (url.includes('?') ? '&' : '?') + parts.join('&');
    }
    resolveSheetName() {
        if (this.sheetName == null || this.sheetName === '') {
            return null;
        }
        return StrUtil_1.StrUtil.format(this.sheetName, this.getVariable());
    }
    parseExcel(buffer) {
        let workbook = XLSX.read(buffer, { type: 'buffer' });
        let want = this.resolveSheetName();
        let sheetName = want ?? workbook.SheetNames[0];
        if (sheetName == null) {
            return [];
        }
        if (want != null && workbook.SheetNames.indexOf(want) < 0) {
            throw new Error(`Excel 无 sheet「${want}」，实际: ${JSON.stringify(workbook.SheetNames)}`);
        }
        let sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, { defval: null });
    }
}
exports.default = DownloadExcelAction;
