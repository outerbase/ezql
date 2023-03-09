import { useRef } from 'react'
import { classNames } from '../lib/class-names'

import styles from './suggest-search-list-item.module.css'

type SuggestSearchListItemOpts = {
  text: string
  didSubmitWithValue?: (text: string) => void
}

export function SuggestSearchListItem({ text, didSubmitWithValue }: SuggestSearchListItemOpts) {
  const selfRef = useRef<HTMLLIElement>(null)

  function didSelectItem() {
    if (didSubmitWithValue) didSubmitWithValue(text)
  }

  function selectFirstItem() {
    selfRef?.current?.parentElement?.querySelector('li')?.focus()
  }

  function selectLastItem() {
    const lastEl = selfRef?.current?.parentElement?.querySelector<HTMLElement>('li:last-child')
    lastEl?.focus()
  }

  function selectNextItem() {
    const next = selfRef?.current?.nextSibling as HTMLElement | null | undefined

    if (next) {
      next.focus()
    } else {
      selectFirstItem()
    }
  }

  function selectPrevItem() {
    const prev = selfRef?.current?.previousSibling as HTMLElement | null | undefined

    if (prev) {
      prev.focus()
    } else {
      selectLastItem()
    }
  }

  return (
    <li
      tabIndex={0}
      className={classNames(styles.list_item, 'suggestion-search-list-item')}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter') didSelectItem()
        if (ev.key === 'ArrowDown') selectNextItem()
        if (ev.key === 'ArrowUp') selectPrevItem()
      }}
      onClick={didSelectItem}
      ref={selfRef}
    >
      <img className={classNames(styles.search_icon, 'search-icon')} src="icon_search.svg" alt="Search icon" />
      <span className={classNames(styles.suggested_text, 'suggested-text')}>{text}</span>
      <img
        className={classNames(styles.arrow_right_icon, 'arrow-right-icon')}
        src="icon_arrow-right.svg"
        alt="Arrow right icon"
      />
    </li>
  )
}
