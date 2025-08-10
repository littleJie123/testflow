import { TestRunner } from "../../testflow";
import IControl from "../../inf/IControl";
import BaseAction from "../BaseAction";
import WsUtil from "../../util/WsUtil";
import HttpUtil from "../../util/HttpUtil";

export default class RunHttp extends BaseAction {
  async process(param?: any) {
    let httpUtil = HttpUtil.get()
    let result = await httpUtil.requestStatusAndResult(
      param.url,
      param.method,
      param.param,
      param.headers
    )
    return result;
  }

   
}