import { useCallback, useRef, useState } from 'react'
import Modal from './modal'
import { SuggestSearchListItem } from './suggest-search-list-item'
import { classNames } from '../lib/class-names'
import { EZQL, Prompt } from 'ezql'

import styles from './ezql-prompt.module.css'

export type EzqlPromptOpts = {
  token: string
  setShouldDisplayEzql: (value: boolean) => void
  onResults: (data: string | Object) => void
  didSubmitWithValue?: (query: string) => void
  suggestions?: Array<string>
  className?: string
}

export default function EzqlPrompt({
  token, // authenticates and identifies the scope of this request with Outerbase
  setShouldDisplayEzql, // toggles display of the modal
  didSubmitWithValue, // fires before the request goes to Outerbase
  onResults, // fires upon receiving a response from Outerbase
  suggestions, // pre-populate the list of suggested queries
  className, // optional styling classes
}: EzqlPromptOpts) {
  const [query, setQuery] = useState('')

  const listRef = useRef<HTMLUListElement>(null)

  const onSubmission = useCallback(
    async (phrase: string) => {
      if (!token) throw new Error('Missing token')
      if (didSubmitWithValue) didSubmitWithValue(phrase)

      const ezql = new EZQL({ token, host: 'app.dev.outerbase.com' })
      const {
        response: {
          query: { text: sql },
        },
      } = await ezql.prompt(phrase, Prompt.sql)
      
      onResults(sql)
    },
    [token]
  )

  return (
    <Modal didDismiss={() => setShouldDisplayEzql(false)} className={classNames('ezql-prompt-modal', className)}>
      <div className={classNames(styles.container, 'container')}>
        <div className={classNames(styles.input_container, 'input-container')}>
          <div className={classNames(styles.input_icon_container, 'input-icon-container')}>
            <img src="ezql_diamond-small.png" alt="EZQL Icon" className={classNames(styles.input_icon, 'input-icon')} />
          </div>
          <input
            className={classNames(styles.input, 'typography_text_large')}
            type="text"
            autoFocus={true}
            placeholder="Search your database..."
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') onSubmission(query)
              else if (ev.key === 'ArrowDown') listRef?.current?.querySelector<HTMLLIElement>('li')?.focus()
              else if (ev.key === 'ArrowUp') listRef?.current?.querySelector<HTMLLIElement>('li:last-child')?.focus()
            }}
          />
        </div>

        <div className={classNames(styles.suggestions_container, 'suggestions-container')}>
          <span className={classNames(styles.suggestions_hint, 'typography_text_small', 'suggestions-hint')}>
            Search via plain text EZQL will automatically convert it to a SQL query, you could also try one of the
            generated prompts.
          </span>
          <ul className={classNames(styles.suggestions_list, 'suggestions-list')} ref={listRef}>
            {suggestions?.map((text) => (
              <SuggestSearchListItem key={text} text={text} didSubmitWithValue={onSubmission} />
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}
