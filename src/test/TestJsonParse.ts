import JsonUtil from "../util/JsonUtil";
function main(){
  let opt = {
    aaa:123,
    bbb:'bbbbbbb',
    brandMap:{
      小杰:{
        brandId:100
      },
      小悠:{
        brandId:200
      },
      小翕:{
        brandId:300
      }
    }
  }
  let parseJson = {
    age:"${aaa}",
    name:'test',
    sex:1,
    brand:[
      {brandId:1},
      {brandId:2},
      {brandId:3},
      {brandId:4},
    ]

  }

  console.log(JsonUtil.parseJson(parseJson,opt,{
    keyMap:{
      name:"bbb",
      brandId:[
        'brandMap.小杰.brandId',
        'brandMap.小悠.brandId',
        'brandMap.小翕.brandId'
      ]
    }
  }))
}

main()