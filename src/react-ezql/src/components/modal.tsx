import { useRef, MouseEvent, PropsWithChildren, useEffect } from 'react'
import { classNames } from '../lib/class-names'

import styles from './modal.module.css'

type ModalOpts = {
  didDismiss: () => void
  className: string
}

export default function Modal({ children, didDismiss, className }: PropsWithChildren<ModalOpts>) {
  const bgDivRef = useRef<HTMLDivElement>(null)

  function dismissWhenBgClicked(ev: MouseEvent<HTMLDivElement>) {
    if (ev.target === bgDivRef.current) didDismiss()
  }

  // dismiss modal `Escape` key is pressed
  useEffect(() => {
    function escapeListener(ev: KeyboardEvent) {
      if (ev.code === 'Escape') {
        didDismiss()
        document.removeEventListener('keydown', escapeListener)
      }
    }

    document.addEventListener('keydown', escapeListener)
    return () => {
      document.removeEventListener('keydown', escapeListener)
    }
  }, [])

  return (
    <div
      className={classNames(styles.parent, className)}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={dismissWhenBgClicked}
    >
      <div className={styles.backdrop_shadow}></div>
      <div className={styles.container}>
        <div className={styles.backdrop} ref={bgDivRef}>
          <div className={styles.foreground}>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
