export type OuterbaseOpts = {
  token: string
}

export enum Prompt {
  sql,
  data,
}

export default class Outerbase {
  token: string

  constructor({ token }: OuterbaseOpts) {
    this.token = token
  }

  async prompt(phrase: string, type: Prompt): Promise<string> {
    console.debug(`prompt("${phrase}", ${type})`)
    if (type === Prompt.sql) return 'SELECT answer FROM ultimate_question;'
    else return '42'
  }
}
