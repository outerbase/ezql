import Outerbase, { Prompt } from '../lib/outerbase'

describe('register EZQL', () => {
  const token = 'arbitrary-value'
  let ob: Outerbase

  beforeEach(() => {
    ob = new Outerbase({ token })
  })

  test('accepts a valid token', () => {
    expect(ob.token).toEqual(token)
  })

  test('prompt.data yields data', async () => {
    expect.assertions(1)
    const response = await ob.prompt('What is the answer to life, the univerise and everything?', Prompt.data)
    expect(response).toEqual('42')
  })

  test('prompt.sql yields SQL', async () => {
    expect.assertions(1)
    const response = await ob.prompt('What is the answer to life, the univerise and everything?', Prompt.sql)
    expect(response).toEqual('SELECT answer FROM ultimate_question;')
  })
})
