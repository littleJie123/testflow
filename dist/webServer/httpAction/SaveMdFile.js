"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = __importDefault(require("../BaseAction"));
const MdPathUtil_1 = __importDefault(require("../../util/MdPathUtil"));
class SaveMdFile extends BaseAction_1.default {
    async process(param) {
        if ((param === null || param === void 0 ? void 0 : param.filePath) == null || param.filePath === '') {
            throw new Error('filePath 不能为空');
        }
        if (param.content == null) {
            throw new Error('content 不能为空');
        }
        const paths = MdPathUtil_1.default.writeContent(param.filePath, param.content);
        return {
            ok: true,
            srcPath: paths.srcPath,
            distPath: paths.distPath,
        };
    }
}
exports.default = SaveMdFile;
