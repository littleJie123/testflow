"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestRunner_1 = __importDefault(require("./testRunner/TestRunner"));
const path_1 = __importDefault(require("path"));
let testRunner = TestRunner_1.default.get();
testRunner.regEnvConfig('local', {
    host: 'http://127.0.0.1:8080/'
});
testRunner.start({
    testPath: path_1.default.join(__dirname, './test')
});
