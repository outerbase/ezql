<p style="border: none; margin-bottom:0; padding-bottom: 0;" align="center">
  <a href="https://ezql.ai">
    <picture>
      <img width="64  " alt="EZQL logo" src="./assets/ezql.png">
    </picture>
  </a>
</p>

<h3 align="center">EZQL™ — Ask your database questions in plain text.</h3>
<p align="center">Natural language to SQL convertor that can be embedded anywhere.</p>

<h3 align="center">
  <a target="_blank" href="https://outerbase.com/signup/" rel="dofollow"><strong>Try The Demo</strong></a>
  <br />
</h3>

<br />

<p align="center">
<a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" />
  </a>
  &nbsp;
  <a href="https://github.com/outerbase/ezql/actions">
      <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/outerbase/ezql/node.js.yml?style=flat-square" />
  </a>
  &nbsp;
  <a href="https://github.com/Outerbase/ezql/blob/main/contributing.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome!" />
  </a>
  &nbsp;
  <a href="https://www.npmjs.com/package/ezql">
    <img alt="npm" src="https://img.shields.io/npm/v/ezql?style=flat-square" />
  </a>
  &nbsp;
  <a href="https://twitter.com/outerbase">
    <img src="https://img.shields.io/badge/follow-outerbase-1DA1F2?logo=twitter&style=flat-square" alt="Outerbase Twitter" />
  </a>
</p>

<br />

<a href="https://ezql.ai">
  <img src="./assets/ezql_hero.gif" alt="EZQL ask your database questions using natural language." />
</a>

<br />

## ✨ Why EZQL?

EZQL democratizes the access to data by allowing anybody to ask their database questions. Historically it's been embedded within Outerbase but we've got a lot of asks to make it accessible wherever so we decided to open-source it.

<a target="_blank" href="https://ezql.ai/" rel="dofollow"><strong>Learn more on our website</strong></a>

<a target="_blank" href="https://github.com/outerbase/ezql/discussions"><strong>Request Feature</strong></a>
<br />
<br />

## ⚡️ Before you get started
Follow these steps to have a successful experience using EZQL:
1. [Create an account](https://app.outerbase.com/signup) on Outerbase
2. Attach the database you want to use
3. [Reach out](https://join.slack.com/t/outerbasecommunity/shared_invite/zt-1ple7fhsg-2z6MIC_P4fzdrKe1koJ7kQ) to us for beta access
4. Generate your EZQL token

<br />
<br />


## 🚀 Quick Start
<br />

```sh
npm add ezql
```
<br />

**Usage (TypeScript/ESM)**

```ts
import { Prompt, EZQL } from 'ezql'

const token = 'arbitrary-placeholder-value'
const ez = new EZQL({ token })
const phrase = 'What is the answer to life, the univerise and everything?'

const response = await ez.prompt(phrase, Prompt.sql)
/* "SELECT answer FROM ultimate_question;" */

const response = await ez.prompt(phrase, Prompt.data)
/* "42" */
```
<br />

**Usage (Node.JS/CJS)**

```ts
const { Prompt, EZQL } = require('ezql')

// the remainder is identical to TypeScript usage (see above)
```
<br />

**Usage (Web/UMD)**

Use our hosted file or [save a local copy](https://ezql.ai/bundle.v1.js).

```html
<script src="https://ezql.ai/bundle.v1.js" />
<script>
  // A global variable `Outerbase` is now exposed

  const token = 'arbitrary-placeholder-value'
  const ez = new Outerbase.EZQL({ token })
  const phrase = 'What is the answer to life, the univerise and everything?'

  ez.prompt(phrase, Outerbase.Prompt.sql).then((sqlText) => console.log(sqlText))
  /* "SELECT answer FROM ultimate_question;" */

  ez.prompt(phrase, Outerbase.Prompt.data).then((data) => console.log(data))
  /* "42" */
</script>
```
<br />

**Custom API Endpoint**

You may customize the API endpoint by

- passing `host` to the constructor
- specifying the `API_HOST` environment variable.

<br />

## 🙋 Contributing

If you want to add contributions to this repository, please follow the instructions in [contributing.md](./contributing.md).

<br />

## 🚨 Need help?

There are lots of good conversations and resources in our Github Discussions board & our Slack Server. If you're struggling with something, chances are, someone's already solved what you're up against. :point_down:

- [GitHub Discussions](https://github.com/outerbase/ezql/discussions)
- [GitHub Issues](https://github.com/outerbase/ezql/issues)
- [Slack](https://join.slack.com/t/outerbasecommunity/shared_invite/zt-1ple7fhsg-2z6MIC_P4fzdrKe1koJ7kQ)

<br />

## ⭐ Like what we're doing? Give us a star

![ezql-github-star](./assets/ezql_star.gif)

## 👏 Our contributors

<img align="left" src="https://contributors-img.web.app/image?repo=outerbase/ezql"/>
