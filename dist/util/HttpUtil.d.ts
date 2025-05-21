export default class {
    private static instance;
    static get(): any;
    get(url: string, data?: any, headers?: any): Promise<any>;
    post(url: string, data?: any, headers?: any): Promise<any>;
    put(url: string, data?: any, headers?: any): Promise<any>;
    delete(url: string, data?: any, headers?: any): Promise<any>;
    request(url: string, method: string, data?: any, headers?: any): Promise<any>;
}
