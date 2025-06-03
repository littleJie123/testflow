interface IDeParseResult{
  key:string|number;
  val:any;
}
type ResultMap = {[key:string|number]:IDeParseResult|IDeParseResult[]}
type DeparseResult = {
  resultMap?:ResultMap;
  cntMap?:{[key:string]:number}
}




let keyMap = {
  $toArray: function (key: string) {
    return function (obj) {
      return ArrayUtil.toArray(obj, key)
    }
  }
}

function acqFunByKey(key: string) {
  let keyArray = key.split('|');
  let funGeter = keyMap[keyArray[0]];
  if (funGeter)
    return funGeter.apply(null, keyArray.slice(1));
}

function init(obj, keys) {
  for (var i = 0; i < keys.length - 1; i++) {
    var key = keys[i]
    if (obj[key] == null) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  return obj
}

function setKey(obj, key, param) {
  if (key instanceof Function) {
    key(obj, param)
  } else {
    obj[key] = param
  }
  return param
}
class JsonUtil {


  /**
   * 从已有参数中取参数
   * @param json 
   * @param jsonOpt 
   * @returns 
   */
  static deParseJson(json:any,jsonOpt:IParseJsonOpt):any{
    if(jsonOpt==null || jsonOpt.keyMap == null){
      return {};
    }
    let opt:DeparseResult = {};
    this.doDeParseJson(json,jsonOpt,opt);
    let ret = {}; 
    if(opt.resultMap != null){
      for(let e in opt.resultMap){
        let vals = opt.resultMap[e];
        if(vals instanceof Array){
          for(let val of vals) {
            let result = val as IDeParseResult;
            this.setByKeys(ret,result.key as string,result.val);  
          }
        }else{
          let result = vals as IDeParseResult;
          this.setByKeys(ret,result.key as string,result.val);
        }
      }
    }
    return ret;
  }

  private static doDeParseJson(json:any,jsonOpt:IParseJsonOpt,ret:DeparseResult){
    if(json != null){
      if(json instanceof Array){
        for(let i=0;i<json.length;i++){
          let e = json[i];
          this.doDeParseJson(e,jsonOpt,ret);
        }
      }else{
        for(let e in json){
          this.doDeParseJsonByValue(e,json[e],jsonOpt,ret);
        }
      }
    }
  }
  private static doDeParseJsonByValue(key:string|number,val:any,jsonOpt:IParseJsonOpt,ret:DeparseResult){
    let keyMap = jsonOpt.keyMap;
    if(keyMap == null || val ==null){
      return;
    }
    let keyString = keyMap[key];
    
    if(StrUtil.isStr(val) || NumUtil.isNum(val) || val instanceof Date){
      if(StrUtil.isStr(val)){
        let str:string = val;
        if(str == null){
          return;
        }
        str = str.trim();
        if(str.startsWith('${') && str.endsWith('}')){
          let strKey = str.substring(2,str.length - 1).trim();
          this.addToResult(strKey,strKey,'',ret);
          return;
        }
      }
      if(keyString == null){
        return;
      }else{
        this.addToResult(key,keyString,val,ret)
        return;
      }
    }else{
      for(let e in val){
        if(keyString == null){
          this.doDeParseJsonByValue(e,val[e],jsonOpt,ret);
        }else{
          this.addToResult(key,keyString,val,ret)
        }
      }
    }
    
  }
  private static addToResult(key: string | number, keyString: string | string[], val: any, ret: DeparseResult) {
    if(ret.resultMap == null){
      ret.resultMap = {};
    }
    if(keyString instanceof Array  ){
      if(keyString.length > 0){
        if(ret.resultMap[key] == null){
          ret.resultMap[key] = [];
        }
        let array = ret.resultMap[key] as IDeParseResult[];
        let len = array.length;
        array.push({
          key:keyString[len % keyString.length],
          val
        })
      }
    }else{
      ret.resultMap[key] = {
        key:keyString as string,
        val
      }
    }
    
  }


  /**
   * 转化json中的变量
   * @param json 
   * @param opt 
   * @param jsonOpt 
   * @returns 
   */
  static parseJson(json:any,opt:any,jsonOpt:IParseJsonOpt){
    if(json == null || opt == null){
      return json;
    }
    if(json instanceof Array){
      let array:any[] = [];
      for(let i=0;i<json.length;i++){
        let e = json[i];
        array.push(this.changeVal(i,e,opt,jsonOpt))
      }
      return array;
    }else{
      let ret = {};
      for(let e in json){
        ret[e] = this.changeVal(e,json[e],opt,jsonOpt)
      }
      return ret;
    }
  }

  private static changeVal(key:string|number,val:any,opt:any,jsonOpt:IParseJsonOpt){
    if(val instanceof Array){
      let array:any[] = [];
      for(let i= 0;i<val.length;i++){
        let e = val[i];
        array.push(this.changeVal(i,e,opt,jsonOpt))
      }
      return array;
    } 
    if(NumUtil.isNum(val)){
      return this.parseValue(key,val,opt,jsonOpt);
    }
    if(val instanceof Date){
      return this.parseValue(key,val,opt,jsonOpt);
    }
    if(StrUtil.isStr(val)){
      return this.parseStr(key,val,opt,jsonOpt);
    }
    let ret = {};
    for(let e in val){
      ret[e] = this.changeVal(e,val[e],opt,jsonOpt)
    }
    return ret;

  }
  private static parseValue(key:string|number,val:any,opt ,jsonOpt:IParseJsonOpt){
    let keyString:string = this.getKeyStringFromJsonOpt(key,jsonOpt);
    if(keyString == null){
      return val;
    }
    let newVal = this.getByKeys(opt,keyString);
    if(newVal == null){
      return val;
    }
    return newVal;
  }

  private static getKeyStringFromJsonOpt(key:string|number,jsonOpt:IParseJsonOpt){
    if(jsonOpt?.keyMap == null){
      return null;
    }
    let array = jsonOpt.keyMap[key];
    if(array instanceof Array){
      if(array.length == 0){
        return null;
      }
      let cntMap = jsonOpt.cntMap;
      if(cntMap == null){
        cntMap = {};
        jsonOpt.cntMap = cntMap;
      }
      let cnt = cntMap[key];
      if(cnt == null){
        cnt = 0;
      }
      let ret = array[ cnt % array.length];
      cnt++;
      cntMap[key] = cnt;
      return ret;
    }else{
      return array;
    }
  }
  private static parseStr(key:string|number,val:string,opt:any,jsonOpt:IParseJsonOpt){
    if(val.startsWith('${') && val.endsWith('}')){
      let key = val.substring(2,val.length - 1);
      key = key.trim();

      let ret = this.getByKeys(opt,key);
      if(ret == null){
        throw new Error('找不到变量:'+key);
      }
      return ret;
    }else{
      return this.parseValue(key,val,opt,jsonOpt);
    }
  }
  /**
   * 为Pojo写的copy方法
   */
  static copyPojo(clazzName:string,srcPojo,targetPojo){
    let pk = StrUtil.firstLower(clazzName)+'Id';
    let notCols = [pk,'contextId','sysAddTime','sysModifyTime','addUser','modifyUser'];
    for(let e in srcPojo){
      if(!notCols.includes(e) && !e.startsWith('__')){
        targetPojo[e] = srcPojo[e];
      }
    }
  }

  static adds(obj, keys: Array<string>, param) {
    if (keys == null) { return }
    if (!(keys instanceof Array)) {
      keys = [keys]
    }
    if (keys.length == 0 ||
      obj == null ||
      param == null) {
      return
    }
    var obj = init(obj, keys)
    var key = keys[keys.length - 1]
    if (key) {
      if (obj[key] == null) {
        obj[key] = []
      }
    }
    if (!(param instanceof Array))
      param = [param];
    for (let data of param)
      obj[key].push(data)
    return obj
  }

  /**
   * 和set 的区别，是支持用aaa.bbb.cc的格式表示多级 
   * @param obj 
   * @param keyStr 
   * @param value 
   */
  static setByKeys(obj:any,keyStr:string,value){
    let keys = keyStr.split('.');
    this.set(obj,keys,value);
  }
  /**
   * 只保留某些字段，支持多级
   * @param obj 
   * @param keyStrArray 
   * @returns 
   */
  static onlyKeys(obj:any,keyStrArray:string[]):any{
    let newObj:any = {};
    for(let keyStr of keyStrArray){
      this.setByKeys(newObj,keyStr,this.getByKeys(obj,keyStr))
    }
    return newObj;
  }
  /**
   * 对数组的每个元素进行onlyKeys的操作
   * @param obj 
   * @param keyStrArray 
   */
  static onlyKeys4List(objs:any[],keyStrArray:string[]):any[]{
    if(keyStrArray == null){
      return objs;
    }
    let array:any[] = [];
    for(let obj of objs){
      array.push(this.onlyKeys(obj,keyStrArray))
    }
    return array;
  }

  /**
   * 和get 的区别，是支持用aaa.bbb.cc的格式表示多级
   * @param obj 
   * @param keyStr 
   * @returns 
   */
  static getByKeys(obj, keyStr: string) {
    if (keyStr == null || keyStr == '') {
      return obj
    }
    let keyArray = keyStr.split('.');
    for (var key of keyArray) {
      if (obj == null) {
        return null
      }
      let fun = acqFunByKey(key);
      if (fun != null) {
        obj = fun(obj)
      } else {
        obj = obj[key]
      }
    }
    return obj
  }

  /**
    把一个值加到数组中
    
   obj 目标
   keys 设置的key列表
   param 设置值
  */

  static add(obj, keys: Array<string>, param) {
    if (keys == null) { return }
    if (!(keys instanceof Array)) {
      keys = [keys]
    }
    if (keys.length == 0 ||
      obj == null ||
      param == null) {
      return
    }
    var obj = init(obj, keys)
    var key = keys[keys.length - 1]
    if (key) {
      if (obj[key] == null) {
        obj[key] = []
      }
    }
    obj[key].push(param)
    return obj
  }
  /**
   设置一个值
   obj 目标
   keys 设置的key列表
   param 设置值
  */
  static set(obj, keys: Array<string> | string, param) {
    if (keys == null) { return }
    if (!(keys instanceof Array)) {
      keys = [keys]
    }
    if (keys.length == 0 ||
      obj == null ||
      param == null) { return }
    var obj = init(obj, keys)
    var key = keys[keys.length - 1]
    if (key) {
      setKey(obj, key, param)
    }

    return param
  }
  /**
   * 取值
   * @param obj 
   * @param keys 
   */
  static get(obj, keys: string | Array<string>) {
    if (keys == null) {
      return null
    }
    if (!(keys instanceof Array)) {
      keys = [keys]
    }
    for (var key of keys) {
      if (obj == null) {
        return null
      }
      obj = obj[key]
    }
    return obj
  }

  

  
}
export default JsonUtil;
 
 
import { ArrayUtil } from "./ArrayUtil";
import { StrUtil } from "./StrUtil";
import NumUtil from "./NumUtil";
import IParseJsonOpt from "../inf/IParseJsonOpt";

