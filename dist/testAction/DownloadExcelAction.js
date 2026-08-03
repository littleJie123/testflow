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
/**
 * 请求返回 excel 下载流的接口。
 * 将下载流解析成 any[]（第一行为表头，作为每行的 key），作为 result 给下一个步骤。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
class DownloadExcelAction extends HttpAction_1.default {
    async submit(url, httpParam, headers) {
        let httpUtil = HttpUtil_1.default.get();
        let ret = await httpUtil.requestBuffer(url, this.getMethod(), httpParam, headers);
        if (ret.isJson) {
            return ret;
        }
        return {
            status: ret.status,
            result: this.parseExcel(ret.result)
        };
    }
    /**
     * 解析 excel buffer，取第一个 sheet，第一行为表头
     */
    parseExcel(buffer) {
        let workbook = XLSX.read(buffer, { type: 'buffer' });
        let sheetName = workbook.SheetNames[0];
        if (sheetName == null) {
            return [];
        }
        let sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, { defval: null });
    }
}
exports.default = DownloadExcelAction;
