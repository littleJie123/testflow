"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let keyMap = {
    $toArray: function (key) {
        return function (obj) {
            return ArrayUtil_1.ArrayUtil.toArray(obj, key);
        };
    }
};
function acqFunByKey(key) {
    let keyArray = key.split('|');
    let funGeter = keyMap[keyArray[0]];
    if (funGeter)
        return funGeter.apply(null, keyArray.slice(1));
}
function init(obj, keys) {
    for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];
        if (obj[key] == null) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    return obj;
}
function setKey(obj, key, param) {
    if (key instanceof Function) {
        key(obj, param);
    }
    else {
        obj[key] = param;
    }
    return param;
}
class JsonUtil {
    /**
     * 判断两个类型相等。
     * @param obj1
     * @param obj2
     * @returns
     */
    static isEqualObj(obj1, obj2) {
        if (obj1 == null && obj2 == null) {
            return true;
        }
        if ((obj1 != null && obj2 == null) || (obj1 == null && obj2 != null)) {
            return false;
        }
        if (this.isSimpleVal(obj1) && this.isSimpleVal(obj2)) {
            return obj1 == obj2;
        }
        if (this.isDate(obj1) && this.isDate(obj2)) {
            return this.eqByDate(obj1, obj2);
        }
        if (this.isObj(obj1) && this.isObj(obj2)) {
            for (let e in obj2) {
                if (!this.isEqualObj(obj1[e], obj2[e])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    static isObj(obj) {
        return !this.isDate(obj) && !this.isSimpleVal(obj);
    }
    static eqByDate(obj1, obj2) {
        return obj1.getTime() == obj2.getTime();
    }
    static isDate(date) {
        return date instanceof Date;
    }
    static isSimpleVal(obj) {
        return BoolUtil_1.default.isBoolean(obj) || NumUtil_1.default.isNum(obj) || StrUtil_1.StrUtil.isStr(obj);
    }
    static inKey(obj1, obj2) {
        if (obj2 == null || obj1 == null) {
            return obj1;
        }
        let ret = {};
        for (let e in obj2) {
            ret[e] = obj1[e];
        }
        return ret;
    }
    /**
     * 从已有参数中取参数
     * @param json
     * @param jsonOpt
     * @returns
     */
    static deParseJson(json, jsonOpt) {
        if (jsonOpt == null || jsonOpt.keyMap == null) {
            return {};
        }
        let opt = {};
        this.doDeParseJson(json, jsonOpt, opt);
        let ret = {};
        if (opt.resultMap != null) {
            for (let e in opt.resultMap) {
                let vals = opt.resultMap[e];
                if (vals instanceof Array) {
                    for (let val of vals) {
                        let result = val;
                        this.setByKeys(ret, result.key, result.val);
                    }
                }
                else {
                    let result = vals;
                    this.setByKeys(ret, result.key, result.val);
                }
            }
        }
        return ret;
    }
    static doDeParseJson(json, jsonOpt, ret) {
        if (json != null) {
            if (json instanceof Array) {
                for (let i = 0; i < json.length; i++) {
                    let e = json[i];
                    this.doDeParseJson(e, jsonOpt, ret);
                }
            }
            else {
                for (let e in json) {
                    this.doDeParseJsonByValue(e, json[e], jsonOpt, ret);
                }
            }
        }
    }
    static doDeParseJsonByValue(key, val, jsonOpt, ret) {
        let keyMap = jsonOpt.keyMap;
        if (keyMap == null || val == null) {
            return;
        }
        let keyString = keyMap[key];
        if (StrUtil_1.StrUtil.isStr(val) || NumUtil_1.default.isNum(val) || val instanceof Date || BoolUtil_1.default.isBoolean(val)) {
            if (StrUtil_1.StrUtil.isStr(val)) {
                let str = val;
                if (str == null) {
                    return;
                }
                str = str.trim();
                if (str.startsWith('${') && str.endsWith('}')) {
                    let strKey = str.substring(2, str.length - 1).trim();
                    this.addToResult(strKey, strKey, '', ret);
                    return;
                }
            }
            if (keyString == null) {
                return;
            }
            else {
                this.addToResult(key, keyString, val, ret);
                return;
            }
        }
        else {
            for (let e in val) {
                if (keyString == null) {
                    this.doDeParseJsonByValue(e, val[e], jsonOpt, ret);
                }
                else {
                    this.addToResult(key, keyString, val, ret);
                }
            }
        }
    }
    static addToResult(key, keyString, val, ret) {
        if (ret.resultMap == null) {
            ret.resultMap = {};
        }
        if (keyString instanceof Array) {
            if (keyString.length > 0) {
                if (ret.resultMap[key] == null) {
                    ret.resultMap[key] = [];
                }
                let array = ret.resultMap[key];
                let len = array.length;
                array.push({
                    key: keyString[len % keyString.length],
                    val
                });
            }
        }
        else {
            ret.resultMap[key] = {
                key: keyString,
                val
            };
        }
    }
    /**
     * 转化json中的变量
     * @param json
     * @param opt
     * @param jsonOpt
     * @returns
     */
    static parseJson(json, opt, jsonOpt) {
        if (json == null || opt == null) {
            return json;
        }
        if (jsonOpt == null) {
            jsonOpt = {};
        }
        if (json instanceof Array) {
            let array = [];
            for (let i = 0; i < json.length; i++) {
                let e = json[i];
                array.push(this.changeVal(i, e, opt, jsonOpt));
            }
            return array;
        }
        else {
            let ret = {};
            for (let e in json) {
                ret[e] = this.changeVal(e, json[e], opt, jsonOpt);
            }
            return ret;
        }
    }
    static changeVal(key, val, opt, jsonOpt) {
        if (val == null) {
            return null;
        }
        if (val instanceof Array) {
            let array = [];
            for (let i = 0; i < val.length; i++) {
                let e = val[i];
                array.push(this.changeVal(i, e, opt, jsonOpt));
            }
            return array;
        }
        if (NumUtil_1.default.isNum(val)) {
            return this.parseValue(key, val, opt, jsonOpt);
        }
        if (val instanceof Date) {
            return this.parseValue(key, val, opt, jsonOpt);
        }
        if (BoolUtil_1.default.isBoolean(val)) {
            return this.parseValue(key, val, opt, jsonOpt);
        }
        if (StrUtil_1.StrUtil.isStr(val)) {
            return this.parseStr(key, val, opt, jsonOpt);
        }
        let ret = {};
        for (let e in val) {
            ret[e] = this.changeVal(e, val[e], opt, jsonOpt);
        }
        return ret;
    }
    static parseValue(key, val, opt, jsonOpt) {
        let keyString = this.getKeyStringFromJsonOpt(key, jsonOpt);
        if (keyString == null) {
            return val;
        }
        let newVal = this.getByKeys(opt, keyString);
        if (newVal == null) {
            return val;
        }
        return newVal;
    }
    static getKeyStringFromJsonOpt(key, jsonOpt) {
        if ((jsonOpt === null || jsonOpt === void 0 ? void 0 : jsonOpt.keyMap) == null) {
            return null;
        }
        let array = jsonOpt.keyMap[key];
        if (array instanceof Array) {
            if (array.length == 0) {
                return null;
            }
            let cntMap = jsonOpt.cntMap;
            if (cntMap == null) {
                cntMap = {};
                jsonOpt.cntMap = cntMap;
            }
            let cnt = cntMap[key];
            if (cnt == null) {
                cnt = 0;
            }
            let ret = array[cnt % array.length];
            cnt++;
            cntMap[key] = cnt;
            return ret;
        }
        else {
            return array;
        }
    }
    static parseStr(key, val, opt, jsonOpt) {
        if (val.startsWith('${') && val.endsWith('}')) {
            let key = val.substring(2, val.length - 1);
            key = key.trim();
            let ret = this.getByKeys(opt, key);
            if (ret == null) {
                throw new Error('找不到变量:' + key);
            }
            return ret;
        }
        else {
            return this.parseValue(key, val, opt, jsonOpt);
        }
    }
    /**
     * 为Pojo写的copy方法
     */
    static copyPojo(clazzName, srcPojo, targetPojo) {
        let pk = StrUtil_1.StrUtil.firstLower(clazzName) + 'Id';
        let notCols = [pk, 'contextId', 'sysAddTime', 'sysModifyTime', 'addUser', 'modifyUser'];
        for (let e in srcPojo) {
            if (!notCols.includes(e) && !e.startsWith('__')) {
                targetPojo[e] = srcPojo[e];
            }
        }
    }
    static adds(obj, keys, param) {
        if (keys == null) {
            return;
        }
        if (!(keys instanceof Array)) {
            keys = [keys];
        }
        if (keys.length == 0 ||
            obj == null ||
            param == null) {
            return;
        }
        var obj = init(obj, keys);
        var key = keys[keys.length - 1];
        if (key) {
            if (obj[key] == null) {
                obj[key] = [];
            }
        }
        if (!(param instanceof Array))
            param = [param];
        for (let data of param)
            obj[key].push(data);
        return obj;
    }
    /**
     * 和set 的区别，是支持用aaa.bbb.cc的格式表示多级
     * @param obj
     * @param keyStr
     * @param value
     */
    static setByKeys(obj, keyStr, value) {
        let keys = keyStr.split('.');
        this.set(obj, keys, value);
    }
    /**
     * 只保留某些字段，支持多级
     * @param obj
     * @param keyStrArray
     * @returns
     */
    static onlyKeys(obj, keyStrArray) {
        let newObj = {};
        for (let keyStr of keyStrArray) {
            this.setByKeys(newObj, keyStr, this.getByKeys(obj, keyStr));
        }
        return newObj;
    }
    /**
     * 对数组的每个元素进行onlyKeys的操作
     * @param obj
     * @param keyStrArray
     */
    static onlyKeys4List(objs, keyStrArray) {
        if (keyStrArray == null) {
            return objs;
        }
        let array = [];
        for (let obj of objs) {
            array.push(this.onlyKeys(obj, keyStrArray));
        }
        return array;
    }
    /**
     * 和get 的区别，是支持用aaa.bbb.cc的格式表示多级
     * @param obj
     * @param keyStr
     * @returns
     */
    static getByKeys(obj, keyStr) {
        if (keyStr == null || keyStr == '') {
            return obj;
        }
        let keyArray = keyStr.split('.');
        for (var key of keyArray) {
            if (obj == null) {
                return null;
            }
            let fun = acqFunByKey(key);
            if (fun != null) {
                obj = fun(obj);
            }
            else {
                obj = obj[key];
            }
        }
        return obj;
    }
    /**
      把一个值加到数组中
      
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static add(obj, keys, param) {
        if (keys == null) {
            return;
        }
        if (!(keys instanceof Array)) {
            keys = [keys];
        }
        if (keys.length == 0 ||
            obj == null ||
            param == null) {
            return;
        }
        var obj = init(obj, keys);
        var key = keys[keys.length - 1];
        if (key) {
            if (obj[key] == null) {
                obj[key] = [];
            }
        }
        obj[key].push(param);
        return obj;
    }
    /**
     设置一个值
     obj 目标
     keys 设置的key列表
     param 设置值
    */
    static set(obj, keys, param) {
        if (keys == null) {
            return;
        }
        if (!(keys instanceof Array)) {
            keys = [keys];
        }
        if (keys.length == 0 ||
            obj == null ||
            param == null) {
            return;
        }
        var obj = init(obj, keys);
        var key = keys[keys.length - 1];
        if (key) {
            setKey(obj, key, param);
        }
        return param;
    }
    /**
     * 取值
     * @param obj
     * @param keys
     */
    static get(obj, keys) {
        if (keys == null) {
            return null;
        }
        if (!(keys instanceof Array)) {
            keys = [keys];
        }
        for (var key of keys) {
            if (obj == null) {
                return null;
            }
            obj = obj[key];
        }
        return obj;
    }
}
exports.default = JsonUtil;
const ArrayUtil_1 = require("./ArrayUtil");
const StrUtil_1 = require("./StrUtil");
const NumUtil_1 = __importDefault(require("./NumUtil"));
const BoolUtil_1 = __importDefault(require("./BoolUtil"));
