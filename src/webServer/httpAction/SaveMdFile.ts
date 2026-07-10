import BaseAction from '../BaseAction';
import MdPathUtil from '../../util/MdPathUtil';

export default class SaveMdFile extends BaseAction {
  async process(param?: any) {
    if (param?.filePath == null || param.filePath === '') {
      throw new Error('filePath 不能为空');
    }
    if (param.content == null) {
      throw new Error('content 不能为空');
    }
    const paths = MdPathUtil.writeContent(param.filePath, param.content);
    return {
      ok: true,
      srcPath: paths.srcPath,
      distPath: paths.distPath,
    };
  }
}
