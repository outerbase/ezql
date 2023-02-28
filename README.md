# ezql

## Usage (TypeScript)

```sh
npm add ezql
```

```ts
import EZQL, { Prompt } from 'ezql' // const EZQL = require('ezql')

const accessToken = 'arbitrary-placeholder-value'
const ez = new EZQL(accessToken)
const phrase = 'What is the answer to life, the univerise and everything?'

const response = await ez.prompt(phrase, Prompt.sql)
/* "SELECT answer FROM ultimate_question;" */

const response = await ez.prompt(phrase, Prompt.data)
/* "42" */
```

## Usage (Web)

Use our hosted file or [save a local copy](https://ezql.ai/bundle.v1.js).

```html
<script src="https://ezql.ai/bundle.v1.js" />
<script>
  const token = 'arbitrary-placeholder-value'
  const ez = new Outerbase.EZQL({ token })
  const phrase = 'What is the answer to life, the univerise and everything?'

  ez.prompt(phrase, 'sql').then((sqlText) => console.log(sqlText))
  /* "SELECT answer FROM ultimate_question;" */

  ez.prompt(phrase, 'data').then((data) => console.log(data))
  /* "42" */
</script>
```

## Custom API Endpoint

You may customize the API endpoint by

- passing `host` to the constructor
- specifying the `API_HOST` environment variable.
