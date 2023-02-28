export type EZQLOpts = {
  token: string
}

export enum Prompt {
  sql = 'sql',
  data = 'data',
}

export class EZQL {
  token: string

  constructor({ token }: EZQLOpts) {
    this.token = token
  }

  get baseUrl() {
    return process.env.API_HOST || 'api.outerbase.com'
  }

  async prompt(phrase: string, type: Prompt): Promise<string> {
    // console.debug(`prompt("${phrase}", ${type})`)

    const result = await fetch(`${this.baseUrl}/ezql`, {
      body: JSON.stringify({ phrase, type }),
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (result.status === 200) return result.text()
    else {
      throw new Error(`${result.status}: ${result.statusText}`)
    }
  }
}
