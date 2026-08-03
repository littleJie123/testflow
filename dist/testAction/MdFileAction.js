"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const BaseTest_1 = __importDefault(require("../testCase/BaseTest"));
const MdPathUtil_1 = __importDefault(require("../util/MdPathUtil"));
class MdFileAction extends BaseTest_1.default {
    constructor(filePath, dirname) {
        super();
        if (dirname != null && dirname !== '') {
            if (!filePath.startsWith('.')) {
                filePath = './' + filePath;
            }
            if (!filePath.toLowerCase().endsWith('.md')) {
                filePath = filePath + '.md';
            }
            filePath = path_1.default.join(dirname, filePath);
        }
        this.filePath = path_1.default.normalize(filePath);
    }
    getName() {
        return path_1.default.basename(this.filePath, '.md');
    }
    needInScreen() {
        return true;
    }
    couldLookDetail() {
        return true;
    }
    async doTest() {
    }
    getFilePath() {
        return this.filePath;
    }
    toJson() {
        const paths = MdPathUtil_1.default.resolveSrcAndDist(this.filePath);
        return {
            name: this.getName(),
            status: this.getRunStatus(),
            id: this.getTestId(),
            couldLookDetail: true,
            highlight: this.needHighlight(),
            remark: this.getRemark(),
            actionType: 'mdFile',
            filePath: this.filePath,
            srcPath: paths.srcPath,
            distPath: paths.distPath,
        };
    }
}
exports.default = MdFileAction;
