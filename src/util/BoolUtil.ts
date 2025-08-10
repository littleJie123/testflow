export default class BoolUtil {
    /**
     * 判断一个值是否为布尔类型
     * @param value 要检查的值
     * @returns 如果值为布尔类型则返回true，否则返回false
     */
    static isBoolean(value: any): boolean {
        return typeof value === 'boolean' || value instanceof Boolean;
    }
}
