import JsonUtil from "../util/JsonUtil";
function test1(){
  let json = {
    warehouseId:123,
    warehouseGroupId:456,
    materials:[
      {materialId:1},
      {materialId:2},
      {materialId:3},
      {materialId:1},
      {materialId:'${ddd}'},
    ],
    supplier:{
      aaa:{
        bbb:'123,bbb'
      }
    },
    userName:'${userName}',
  } 
  let opt = {
    keyMap:{
      warehouseId:'warehouse.warehouseId', 
      warehouseGroupId:'warehouse.warehouseGroupId',
      userName:'userName',
      materialId:[
        'materialMap.小杰.materialId',
        'materialMap.小翕.materialId',
        'materialMap.小悠.materialId',
      ],
      bbb:'supplier.bbb'
    }
  }
  let ret = JsonUtil.deParseJson(json, opt)
  console.log(ret)

  // ret = JsonUtil.deParseJson(json, null)
  // console.log(ret)
  
}

function test2(){
  let json ={
    user:'${userName}'
  }
  let opt = {
    keyMap:{
      userName:'userName'
    }
  }
  let ret = JsonUtil.deParseJson(json, opt)
  console.log(ret)
}


test1()