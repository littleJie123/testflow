import CheckUtil from '../../src/util/CheckUtil';
it('expectFind', () => {
  CheckUtil.expectFind([
        {
          "updateHisId": 902,
          "tableId": 953,
          "addUser": 0,
          "modifyUser": 0,
          "tableName": "supplier",
          "sysAddTime": "2025-08-18T03:31:04.000Z",
          "sysModifyTime": "2025-08-18T03:31:04.000Z",
          "contextId": 153962598629479,
          "action": "",
          "parentId": 0,
          "parentTable": "",
          "data": {
            "supplierId": 953,
            "name": "供应商1",
            "isDel": 0,
            "contextId": 153962598629471,
            "sysAddTime": "2025-08-18T03:31:03.000Z",
            "sysModifyTime": "2025-08-18T03:31:03.000Z",
            "warehouseGroupId": 1698,
            "mobile": "",
            "moa": 0,
            "linkWarehouseId": 0,
            "type": "supplier",
            "linkWarehouseGroupId": 0,
            "linkSupplierId": 0,
            "address": "",
            "supplierGroupId": 0
          }
        }
      ],{
        data:{name:'供应商1'}
      })
})