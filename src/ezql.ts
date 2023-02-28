export type EZQLOpts = {
  token: string
  host?: string
}

export enum Prompt {
  sql = 'sql',
  data = 'data',
}

export const DEFAULT_HOST = 'api.outerbase.com'

export class EZQL {
  token: string
  host: string | undefined

  constructor({ token, host }: EZQLOpts) {
    this.token = token
    if (host) this.host = host
  }

  get baseUrl() {
    return this.host || process.env.API_HOST || DEFAULT_HOST
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
