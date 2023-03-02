"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EZQL = exports.DEFAULT_HOST = exports.Prompt = void 0;
var Prompt;
(function (Prompt) {
    Prompt["sql"] = "sql";
    Prompt["data"] = "data";
})(Prompt = exports.Prompt || (exports.Prompt = {}));
exports.DEFAULT_HOST = 'api.outerbase.com';
class EZQL {
    constructor(opts) {
        if (!opts)
            throw new Error("Required options hash with param 'token' is missing, i.e. new EZQL({ token: 'your-value-here' })");
        const { token, host } = opts;
        if (!token)
            throw new Error("Required 'token` param is missing form options hash, i.e. new EZQL({ token: 'your-value-here' })");
        this.token = token;
        if (host)
            this.host = host;
    }
    get baseUrl() {
        // precedence: arg > env > default
        if (typeof process === 'undefined') {
            // non-node environemnt (e.g. the browser)
            return this.host || exports.DEFAULT_HOST;
        }
        else {
            return this.host || process.env.OUTERBASE_EZQL_HOST || exports.DEFAULT_HOST;
        }
    }
    prompt(phrase, type) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.debug(`prompt("${phrase}", ${type})`)
            if (!phrase || !type)
                throw new Error(`EZQL.prompt requires a 'phrase' and 'type' parameter`);
            if (!Object.values(Prompt).includes(type))
                throw new Error(`EZQL.Prompt requires 'type' in [${Object.values(Prompt)}]`);
            const params = new URLSearchParams({ phrase, type });
            const result = yield fetch(`https://${this.baseUrl}/ezql?${params}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (result.status === 200)
                return result.text();
            else {
                throw new Error(`${result.status}: ${result.statusText}`);
            }
        });
    }
}
exports.EZQL = EZQL;
