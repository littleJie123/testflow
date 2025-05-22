export default class {
  private static instance: any = null;

  // 单例模式获取实例
  public static get() {
    if (!this.instance) {
      this.instance = new this();
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
    let result = await this.requestStatusAndResult(url,method,data,headers)
    return result.result;
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
        if(url.endsWith('&')){
          url = url.substring(0,url.length-1)
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
          status:response.status,
          result:await response.json()
        };
      } else {
        return {
          status:response.status,
          result:await response.text()
        };
      }

    } catch (error) {
      console.error('请求出错:', error);
      throw error;
    }
  }
}