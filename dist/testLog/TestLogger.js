"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WsUtil_1 = __importDefault(require("../util/WsUtil"));
class TestLogger {
    constructor() {
        this.level = 0;
        this.logs = [];
    }
    setWebSocket(ws) {
        this.ws = ws;
    }
    getLogs() {
        let logs = [...this.logs];
        return logs;
    }
    errorOnException(e) {
        this.addLogObj({
            level: this.level,
            message: e.message,
            type: 'error',
            stack: e.stack
        });
    }
    addLogObj(log) {
        this.logs.push(log);
    }
    log(message) {
        this.addLog('log', message);
    }
    error(message) {
        this.addLog('error', message);
    }
    addLog(type, message) {
        const log = {
            level: this.level,
            message,
            type
        };
        this.logs.push(log);
        console.log(log);
        WsUtil_1.default.send(this.ws, log, 'log');
    }
    addLevel() {
        this.level++;
    }
    subLevel() {
        this.level--;
    }
}
exports.default = TestLogger;
