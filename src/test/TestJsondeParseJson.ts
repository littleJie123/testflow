import JsonUtil from "../util/JsonUtil";
function main(){
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
    usserName:'${userName}',
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
      ]
    }
  }
  let ret = JsonUtil.deParseJson(json, opt)
  console.log(ret)

}

main()