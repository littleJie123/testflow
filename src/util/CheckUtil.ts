import JsonUtil from "./JsonUtil";
import NumUtil from "./NumUtil";

export default class{
  static expectEqualObj(obj1: any, obj2: any, msg?: string) {
    if (msg == null) {
      msg = `检查:期望是${JSON.stringify(obj2)},实际是${JSON.stringify(JsonUtil.inKey(obj1, obj2))}`
    }

    if (!JsonUtil.isEqualObj(obj1, obj2)) {
      throw new Error(msg);
    }
  }
  static expectEqual(value1,value2,msg?:string){
    if(msg == null){
      msg = `检查出错：期望是${value2}，实际是${value1}`
    }
    if(NumUtil.isNum(value1) && NumUtil.isNum(value2)){
      if(!NumUtil.isEq(value1,value2)){
        throw new Error(msg)
      }
    }else{
      if(value1 != value2){
        throw new Error(msg);
      }
    }
  }

  static expectFind(array:any[],findObj:any,msg?:string){
    if(msg == null){
      msg =`没找到${JSON.stringify(findObj)}的数据`
    }
    let row = array.find(function(obj){
      for(let e in findObj){
        let val = JsonUtil.getByKeys(obj,e);
        if(val != findObj[e]){
          return false;
        }
      }
      return true;
    })
    if( row == null){
      throw new Error(msg);
    }
  }
  static expectFindByArray(array:any[],findObjs:any[],msg?:string){
    for(let findObj of findObjs){
      this.expectFind(array,findObj)
    }
  }
  


  static expectNotFind(array:any[],findObj:any,msg?:string){
    if(msg == null){
      msg =`找到了${JSON.stringify(findObj)}的数据，本来觉得应该找不到`
    }
    let row = array.find(function(obj){
      for(let e in findObj){
        let val = JsonUtil.getByKeys(obj,e);
        if(val != findObj[e]){
          return false;
        }
      }
      return true;
    })
    if( row != null){
      throw new Error(msg);
    }
  }

  static expectNotNull(val:any,msg?:string){
    if(msg == null){
      msg = '不能为空的值变成空了'
    }
    if(val == null){
      throw new Error(msg);
    }
  }
}