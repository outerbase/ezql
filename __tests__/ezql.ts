import { DEFAULT_HOST, EZQL, Prompt } from '../src/ezql'

describe('register EZQL', () => {
  const token = 'arbitrary-value'

  let ob: EZQL
  let ogFetch: typeof global.fetch
  let fetch: jest.Mock // TODO add proper generic type

  beforeEach(() => {
    // remember the original values
    ogFetch = global.fetch

    // then replace it with a mock
    fetch = global.fetch = jest.fn()

    // create new instance of EZQL
    ob = new EZQL({ token })
  })

  afterEach(() => {
    // restore normal 'fetch' module
    global.fetch = ogFetch
  })

  test('rejects missing token', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new EZQL()).toThrowError()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new EZQL({})).toThrowError()
  })

  test('accepts a valid token', () => {
    expect(ob.token).toEqual(token)
  })

  test('utilizes host parameter', async () => {
    expect.assertions(2)

    const host = 'arbitrary-host'
    ob = new EZQL({ token, host })

    expect(ob.host).toEqual(host)
    expect(ob.baseUrl).not.toEqual(DEFAULT_HOST)
  })

  test('utilizes env OUTERBASE_EZQL_HOST', async () => {
    expect.assertions(2)

    const differentHost = 'a different value'
    process.env.OUTERBASE_EZQL_HOST = differentHost

    expect(ob.baseUrl).toEqual(process.env.OUTERBASE_EZQL_HOST)
    expect(ob.baseUrl).not.toEqual(DEFAULT_HOST)

    delete process.env.OUTERBASE_EZQL_HOST
  })

  test('falls back to default host', () => {
    expect.assertions(1)
    expect(ob.baseUrl).toEqual(DEFAULT_HOST)
  })

  test('.prompt() rejects missing params', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(async () => await ob.prompt()).rejects.toThrowError()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(async () => await ob.prompt('with one parameter')).rejects.toThrowError()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(async () => await ob.prompt('with 2 parameters', 'but the second is invalid')).rejects.toThrowError()
  })

  test('prompt.data yields data', async () => {
    expect.assertions(2)

    const mockedResponse = '42'
    fetch.mockResolvedValue(new Response(mockedResponse))

    const phrase = 'What is the answer to life, the univerise and everything?'
    const response = await ob.prompt(phrase, Prompt.data)

    expect(fetch).toHaveBeenCalledWith(`https://${DEFAULT_HOST}/ezql?phrase=What+is+the+answer+to+life%2C+the+univerise+and+everything%3F&type=data`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response).toEqual(mockedResponse)
  })

  test('prompt.sql yields SQL', async () => {
    expect.assertions(2)

    const mockedResponse = 'SELECT answer FROM ultimate_question;'
    fetch.mockResolvedValue(new Response(mockedResponse))

    const phrase = 'What is the answer to life, the univerise and everything?'
    const response = await ob.prompt(phrase, Prompt.sql)

    expect(fetch).toHaveBeenCalledWith(`https://${DEFAULT_HOST}/ezql?phrase=What+is+the+answer+to+life%2C+the+univerise+and+everything%3F&type=sql`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response).toEqual(mockedResponse)
  })
})
