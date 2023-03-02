(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Outerbase = {}));
})(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    exports.Prompt = void 0;
    (function (Prompt) {
        Prompt["sql"] = "sql";
        Prompt["data"] = "data";
    })(exports.Prompt || (exports.Prompt = {}));
    const DEFAULT_HOST = 'api.outerbase.com';
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
                return this.host || DEFAULT_HOST;
            }
            else {
                return this.host || process.env.OUTERBASE_EZQL_HOST || DEFAULT_HOST;
            }
        }
        prompt(phrase, type) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.debug(`prompt("${phrase}", ${type})`)
                if (!phrase || !type)
                    throw new Error(`EZQL.prompt requires a 'phrase' and 'type' parameter`);
                if (!Object.values(exports.Prompt).includes(type))
                    throw new Error(`EZQL.Prompt requires 'type' in [${Object.values(exports.Prompt)}]`);
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

}));
//# sourceMappingURL=bundle.js.map
