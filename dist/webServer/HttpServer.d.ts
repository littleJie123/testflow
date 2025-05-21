import ITestParam from "../inf/ITestParam";
import * as http from 'http';
export default class HttpServer {
    private actionMap;
    constructor();
    /**
     * 扫描指定目录下的所有文件
     * 如果文件名是ts或js，排除掉 .d.ts结尾的文件
     * 则加载文件
     * 如果文件名是文件夹，则递归扫描
     * 然后将所有文件的action，注册到actionMap中（调用regAction方法）
     * 注意，url就是相对路径加文件名，不包括扩展名
     * 例如：/home/user/test.ts 则url是/home/user/test
     * @param dirPath
     */
    private scanAtion;
    private regAction;
    private getActionByUrl;
    /**
     * 以param中端口启动一个http服务
     * 请求/debug/health 返回200 和json {health:true}
     * @param param
     */
    start(param?: ITestParam): void;
    process(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>): Promise<void>;
    /**
     * 处理请求
     * 根据url调用getActionByUrl获取action
     * 如果action存在，
     * 首先根据req产生param，如果method是post，则从req中读取body，构建出一个json，如果是get，则从req中读取query，构建出一个json
     * 然后调用action的process方法
     * 然后将process的返回值作为json响应
     * 如果action不存在，则返回404
     * @param req
     */
    private processAction;
    /**
     * 如果是html或者js文件，返回200和文件内容
     * 文件内容从项目的根目录中读取相同路径同名文件
     * 文件不存在则返回404
     * @param req
     * @param res
     */
    private processHtmlAndJs;
}
