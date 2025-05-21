import ITestParam from "../inf/ITestParam";
import * as http from 'http';
import fs from 'fs';
import path from "path";
import IHttpAction from "../inf/IHttpAction";
export default class HttpServer {

  private actionMap: Map<string, IHttpAction> = new Map();


  constructor(){
    this.scanAtion(path.join(__dirname,'./httpAction'));
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
  private scanAtion(dirPath: string) {
    try {
      // 读取目录内容
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 如果是目录，递归扫描
          this.scanAtion(fullPath);
        } else {
          // 检查文件扩展名
          const ext = path.extname(file).toLowerCase();
          if ((ext === '.ts' && !file.endsWith('.d.ts')) || ext === '.js') {
            try {
              // 动态导入文件
              const ActionClass = require(fullPath).default;
              if (ActionClass) {
                // 构建URL（相对路径 + 文件名，不包括扩展名）
                const relativePath = path.relative(path.join(__dirname, './httpAction'), fullPath);
                const urlPath = '/' + relativePath.slice(0, -ext.length).replace(/\\/g, '/');
                
                // 实例化并注册action
                const actionInstance = new ActionClass();
                this.regAction(urlPath, actionInstance);
                
                console.log(`已注册action: ${urlPath}`);
              }
            } catch (error) {
              console.error(`加载action文件失败: ${fullPath}`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error(`扫描目录失败: ${dirPath}`, error);
    }
  }


  private regAction(url:string,action:IHttpAction){
    this.actionMap.set(url.toLowerCase(),action);
  }

  private getActionByUrl(url:string):IHttpAction{
    return this.actionMap.get(url.toLowerCase());
  }
  /**
   * 以param中端口启动一个http服务
   * 请求/debug/health 返回200 和json {health:true}
   * @param param 
   */
  start(param?: ITestParam): void {
    const server = http.createServer((req, res) => this.process(req, res))

    const port = param?.port ?? 3000;

    server.listen(port, () => {
      console.log(`HTTP服务器已启动，监听端口: ${port}`);
    });

    // 错误处理
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`端口 ${port} 已被占用`);
      } else {
        console.error('服务器启动错误:', error);
      }
    });
  }
  async process(req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>): Promise<void> {
    // 处理健康检查请求
    let url:string = req.url || '';
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
    if(url.endsWith('.html') || url.endsWith('.js')){
      this.processHtmlAndJs(req, res);
      return;
    }
    await this.processAction(req,res);

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
  private async processAction(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
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
      let param: any = {};
      
      // 处理GET请求参数
      if (req.method === 'GET') {
        const queryString = (req.url || '').split('?')[1];
        if (queryString) {
          param = Object.fromEntries(
            new URLSearchParams(queryString).entries()
          );
        }
      }
      
      // 处理POST请求数据
      if (req.method === 'POST') {
        const buffers: Buffer[] = [];
        
        // 读取请求体数据
        for await (const chunk of req) {
          buffers.push(Buffer.from(chunk));
        }
        
        const bodyStr = Buffer.concat(buffers).toString();
        if (bodyStr) {
          try {
            param = JSON.parse(bodyStr);
          } catch (e) {
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
      
    } catch (error) {
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
  private processHtmlAndJs(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>): void {
     
    
    // 获取请求的文件路径
    const url = req.url || '/';
    // 移除查询参数
    const filePath = url.split('?')[0];
    
    // 检查文件扩展名
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.html' && ext !== '.js') {
      return;
    }

    // 构建完整的文件路径（从项目根目录开始）
    const fullPath = path.join(__dirname,'../../client', filePath);
    // 检查文件是否存在
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (err) {
        // 文件不存在，返回404
        res.writeHead(404);
        res.end();
        return;
      }

      // 读取文件内容
      fs.readFile(fullPath, (err, data) => {
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