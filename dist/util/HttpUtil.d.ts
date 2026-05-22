export default class HttpUtil {
    private static instance;
    /**
     * 将指定的文件上传到url中
     * @param url
     * @param filePath 文件目录
     * @param data 参数
     * @param headers
     */
    upload(url: string, filePath: string, queryParams?: any, headers?: any): Promise<{
        result: any;
        status: number;
    }>;
    static get(): HttpUtil;
    get(url: string, data?: any, headers?: any): Promise<any>;
    post(url: string, data?: any, headers?: any): Promise<any>;
    put(url: string, data?: any, headers?: any): Promise<any>;
    delete(url: string, data?: any, headers?: any): Promise<any>;
    request(url: string, method: string, data?: any, headers?: any): Promise<any>;
    requestStatusAndResult(url: string, method: string, data?: any, headers?: any): Promise<any>;
}
