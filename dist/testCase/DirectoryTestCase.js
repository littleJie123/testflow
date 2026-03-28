"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestCase_1 = __importDefault(require("./TestCase"));
class DirectoryTestCase extends TestCase_1.default {
    constructor(name) {
        super();
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
}
exports.default = DirectoryTestCase;
