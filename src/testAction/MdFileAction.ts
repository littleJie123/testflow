import path from 'path';
import BaseTest from '../testCase/BaseTest';
import MdPathUtil from '../util/MdPathUtil';

export default class MdFileAction extends BaseTest {
  private filePath: string;

  constructor(filePath: string, dirname?: string) {
    super();
    if (dirname != null && dirname !== '') {
      if (!filePath.startsWith('.')) {
        filePath = './' + filePath;
      }
      if (!filePath.toLowerCase().endsWith('.md')) {
        filePath = filePath + '.md';
      }
      filePath = path.join(dirname, filePath);
    }
    this.filePath = path.normalize(filePath);
  }

  getName(): string {
    return path.basename(this.filePath, '.md');
  }

  needInScreen(): boolean {
    return true;
  }

  protected couldLookDetail(): boolean {
    return true;
  }

  protected async doTest(): Promise<void> {
  }

  getFilePath(): string {
    return this.filePath;
  }

  toJson() {
    const paths = MdPathUtil.resolveSrcAndDist(this.filePath);
    return {
      name: this.getName(),
      status: this.getRunStatus(),
      id: this.getTestId(),
      couldLookDetail: true,
      highlight: this.needHighlight(),
      actionType: 'mdFile',
      filePath: this.filePath,
      srcPath: paths.srcPath,
      distPath: paths.distPath,
    };
  }
}
