import JsonUtil from '../../src/util/JsonUtil';

it.skip('isEqualObj', () => {
  expect(JsonUtil.isEqualObj({
    aaa: 123,
    bbb: "abc"
  }, { aaa: 123 })).toEqual(true)
  console.log('----------------------------------');
  expect(JsonUtil.isEqualObj({
    aaa: 123,
    bbb: "abc"
  }, { aaa: 123, bbb: "dddd" })).toEqual(false)
  console.log('----------------------------------');
  expect(JsonUtil.isEqualObj({
    aaa: 123,
    bbb: "abc",
    ccc: {
      ddd: 123,
      eee: 'hhhh'
    }
  }, { aaa: 123, bbb: "abc", ccc: { eee: 'hhhh' } })).toEqual(true)



})

it('testeqal', () => {
  expect(JsonUtil.isEqualObj(
    {
      supplierId: 269,
      price: 0.2,
      isDef: 1,
      moc: 0,
      buyUnitFee: -10,
      name: '供应商2'
    }, { buyUnitFee: -10, price: 200, stockUnitsId: 5 }
  )).toEqual(false)
})
