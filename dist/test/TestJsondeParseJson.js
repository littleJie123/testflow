"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonUtil_1 = __importDefault(require("../util/JsonUtil"));
function test1() {
    let json = {
        warehouseId: 123,
        warehouseGroupId: 456,
        materials: [
            { materialId: 1 },
            { materialId: 2 },
            { materialId: 3 },
            { materialId: 1 },
            { materialId: '${ddd}' },
        ],
        supplier: {
            aaa: {
                bbb: '123,bbb'
            }
        },
        userName: '${userName}',
    };
    let opt = {
        keyMap: {
            warehouseId: 'warehouse.warehouseId',
            warehouseGroupId: 'warehouse.warehouseGroupId',
            userName: 'userName',
            materialId: [
                'materialMap.小杰.materialId',
                'materialMap.小翕.materialId',
                'materialMap.小悠.materialId',
            ],
            bbb: 'supplier.bbb'
        }
    };
    let ret = JsonUtil_1.default.deParseJson(json, opt);
    console.log(ret);
    // ret = JsonUtil.deParseJson(json, null)
    // console.log(ret)
}
function test2() {
    let json = {
        user: '${userName}'
    };
    let opt = {
        keyMap: {
            userName: 'userName'
        }
    };
    let ret = JsonUtil_1.default.deParseJson(json, opt);
    console.log(ret);
}
test1();
