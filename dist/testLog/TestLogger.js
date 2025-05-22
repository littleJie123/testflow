"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TestLogger {
    constructor() {
        this.level = 0;
        this.logs = [];
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
    }
    addLevel() {
        this.level++;
    }
    subLevel() {
        this.level--;
    }
}
exports.default = TestLogger;
