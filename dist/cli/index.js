#! /usr/bin/env node
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
const extra_typings_1 = require("@commander-js/extra-typings");
const index_1 = require("../src/index");
const package_json_1 = require("../package.json");
const program = new extra_typings_1.Command();
program
    .version(package_json_1.version)
    .description('A natural language to SQL converter')
    .argument('<phrase>', 'A query written in natural language to be executed against your database.')
    .option('-e, --execute', 'Specifies whether to automatically execute the generated SQL statement. Defaults to false.')
    .option('-t, --token <value>', 'Identifies which database to run queries against. This is provided by Outerbase. May also be provided via the environment variable "OUTERBASE_EZQL_TOKEN"')
    .option('-h, --host <value>', 'API host used for requests. Defaults to "api.outerbase.com".')
    .action((query, { execute, host, token: _token }) => __awaiter(void 0, void 0, void 0, function* () {
    const token = _token || process.env.OUTERBASE_EZQL_TOKEN;
    if (!token)
        throw new Error('"token" must be provided either as an argument (--token) or via the environment variable "OUTERBASE_EZQL_TOKEN"');
    const ezql = new index_1.EZQL({ token, host });
    const response = yield ezql.prompt(query, execute ? index_1.Prompt.data : index_1.Prompt.sql);
    // TODO fancy formatting and/or syntax highlighting
    console.log(response);
}))
    .parse(process.argv);
//# sourceMappingURL=index.js.map