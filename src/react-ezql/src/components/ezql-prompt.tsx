import { useCallback, useRef, useState } from 'react'
import Modal from './modal'
import { SuggestSearchListItem } from './suggest-search-list-item'
import { classNames } from '../lib/class-names'

import styles from './ezql-prompt.module.css'

export type EzqlPromptOpts = {
  token: string
  setShouldDisplayEzql: (value: boolean) => void
  onResults: (data: object) => void
  didSubmitWithValue?: (query: string) => void
  suggestions?: Array<string>
  className?: string
}

export default function EzqlPrompt({
  token,
  setShouldDisplayEzql,
  didSubmitWithValue,
  onResults,
  suggestions,
  className,
}: EzqlPromptOpts) {
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLUListElement>(null)

  const onSubmission = useCallback((value: string) => {
    if (didSubmitWithValue) didSubmitWithValue(value)

    // TODO make request to Outerbase
    // and pass the result to onResults()
  }, [])

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
              <SuggestSearchListItem key={text} text={text} didSubmitWithValue={didSubmitWithValue} />
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}
