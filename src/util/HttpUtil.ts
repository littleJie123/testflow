import fs from 'fs';
import path from 'path';

export default class HttpUtil {
  private static instance: HttpUtil = null;


  /**
   * 将指定的文件上传到url中
   * @param url 
   * @param filePath 文件目录
   * @param data 参数
   * @param headers 
   */
  public async upload(url: string, filePath: string, queryParams?: any, headers?: any) {
    if (queryParams != null) {
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      if (url.endsWith('&')) {
        url = url.substring(0, url.length - 1)
      }
    }

    try {
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      const blob = new Blob([fileBuffer]);
      formData.append('file', blob, fileName);

      const options: any = {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: formData,
      };

      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');
      let result:any = null;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      return {
        result,
        status: response.status
      }
    } catch (error) {
      console.error('上传出错:', error);
      throw error;
    }
  }


  // 单例模式获取实例
  public static get():HttpUtil {
    if (!this.instance) {
      this.instance = new HttpUtil();
    }
    return this.instance;
  }

  // 发送GET请求
  public async get(url: string, data?: any, headers?: any): Promise<any> {
    return this.request(url, 'GET', data, headers);
  }

  // 发送POST请求
  public async post(url: string, data?: any, headers?: any): Promise<any> {
    return this.request(url, 'POST', data, headers);
  }

  // 发送PUT请求
  public async put(url: string, data?: any, headers?: any): Promise<any> {
    return this.request(url, 'PUT', data, headers);
  }

  // 发送DELETE请求
  public async delete(url: string, data?: any, headers?: any): Promise<any> {
    return this.request(url, 'DELETE', data, headers);
  }

  // 核心请求方法
  async request(
    url: string,
    method: string,
    data?: any,
    headers?: any
  ): Promise<any> {
    let result = await this.requestStatusAndResult(url, method, data, headers)
    return result.result;
  }

  /**
   * 请求返回下载流（如 excel）。
   * 若服务端返回 json（一般是报错），result 为解析后的 json，isJson=true；
   * 否则 result 为 Buffer。
   */
  async requestBuffer(
    url: string,
    method: string,
    data?: any,
    headers?: any
  ): Promise<{ status: number; result: any; isJson: boolean }> {
    const options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return {
        status: response.status,
        result: await response.json(),
        isJson: true
      };
    }
    let arrayBuffer = await response.arrayBuffer();
    return {
      status: response.status,
      result: Buffer.from(arrayBuffer),
      isJson: false
    };
  }

  // 核心请求方法
  async requestStatusAndResult(
    url: string,
    method: string,
    data?: any,
    headers?: any
  ): Promise<any> {
    try {
      // 处理查询参数（如果是GET请求或data中包含查询参数）
      if (data && (method === 'GET' || data.params)) {
        const queryParams = method === 'GET' ? data : data.params;
        const queryString = Object.keys(queryParams)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
          .join('&');
        url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
        if (url.endsWith('&')) {
          url = url.substring(0, url.length - 1)
        }
      }

      // 设置请求配置
      const options: any = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      // 添加请求体（对于非GET请求）
      if (data && method !== 'GET' && !data.params) {
        options.body = JSON.stringify(data);
      }

      // 发送请求
      const response = await fetch(url, options);



      // 返回响应数据
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {

        return {
          status: response.status,
          result: await response.json()
        };
      } else {
        return {
          status: response.status,
          result: await response.text()
        };
      }

    } catch (error) {
      console.error('请求出错:', error);
      throw error;
    }
  }
}