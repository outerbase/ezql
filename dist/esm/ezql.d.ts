export type EZQLOpts = {
    token: string;
};
export declare enum Prompt {
    sql = "sql",
    data = "data"
}
export declare class EZQL {
    token: string;
    constructor({ token }: EZQLOpts);
    get baseUrl(): string;
    prompt(phrase: string, type: Prompt): Promise<string>;
}
//# sourceMappingURL=ezql.d.ts.map