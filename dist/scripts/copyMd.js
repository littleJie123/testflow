#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function walkMdFiles(dir, srcRoot, distRoot) {
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const fullPath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(fullPath);
        if (stat.isDirectory()) {
            walkMdFiles(fullPath, srcRoot, distRoot);
        }
        else if (file.endsWith('.md')) {
            const rel = path_1.default.relative(srcRoot, fullPath);
            const dest = path_1.default.join(distRoot, rel);
            fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
            fs_1.default.copyFileSync(fullPath, dest);
            console.log(`copy md: ${rel}`);
        }
    }
}
function copyMdFiles(srcRoot, distRoot) {
    const absSrc = path_1.default.resolve(srcRoot);
    const absDist = path_1.default.resolve(distRoot);
    if (!fs_1.default.existsSync(absSrc)) {
        console.log(`copyMd: src 目录不存在 ${absSrc}`);
        return;
    }
    walkMdFiles(absSrc, absSrc, absDist);
}
const srcRoot = process.argv[2] || 'src';
const distRoot = process.argv[3] || 'dist';
copyMdFiles(srcRoot, distRoot);
