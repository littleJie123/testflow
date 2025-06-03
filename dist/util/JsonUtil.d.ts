declare class JsonUtil {
    /**
     * 从已有参数中取参数
     * @param json
     * @param jsonOpt
     * @returns
     */
    static deParseJson(json: any, jsonOpt: IParseJsonOpt): any;
    private static doDeParseJson;
    private static doDeParseJsonByValue;
    private static addToResult;
    /**
     * 转化json中的变量
     * @param json
     * @param opt
     * @param jsonOpt
     * @returns
     */
    static parseJson(json: any, opt: any, jsonOpt: IParseJsonOpt): any;
    private static changeVal;
    private static parseValue;
    private static getKeyStringFromJsonOpt;
    private static parseStr;
    /**
     * 为Pojo写的copy方法
     */
    static copyPojo(clazzName: string, srcPojo: any, targetPojo: any): void;
    static adds(obj: any, keys: Array<string>, param: any): any;
    /**
     * 和set 的区别，是支持用aaa.bbb.cc的格式表示多级
     * @param obj
     * @param keyStr
     * @param value
     */
    static setByKeys(obj: any, keyStr: string, value: any): void;
    /**
     * 只保留某些字段，支持多级
     * @param obj
     * @param keyStrArray
     * @returns
     */
    static onlyKeys(obj: any, keyStrArray: string[]): any;
    /**
     * 对数组的每个元素进行onlyKeys的操作
     * @param obj
     * @param keyStrArray
     */
    static onlyKeys4List(objs: any[], keyStrArray: string[]): any[];
    /**
     * 和get 的区别，是支持用aaa.bbb.cc的格式表示多级
     * @param obj
     * @param keyStr
     * @returns
     */
    static getByKeys(obj: any, keyStr: string): any;
    /**
      把一个值加到数组中
      
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static add(obj: any, keys: Array<string>, param: any): any;
    /**
     设置一个值
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static set(obj: any, keys: Array<string> | string, param: any): any;
    /**
     * 取值
     * @param obj
     * @param keys
     */
    static get(obj: any, keys: string | Array<string>): any;
}
export default JsonUtil;
import IParseJsonOpt from "../inf/IParseJsonOpt";
