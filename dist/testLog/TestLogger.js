"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TestLogger {
    constructor() {
        this.level = 0;
        this.logs = [];
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
    save() {
        throw new Error("Method not implemented.");
    }
    log(message) {
        this.addLog('log', message);
    }
    error(message) {
        this.addLog('error', message);
    }
    addLog(type, message) {
        this.logs.push({
            level: this.level,
            message,
            type
        });
    }
    addLevel() {
        this.level++;
    }
    subLevel() {
        this.level--;
    }
}
exports.default = TestLogger;
