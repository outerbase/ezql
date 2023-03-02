#! /usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import { EZQL, Prompt } from '../lib/index'

const version = '0.0.2'
const program = new Command()

program
  .version(version)
  .description('A natural language to SQL converter')
  .argument('<phrase>', 'A query written in natural language to be executed against your database.')
  .option('-e, --execute', 'Specifies whether to automatically execute the generated SQL statement. Defaults to false.')
  .option(
    '-t, --token <value>',
    'Identifies which database to run queries against. This is provided by Outerbase. May also be provided via the environment variable "OUTERBASE_EZQL_TOKEN"'
  )
  .option('-h, --host <value>', 'API host used for requests. Defaults to "api.outerbase.com".')
  .action(async (query, { execute, host, token: _token }) => {
    const token = _token || process.env.OUTERBASE_EZQL_TOKEN
    if (!token)
      throw new Error(
        '"token" must be provided either as an argument (--token) or via the environment variable "OUTERBASE_EZQL_TOKEN"'
      )

    const ezql = new EZQL({ token, host })
    const response = await ezql.prompt(query, execute ? Prompt.data : Prompt.sql)

    // TODO fancy formatting and/or syntax highlighting
    console.log(response)
  })
  .parse(process.argv)
