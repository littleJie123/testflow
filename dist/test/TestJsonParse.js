"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonUtil_1 = __importDefault(require("../util/JsonUtil"));
function main() {
    let opt = {
        aaa: 123,
        bbb: 'abc'
    };
    let parseJson = {
        age: "${aaa}",
        name: 'test'
    };
    console.log(JsonUtil_1.default.parseJson(parseJson, opt, {}));
}
