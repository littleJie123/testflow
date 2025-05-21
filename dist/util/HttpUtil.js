"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    // 单例模式获取实例
    static get() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    // 发送GET请求
    async get(url, data, headers) {
        return this.request(url, 'GET', data, headers);
    }
    // 发送POST请求
    async post(url, data, headers) {
        return this.request(url, 'POST', data, headers);
    }
    // 发送PUT请求
    async put(url, data, headers) {
        return this.request(url, 'PUT', data, headers);
    }
    // 发送DELETE请求
    async delete(url, data, headers) {
        return this.request(url, 'DELETE', data, headers);
    }
    // 核心请求方法
    async request(url, method, data, headers) {
        try {
            // 处理查询参数（如果是GET请求或data中包含查询参数）
            if (data && (method === 'GET' || data.params)) {
                const queryParams = method === 'GET' ? data : data.params;
                const queryString = Object.keys(queryParams)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                    .join('&');
                url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
            }
            // 设置请求配置
            const options = {
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
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // 返回响应数据
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            else {
                return await response.text();
            }
        }
        catch (error) {
            console.error('请求出错:', error);
            throw error;
        }
    }
}
default_1.instance = null;
exports.default = default_1;
