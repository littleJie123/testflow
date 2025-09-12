import CheckUtil from '../../src/util/CheckUtil';
it('expectFind', () => {
  let list = [
        {
          "name": "猪肉",
          "materialId": 6077,
          "buyUnitId": 201,
          "unitsId": 18,
          "stockUnitsId": 5,
          "noteId": 5104,
          "supplierMaterial": {
            "buyUnitFee": -10,
            "price": 21,
            "stockUnitsId": 5
          },
          "purcharse": {
            "buyUnitFee": 1,
            "cnt": 400,
            "stockUnitsId": 0
          },
          "categoryId": 989,
          "pinyin": "zhurou",
          "firstPinyin": "zr",
          "buyUnit": [
            {
              "unitsId": 18,
              "fee": 1,
              "isUnits": true
            },
            {
              "unitsId": 5,
              "fee": 10,
              "isSupplier": true
            }
          ],
          "type": "purcharse",
          "supplierId": 1254,
          "supplier": {
            "name": "供应商1",
            "supplierId": 1254
          }
        },
        {
          "name": "羊肉",
          "materialId": 6078,
          "buyUnitId": 146,
          "unitsId": 18,
          "stockUnitsId": 29,
          "noteId": 5104,
          "supplierMaterial": {
            "buyUnitFee": 500,
            "price": 0.2,
            "stockUnitsId": 29
          },
          "purcharse": {
            "buyUnitFee": 500,
            "cnt": 30,
            "stockUnitsId": 0
          },
          "categoryId": 989,
          "pinyin": "yangrou",
          "firstPinyin": "yr",
          "buyUnit": [
            {
              "unitsId": 29,
              "fee": 1,
              "isSupplier": true
            },
            {
              "unitsId": 18,
              "fee": 500,
              "isUnits": true
            }
          ],
          "type": "purcharse",
          "supplierId": 1254,
          "supplier": {
            "name": "供应商1",
            "supplierId": 1254
          }
        },
        {
          "name": "牛肉",
          "materialId": 6079,
          "buyUnitId": 132,
          "unitsId": 18,
          "stockUnitsId": 18,
          "noteId": 5105,
          "supplierMaterial": {
            "buyUnitFee": 1,
            "price": 10,
            "stockUnitsId": 18
          },
          "purcharse": {
            "buyUnitFee": 1,
            "cnt": 50,
            "stockUnitsId": 0
          },
          "categoryId": 989,
          "pinyin": "niurou",
          "firstPinyin": "nr",
          "buyUnit": [
            {
              "unitsId": 18,
              "fee": 1,
              "isUnits": true,
              "isSupplier": true
            }
          ],
          "type": "purcharse",
          "supplierId": 1255,
          "supplier": {
            "name": "供应商2",
            "supplierId": 1255
          }
        }
      ]
  CheckUtil.expectFindByArray( [list[0]], [{
    "name": "猪肉",
    "purcharse": {
      "buyUnitFee": 1,
      "cnt": 800,
      "stockUnitsId": 0
    }
  }])
})