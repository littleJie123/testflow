"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class HttpUtil {
    /**
     * 将指定的文件上传到url中
     * @param url
     * @param filePath 文件目录
     * @param data 参数
     * @param headers
     */
    async upload(url, filePath, queryParams, headers) {
        if (queryParams != null) {
            const queryString = Object.keys(queryParams)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                .join('&');
            url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
            if (url.endsWith('&')) {
                url = url.substring(0, url.length - 1);
            }
        }
        try {
            const formData = new FormData();
            const fileBuffer = fs_1.default.readFileSync(filePath);
            const fileName = path_1.default.basename(filePath);
            const blob = new Blob([fileBuffer]);
            formData.append('file', blob, fileName);
            const options = {
                method: 'POST',
                headers: {
                    ...headers,
                },
                body: formData,
            };
            const response = await fetch(url, options);
            const contentType = response.headers.get('content-type');
            let result = null;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            }
            else {
                result = await response.text();
            }
            return {
                result,
                status: response.status
            };
        }
        catch (error) {
            console.error('上传出错:', error);
            throw error;
        }
    }
    // 单例模式获取实例
    static get() {
        if (!this.instance) {
            this.instance = new HttpUtil();
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
        let result = await this.requestStatusAndResult(url, method, data, headers);
        return result.result;
    }
    // 核心请求方法
    async requestStatusAndResult(url, method, data, headers) {
        try {
            // 处理查询参数（如果是GET请求或data中包含查询参数）
            if (data && (method === 'GET' || data.params)) {
                const queryParams = method === 'GET' ? data : data.params;
                const queryString = Object.keys(queryParams)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                    .join('&');
                url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
                if (url.endsWith('&')) {
                    url = url.substring(0, url.length - 1);
                }
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
            // 返回响应数据
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return {
                    status: response.status,
                    result: await response.json()
                };
            }
            else {
                return {
                    status: response.status,
                    result: await response.text()
                };
            }
        }
        catch (error) {
            console.error('请求出错:', error);
            throw error;
        }
    }
}
HttpUtil.instance = null;
exports.default = HttpUtil;
