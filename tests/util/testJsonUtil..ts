import JsonUtil from '../../src/util/JsonUtil';

it('testParse',()=>{
  let json = {test:true,succ:"${succ}"};
  console.log(JsonUtil.parseJson(json,{
    succ:true
  },{}))
})
