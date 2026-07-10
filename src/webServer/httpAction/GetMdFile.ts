import BaseAction from '../BaseAction';
import MdPathUtil from '../../util/MdPathUtil';

export default class GetMdFile extends BaseAction {
  async process(param?: any) {
    if (param?.filePath == null || param.filePath === '') {
      throw new Error('filePath 不能为空');
    }
    const paths = MdPathUtil.resolveSrcAndDist(param.filePath);
    const content = MdPathUtil.readContent(param.filePath);
    return {
      content,
      srcPath: paths.srcPath,
      distPath: paths.distPath,
    };
  }
}
