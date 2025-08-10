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
    log(message, id) {
        this.addLog('log', message, id);
    }
    error(message, id) {
        this.addLog('error', message, id);
    }
    addLog(type, message, id) {
        const log = {
            level: this.level,
            message,
            type,
            id
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
