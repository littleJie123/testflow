"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testflow_1 = require("../testflow");
class SetVariable extends testflow_1.BaseTest {
    constructor(opt) {
        super();
        this.variableParam = opt;
        if ((opt === null || opt === void 0 ? void 0 : opt.remark) != null) {
            this.remark = opt.remark;
        }
        if ((opt === null || opt === void 0 ? void 0 : opt.highlight) != null) {
            this.highlight = opt.highlight;
        }
    }
    getName() {
        return `设置变量:${this.variableParam.name}`;
    }
    async doTest() {
    }
    buildVariable(result) {
        return this.variableParam.variable;
    }
}
exports.default = SetVariable;
