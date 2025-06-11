"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UrlAction_1 = __importDefault(require("./UrlAction"));
class default_1 extends UrlAction_1.default {
    needInScreen() {
        return true;
    }
    constructor(param) {
        super();
        if (param == null) {
            param = {};
        }
        else {
            param = { ...param };
        }
        let def = this.getDefHttpParam();
        if (def != null) {
            for (let key in def) {
                if (param[key] == undefined) {
                    param[key] = def[key];
                }
            }
        }
        this.opt = param;
    }
    getDefHttpParam() {
        return null;
    }
    getMethod() {
        let method = this.opt.method;
        if (method == undefined) {
            method = 'GET';
        }
        return method;
    }
    getHttpUrl() {
        return this.opt.url;
    }
    getName() {
        return this.opt.name;
    }
    getHttpParam() {
        let param = this.opt.param;
        if (param == undefined) {
            param = {};
        }
        return param;
    }
}
exports.default = default_1;
