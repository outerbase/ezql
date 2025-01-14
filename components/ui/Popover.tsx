'use client'

import { type FC, useRef, useEffect } from 'react'

interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

/**
 * Accessible Popover component that supports keyboard navigation
 * and follows WAI-ARIA guidelines.
 */
export const Popover: FC<PopoverProps> = ({ 
  isOpen, 
  onClose, 
  children,
  className 
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className={`
        absolute top-full mt-2 w-full max-w-md bg-white rounded-xl shadow-lg 
        ring-1 ring-black/5 p-4 transform transition-all duration-200 ease-out
        opacity-0 translate-y-[-8px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0
        ${className ?? ''}
      `}
      data-state={isOpen ? 'open' : 'closed'}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  )
} 