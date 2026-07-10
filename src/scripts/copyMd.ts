#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function walkMdFiles(dir: string, srcRoot: string, distRoot: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkMdFiles(fullPath, srcRoot, distRoot);
    } else if (file.endsWith('.md')) {
      const rel = path.relative(srcRoot, fullPath);
      const dest = path.join(distRoot, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(fullPath, dest);
      console.log(`copy md: ${rel}`);
    }
  }
}

function copyMdFiles(srcRoot: string, distRoot: string) {
  const absSrc = path.resolve(srcRoot);
  const absDist = path.resolve(distRoot);
  if (!fs.existsSync(absSrc)) {
    console.log(`copyMd: src 目录不存在 ${absSrc}`);
    return;
  }
  walkMdFiles(absSrc, absSrc, absDist);
}

const srcRoot = process.argv[2] || 'src';
const distRoot = process.argv[3] || 'dist';
copyMdFiles(srcRoot, distRoot);
