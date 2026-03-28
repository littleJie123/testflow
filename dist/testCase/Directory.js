"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestCase_1 = __importDefault(require("./TestCase"));
class Directory extends TestCase_1.default {
    addChild(child) {
        this.map[child.getTestId()] = child;
    }
    getChildren() {
        return Object.values(this.map);
    }
    getChildById(id) {
        return this.map[id];
    }
    getDirectoryById(id) {
        let ret = this.getChildById(id);
        if (ret instanceof Directory) {
            return ret;
        }
        return null;
    }
    constructor(name) {
        super();
        this.map = {};
        this.name = name;
    }
    getName() {
        return this.name;
    }
    buildActions() {
        return [];
    }
    toJson() {
        let json = super.toJson();
        json.type = 'directory';
        return json;
    }
    toString() {
        return `directory:${this.name}`;
    }
}
exports.default = Directory;
