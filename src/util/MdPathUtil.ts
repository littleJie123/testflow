import fs from 'fs';
import path from 'path';

export interface MdPaths {
  srcPath: string;
  distPath: string;
}

export default class MdPathUtil {
  static resolveSrcAndDist(filePath: string): MdPaths {
    const normalized = path.normalize(filePath);
    const distSep = `${path.sep}dist${path.sep}`;
    const srcSep = `${path.sep}src${path.sep}`;
    if (normalized.includes(distSep) || normalized.includes('/dist/')) {
      return {
        distPath: normalized,
        srcPath: normalized.replace(/[\\/]dist[\\/]/, `${path.sep}src${path.sep}`),
      };
    }
    if (normalized.includes(srcSep) || normalized.includes('/src/')) {
      return {
        srcPath: normalized,
        distPath: normalized.replace(/[\\/]src[\\/]/, `${path.sep}dist${path.sep}`),
      };
    }
    console.warn(`MdPathUtil: 无法识别 src/dist 路径: ${normalized}`);
    return {
      srcPath: normalized,
      distPath: normalized,
    };
  }

  static sameMdFile(filePathA: string, filePathB: string): boolean {
    const a = this.resolveSrcAndDist(filePathA).srcPath;
    const b = this.resolveSrcAndDist(filePathB).srcPath;
    return path.normalize(a) === path.normalize(b);
  }

  static validateMdPath(filePath: string): void {
    const normalized = path.normalize(filePath);
    if (!normalized.toLowerCase().endsWith('.md')) {
      throw new Error('只能访问 md 文件');
    }
    const lower = normalized.toLowerCase();
    if (!lower.includes(`${path.sep}src${path.sep}`) && !lower.includes(`${path.sep}dist${path.sep}`)
      && !lower.includes('/src/') && !lower.includes('/dist/')) {
      throw new Error('路径必须在 src 或 dist 目录下');
    }
  }

  static readContent(filePath: string): string {
    const paths = this.resolveSrcAndDist(filePath);
    this.validateMdPath(paths.srcPath);
    this.validateMdPath(paths.distPath);
    let readPath = paths.distPath;
    if (!fs.existsSync(readPath)) {
      readPath = paths.srcPath;
    }
    if (!fs.existsSync(readPath)) {
      return '';
    }
    return fs.readFileSync(readPath, 'utf8');
  }

  static writeContent(filePath: string, content: string): MdPaths {
    const paths = this.resolveSrcAndDist(filePath);
    this.validateMdPath(paths.srcPath);
    this.validateMdPath(paths.distPath);
    const targets = paths.srcPath === paths.distPath
      ? [paths.srcPath]
      : [paths.srcPath, paths.distPath];
    for (let target of targets) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content, 'utf8');
    }
    return paths;
  }

  static toListJson(filePath: string) {
    const paths = this.resolveSrcAndDist(filePath);
    const name = path.basename(filePath, '.md');
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
