"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DownloadExcelAction_1 = __importDefault(require("./DownloadExcelAction"));
/**
 * 下载 excel 并解析全部 sheet。
 * 请求方式与 DownloadExcelAction 相同（GET、参数挂 URL、下载流）。
 * result 为 { [sheet名称]: any[] }，每个 sheet 第一行为表头。
 * 若服务端返回 json（一般是报错），则直接把 json 作为 result，由 checkResult 报错。
 */
class MultiSheetDownloadAction extends DownloadExcelAction_1.default {
    parseExcel(buffer) {
        let workbook = this.readWorkbook(buffer);
        let ret = {};
        for (let name of workbook.SheetNames) {
            ret[name] = this.sheetToJson(workbook.Sheets[name]);
        }
        return ret;
    }
}
exports.default = MultiSheetDownloadAction;
