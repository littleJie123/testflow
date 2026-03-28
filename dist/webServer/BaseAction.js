"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseAction {
    setWebSocket(ws) {
        this.ws = ws;
    }
    getWebSocket() {
        return this.ws;
    }
}
exports.default = BaseAction;
