"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MdPathUtil {
    static resolveSrcAndDist(filePath) {
        const normalized = path_1.default.normalize(filePath);
        const distSep = `${path_1.default.sep}dist${path_1.default.sep}`;
        const srcSep = `${path_1.default.sep}src${path_1.default.sep}`;
        if (normalized.includes(distSep) || normalized.includes('/dist/')) {
            return {
                distPath: normalized,
                srcPath: normalized.replace(/[\\/]dist[\\/]/, `${path_1.default.sep}src${path_1.default.sep}`),
            };
        }
        if (normalized.includes(srcSep) || normalized.includes('/src/')) {
            return {
                srcPath: normalized,
                distPath: normalized.replace(/[\\/]src[\\/]/, `${path_1.default.sep}dist${path_1.default.sep}`),
            };
        }
        console.warn(`MdPathUtil: 无法识别 src/dist 路径: ${normalized}`);
        return {
            srcPath: normalized,
            distPath: normalized,
        };
    }
    static sameMdFile(filePathA, filePathB) {
        const a = this.resolveSrcAndDist(filePathA).srcPath;
        const b = this.resolveSrcAndDist(filePathB).srcPath;
        return path_1.default.normalize(a) === path_1.default.normalize(b);
    }
    static validateMdPath(filePath) {
        const normalized = path_1.default.normalize(filePath);
        if (!normalized.toLowerCase().endsWith('.md')) {
            throw new Error('只能访问 md 文件');
        }
        const lower = normalized.toLowerCase();
        if (!lower.includes(`${path_1.default.sep}src${path_1.default.sep}`) && !lower.includes(`${path_1.default.sep}dist${path_1.default.sep}`)
            && !lower.includes('/src/') && !lower.includes('/dist/')) {
            throw new Error('路径必须在 src 或 dist 目录下');
        }
    }
    static readContent(filePath) {
        const paths = this.resolveSrcAndDist(filePath);
        this.validateMdPath(paths.srcPath);
        this.validateMdPath(paths.distPath);
        let readPath = paths.distPath;
        if (!fs_1.default.existsSync(readPath)) {
            readPath = paths.srcPath;
        }
        if (!fs_1.default.existsSync(readPath)) {
            return '';
        }
        return fs_1.default.readFileSync(readPath, 'utf8');
    }
    static writeContent(filePath, content) {
        const paths = this.resolveSrcAndDist(filePath);
        this.validateMdPath(paths.srcPath);
        this.validateMdPath(paths.distPath);
        const targets = paths.srcPath === paths.distPath
            ? [paths.srcPath]
            : [paths.srcPath, paths.distPath];
        for (let target of targets) {
            fs_1.default.mkdirSync(path_1.default.dirname(target), { recursive: true });
            fs_1.default.writeFileSync(target, content, 'utf8');
        }
        return paths;
    }
    static toListJson(filePath) {
        const paths = this.resolveSrcAndDist(filePath);
        const name = path_1.default.basename(filePath, '.md');
        return {
            type: 'mdFile',
            actionType: 'mdFile',
            name,
            id: `${name}.md`,
            filePath,
            srcPath: paths.srcPath,
            distPath: paths.distPath,
            couldLookDetail: true,
        };
    }
}
exports.default = MdPathUtil;
