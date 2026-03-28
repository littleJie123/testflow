"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class default_1 {
    static send(ws, data, action) {
        try {
            if (ws && ws.readyState === ws_1.default.OPEN) {
                ws.send(JSON.stringify({
                    action,
                    result: data
                }));
            }
            else {
                console.error("WebSocket is not open:", JSON.stringify({
                    action,
                    result: data
                }));
            }
        }
        catch (error) {
            console.error("Error sending data through WebSocket:", error);
        }
    }
}
exports.default = default_1;
