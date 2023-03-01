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
  host?: string

  constructor(opts: EZQLOpts) {
    if (!opts) throw new Error("Required options hash with param 'token' is missing, i.e. new EZQL({ token: 'your-value-here' })")

    const { token, host } = opts

    if (!token) throw new Error("Required 'token` param is missing form options hash, i.e. new EZQL({ token: 'your-value-here' })")

    this.token = token
    if (host) this.host = host
  }

  get baseUrl() {
    // precedence: arg > env > default

    if (typeof process === 'undefined') {
      // non-node environemnt (e.g. the browser)
      return this.host || DEFAULT_HOST
    } else {
      return this.host || process.env.OUTERBASE_EZQL_HOST || DEFAULT_HOST
    }
  }

  async prompt(phrase: string, type: Prompt): Promise<string> {
    // console.debug(`prompt("${phrase}", ${type})`)
    if (!phrase || !type) throw new Error(`EZQL.prompt requires a 'phrase' and 'type' parameter`)
    if (!Object.values(Prompt).includes(type)) throw new Error(`EZQL.Prompt requires 'type' in [${Object.values(Prompt)}]`)

    const params = new URLSearchParams({ phrase, type })
    const result = await fetch(`https://${this.baseUrl}/ezql?${params}`, {
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
