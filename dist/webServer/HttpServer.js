"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class HttpServer {
    constructor() {
        this.actionMap = new Map();
        this.scanAtion(path_1.default.join(__dirname, './httpAction'));
    }
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
    scanAtion(dirPath) {
        try {
            // 读取目录内容
            const files = fs_1.default.readdirSync(dirPath);
            for (const file of files) {
                const fullPath = path_1.default.join(dirPath, file);
                const stat = fs_1.default.statSync(fullPath);
                if (stat.isDirectory()) {
                    // 如果是目录，递归扫描
                    this.scanAtion(fullPath);
                }
                else {
                    // 检查文件扩展名
                    const ext = path_1.default.extname(file).toLowerCase();
                    if ((ext === '.ts' && !file.endsWith('.d.ts')) || ext === '.js') {
                        try {
                            // 动态导入文件
                            const ActionClass = require(fullPath).default;
                            if (ActionClass) {
                                // 构建URL（相对路径 + 文件名，不包括扩展名）
                                const relativePath = path_1.default.relative(path_1.default.join(__dirname, './httpAction'), fullPath);
                                const urlPath = '/' + relativePath.slice(0, -ext.length).replace(/\\/g, '/');
                                // 实例化并注册action
                                const actionInstance = new ActionClass();
                                this.regAction(urlPath, actionInstance);
                                console.log(`已注册action: ${urlPath}`);
                            }
                        }
                        catch (error) {
                            console.error(`加载action文件失败: ${fullPath}`, error);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(`扫描目录失败: ${dirPath}`, error);
        }
    }
    regAction(url, action) {
        this.actionMap.set(url.toLowerCase(), action);
    }
    getActionByUrl(url) {
        return this.actionMap.get(url.toLowerCase());
    }
    /**
     * 以param中端口启动一个http服务
     * 请求/debug/health 返回200 和json {health:true}
     * @param param
     */
    start(param) {
        var _a;
        const server = http.createServer((req, res) => this.process(req, res));
        const port = (_a = param === null || param === void 0 ? void 0 : param.port) !== null && _a !== void 0 ? _a : 3000;
        server.listen(port, () => {
            console.log(`HTTP服务器已启动，监听端口: ${port}`);
        });
        // 错误处理
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`端口 ${port} 已被占用`);
            }
            else {
                console.error('服务器启动错误:', error);
            }
        });
    }
    async process(req, res) {
        // 处理健康检查请求
        let url = req.url || '';
        if (req.url === '/debug/health') {
            const responseData = JSON.stringify({ health: true });
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(responseData)
            });
            res.end(responseData);
            return;
        }
        // 处理HTML和JS文件请求
        if (url.endsWith('.html') || url.endsWith('.js')) {
            this.processHtmlAndJs(req, res);
            return;
        }
        await this.processAction(req, res);
        // 如果不是HTML或JS文件，processHtmlAndJs不会处理，会继续执行到这里
        if (!res.writableEnded) {
            res.writeHead(404);
            res.end();
        }
    }
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
    async processAction(req, res) {
        try {
            // 获取请求URL并移除查询参数
            const url = (req.url || '').split('?')[0].toLowerCase();
            // 获取对应的action
            const action = this.getActionByUrl(url);
            if (!action) {
                res.writeHead(404);
                res.end();
                return;
            }
            // 构建参数对象
            let param = {};
            // 处理GET请求参数
            if (req.method === 'GET') {
                const queryString = (req.url || '').split('?')[1];
                if (queryString) {
                    param = Object.fromEntries(new URLSearchParams(queryString).entries());
                }
            }
            // 处理POST请求数据
            if (req.method === 'POST') {
                const buffers = [];
                // 读取请求体数据
                for await (const chunk of req) {
                    buffers.push(Buffer.from(chunk));
                }
                const bodyStr = Buffer.concat(buffers).toString();
                if (bodyStr) {
                    try {
                        param = JSON.parse(bodyStr);
                    }
                    catch (e) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: '无效的 JSON 格式' }));
                        return;
                    }
                }
            }
            // 调用action处理请求
            const result = await action.process(param);
            // 返回JSON响应
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(result))
            });
            res.end(JSON.stringify(result));
        }
        catch (error) {
            console.error('处理请求出错:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '服务器内部错误' }));
        }
    }
    /**
     * 如果是html或者js文件，返回200和文件内容
     * 文件内容从项目的根目录中读取相同路径同名文件
     * 文件不存在则返回404
     * @param req
     * @param res
     */
    processHtmlAndJs(req, res) {
        // 获取请求的文件路径
        const url = req.url || '/';
        // 移除查询参数
        const filePath = url.split('?')[0];
        // 检查文件扩展名
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (ext !== '.html' && ext !== '.js') {
            return;
        }
        // 构建完整的文件路径（从项目根目录开始）
        const fullPath = path_1.default.join(__dirname, '../../client', filePath);
        // 检查文件是否存在
        fs_1.default.access(fullPath, fs_1.default.constants.F_OK, (err) => {
            if (err) {
                // 文件不存在，返回404
                res.writeHead(404);
                res.end();
                return;
            }
            // 读取文件内容
            fs_1.default.readFile(fullPath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Internal Server Error');
                    return;
                }
                // 设置正确的Content-Type
                const contentType = ext === '.html' ? 'text/html' : 'application/javascript';
                res.writeHead(200, {
                    'Content-Type': `${contentType}; charset=utf-8`,
                    'Content-Length': Buffer.byteLength(data)
                });
                res.end(data);
            });
        });
    }
}
exports.default = HttpServer;
