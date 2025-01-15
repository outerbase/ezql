'use client'

import { type FC, memo, useCallback, useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import type { Message, ChatState, ConnectionType, MessageActions, Branch, BranchId } from '../types'
import { Icons } from './ui/icons'
import { usePopover } from '../hooks/usePopover'
import { Popover } from './ui/Popover'
import { chatApi } from '../lib/api'
import type { ChatMessage, ChatResponse } from '../types/api'
import Footer from '../components/Footer'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDebouncedCallback } from 'use-debounce'
import BranchMinimap from './BranchMinimap'

/**
 * --------------------------------------------------------------------------
 * Utility: gather the entire ancestry for a given branch,
 * from the ROOT to the activeBranchId.
 * 
 * Example: if active branch is 3rd level:
 *   [ mainBranch, secondBranch, activeBranch ]
 */
function getBranchAncestry(branches: Branch[], messages: Message[], activeBranchId: string): Branch[] {
  const branchMap: Record<string, Branch> = {}
  for (const b of branches) {
    branchMap[b.id] = b
  }

  const result: Branch[] = []
  let current = branchMap[activeBranchId]
  while (current) {
    // Insert at start => final array = [ root-most, ..., activeBranch ]
    result.unshift(current)

    // if no parentMessageId, we've reached a root
    if (!current.parentMessageId) {
      break
    }
    // find parent's branch
    const parentMsg = messages.find((m) => m.id === current.parentMessageId)
    if (!parentMsg) {
      break
    }
    const parentBranch = branchMap[parentMsg.branchId]
    if (!parentBranch) {
      break
    }
    current = parentBranch
  }
  return result
}

/**
 * --------------------------------------------------------------------------
 * Utility: get all visible messages from the entire chain of ancestors
 * plus the active branch. For each ancestor branch, we only show messages
 * up to the branch point that leads to the next child.
 */
function getVisibleMessages(branches: Branch[], messages: Message[], activeBranchId: string): Message[] {
  const ancestry = getBranchAncestry(branches, messages, activeBranchId)
  let all: Message[] = []

  for (let i = 0; i < ancestry.length; i++) {
    const currentBranch = ancestry[i]
    // sort messages for this branch
    const branchMsgs = messages
      .filter((m) => m.branchId === currentBranch.id)
      .sort((a, b) => a.order - b.order)

    // If not the last branch in the ancestry, only show up to the parent's branching message
    if (i < ancestry.length - 1) {
      const nextBranch = ancestry[i + 1]
      const nextBranchParentMsgId = nextBranch.parentMessageId
      if (nextBranchParentMsgId) {
        // find that message in currentBranch
        const parentMsg = branchMsgs.find((m) => m.id === nextBranchParentMsgId)
        if (parentMsg) {
          all = all.concat(branchMsgs.filter((m) => m.order <= parentMsg.order))
          continue
        }
      }
    }
    // otherwise, if it's the last branch (the active branch),
    // include all messages from that branch
    all = all.concat(branchMsgs)
  }

  // deduplicate (some messages might appear in multiple branches if they share the same parentMessage)
  const uniqueMap = new Map<string, Message>()
  for (const msg of all) {
    uniqueMap.set(msg.id, msg)
  }
  // re-sort by order
  const deduped = Array.from(uniqueMap.values()).sort((a, b) => a.order - b.order)
  return deduped
}

// --------------------------------------------------------------------------
// Constants for better maintainability
// --------------------------------------------------------------------------
const SCROLL_PADDING = 200
const MESSAGE_BASE_HEIGHT = 80
const MESSAGE_LINE_HEIGHT = 20
const SCROLL_DEBOUNCE_MS = 100

/**
 * Custom hook to handle keyboard shortcuts
 */
const useKeyboardShortcuts = (
  onSubmit: () => void,
  isLoading: boolean
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isLoading) {
        onSubmit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSubmit, isLoading])
}

/**
 * Estimates the height of a message based on its content
 * Used for virtualization optimization
 */
const estimateMessageHeight = (content: string): number => {
  const lines = content.split('\n').length
  return MESSAGE_BASE_HEIGHT + (lines * MESSAGE_LINE_HEIGHT)
}

/**
 * Props for the connection option buttons in the chat interface
 */
interface ConnectionOptionProps {
  icon: "database" | "fileUpload"
  label: string
  onClick: () => void
  type: ConnectionType
}

/**
 * Connection option button component for database and file upload options
 */
const ConnectionOption: FC<ConnectionOptionProps> = memo(function ConnectionOption({ 
  icon, 
  label,
  onClick,
  type 
}) {
  const Icon = Icons[icon]
  
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200
        hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 
        focus:ring-gray-200 focus:ring-offset-1"
      data-type={type}
      aria-label={`Connect using ${label}`}
    >
      <div className="text-gray-600" aria-hidden="true">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
})

/**
 * Props for the chat input form
 */
interface ChatFormProps {
  message: string
  setMessage: (message: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isLoading: boolean
}

/**
 * Chat input form component with attachment options
 */
const ChatForm: FC<ChatFormProps> = memo(function ChatForm({ 
  message, 
  setMessage, 
  onSubmit,
  isLoading 
}) {
  const popover = usePopover()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDatabaseConnect = useCallback((): void => {
    popover.close()
    // Handle database connection
  }, [popover])

  const handleCsvUpload = useCallback((): void => {
    popover.close()
    // Handle CSV upload
  }, [popover])

  // Focus input when form is mounted
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="relative">
      <form onSubmit={onSubmit} className="relative">
        <div className="relative flex items-center w-full bg-white rounded-full border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={popover.toggle}
            className="absolute left-4 text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Add attachment"
            aria-expanded={popover.isOpen}
            aria-haspopup="true"
          >
            <Icons.paperclip className="w-5 h-5" aria-hidden="true" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask..."
            className="w-full py-3 px-12 bg-transparent focus:outline-none text-[15px] placeholder-gray-400"
            aria-label="Message input"
            disabled={isLoading}
          />

          <div className="absolute right-4 flex items-center justify-center h-full">
            {isLoading ? (
              <Icons.spinner className="w-4 h-4 text-blue-500 animate-spin" aria-hidden="true" />
            ) : (
              <button 
                type="submit"
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="Send message"
                disabled={!message.trim()}
              >
                <Icons.arrowRight className="w-4 h-4 -rotate-90 transform-gpu" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </form>

      <Popover 
        isOpen={popover.isOpen} 
        onClose={popover.close}
        aria-label="Connection options"
      >
        <div className="space-y-1">
          <ConnectionOption
            icon="database"
            label="Connect to Database"
            onClick={handleDatabaseConnect}
            type="database"
          />
          <ConnectionOption
            icon="fileUpload"
            label="Upload a CSV"
            onClick={handleCsvUpload}
            type="csv"
          />
        </div>
      </Popover>
    </div>
  )
})

/**
 * Props for the message component
 */
interface MessageProps {
  message: Message
  isHovered: boolean
  actions: MessageActions
}

/**
 * Individual message component with edit/regenerate capabilities
 * Supports keyboard navigation and screen reader announcements
 */
const Message: FC<MessageProps> = memo(function Message({ message, isHovered, actions }) {
  const isUser = message.type === 'user'
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus management and keyboard navigation
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(editContent.length, editContent.length)
    }
  }, [isEditing, editContent])

  // Announce edits to screen readers
  useEffect(() => {
    if (message.edited) {
      const announcement = `Message edited: ${message.content}`
      const ariaLive = document.createElement('div')
      ariaLive.className = 'sr-only'
      ariaLive.setAttribute('aria-live', 'polite')
      ariaLive.textContent = announcement
      document.body.appendChild(ariaLive)
      setTimeout(() => ariaLive.remove(), 1000)
    }
  }, [message.edited, message.content])

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    const trimmedContent = editContent.trim()
    if (trimmedContent && trimmedContent !== message.content) {
      await actions.onEdit?.(message.id, trimmedContent)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEdit()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditContent(message.content)
    }
  }

  return (
    <div 
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      role="listitem"
      aria-label={`${isUser ? 'Your message' : 'AI response'}`}
    >
      {message.type === 'system' && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" aria-hidden="true">
          <Image
            src="/ezql.png"
            alt="AI Assistant"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      )}
      <div 
        className={`
          relative flex max-w-[80%] px-4 py-2 rounded-2xl
          ${isUser ? 'bg-blue-500 text-white rounded-tr-none ml-auto' : 'bg-gray-100 text-gray-900 rounded-tl-none'}
        `}
      >
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent resize-none focus:outline-none text-sm"
            style={{ 
              color: 'inherit',
              minHeight: '1.5rem',
            }}
            aria-label="Edit message"
          />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
            {message.edited && (
              <span className="text-xs opacity-50 ml-1" aria-label="Message edited">(edited)</span>
            )}
          </p>
        )}
        
        {/* Hover Actions */}
        {isHovered && !isEditing && (
          <div className="absolute right-0 top-full pt-1 flex gap-1">
            <div className="p-2 -m-2 flex gap-1">
              {isUser ? (
                <button
                  onClick={handleEdit}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Edit message"
                >
                  <Icons.pencil className="w-3 h-3" aria-hidden="true" />
                </button>
              ) : (
                <button
                  onClick={() => actions.onRegenerate?.(message.id)}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Regenerate response"
                >
                  <Icons.refresh className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
              <button
                onClick={() => actions.onBranch?.(message.id)}
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Branch conversation"
              >
                <Icons.gitBranch className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

/**
 * Loading message component with animated dots
 */
const LoadingMessage = memo(function LoadingMessage() {
  return (
    <div className="flex items-start gap-3" role="status" aria-label="AI is thinking">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" aria-hidden="true">
        <Image
          src="/ezql.png"
          alt="AI Assistant"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 text-gray-400">
        <div className="flex gap-1" aria-hidden="true">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
})

/**
 * Virtualized message list for efficient rendering of large message lists
 * Implements optimized scrolling and message height estimation
 */
const VirtualMessageList = memo(function VirtualMessageList({ 
  messages,
  actions 
}: { 
  messages: Message[]
  actions: MessageActions
}) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const lastMessageRef = useRef<string | null>(null)
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index) => {
      return estimateMessageHeight(messages[index].content)
    }, [messages]),
    overscan: 5,
    measureElement: useCallback((element: HTMLElement) => {
      return element.getBoundingClientRect().height
    }, []),
  })

  // Debounced scroll handler for better performance
  const handleScroll = useDebouncedCallback(
    (scrollContainer: HTMLElement, scrollHeight: number, clientHeight: number) => {
      scrollContainer.scrollTo({
        top: scrollHeight - clientHeight + SCROLL_PADDING,
        behavior: 'smooth'
      })
    },
    SCROLL_DEBOUNCE_MS
  )

  // Handle scrolling when new messages arrive
  useEffect(() => {
    if (!messages.length) return
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.id !== lastMessageRef.current) {
      lastMessageRef.current = lastMessage.id
      
      requestAnimationFrame(() => {
        const scrollContainer = parentRef.current?.closest('.overflow-y-auto') as HTMLElement
        if (scrollContainer) {
          const scrollHeight = scrollContainer.scrollHeight
          const clientHeight = scrollContainer.clientHeight
          handleScroll(scrollContainer, scrollHeight, clientHeight)
        }
      })
    }
  }, [messages, handleScroll])

  return (
    <div ref={parentRef} className="relative w-full">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const message = messages[virtualItem.index]
          return (
            <div
              key={message.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
                padding: '1.5rem 0',
              }}
              onMouseEnter={() => setHoveredIndex(virtualItem.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-2/3 mx-auto">
                <Message 
                  message={message} 
                  isHovered={hoveredIndex === virtualItem.index}
                  actions={actions}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

/**
 * Main chat interface component
 * Provides a natural language interface for database interactions
 * 
 * Features:
 * - Real-time chat with AI
 * - Message editing and regeneration
 * - Virtualized message list for performance
 * - Keyboard shortcuts and accessibility support
 * - Loading states and error handling
 * 
 * @example
 * ```tsx
 * <ChatInterface />
 * ```
 */
const ChatInterface: FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    branches: [
      {
        id: 'main',
        name: 'Main Conversation',
        createdAt: new Date(),
        active: true,
        chatContext: []
      }
    ],
    activeBranchId: 'main',
    isLoading: false,
    error: null,
    hasStarted: false
  })
  const [message, setMessage] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!message.trim()) return

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const activeBranch = state.branches.find(b => b.id === state.activeBranchId)
      if (!activeBranch) return

      // Create the new message
      const newMessage = {
        id: crypto.randomUUID(),
        content: message,
        timestamp: new Date(),
        type: 'user' as const,
        branchId: state.activeBranchId,
        order: state.messages.length
      }

      // Chat message context
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
      }

      // Update local state with new user message
      setState(prev => {
        const newBranches = prev.branches.map(b => 
          b.id === prev.activeBranchId
            ? { ...b, chatContext: [...b.chatContext, userMessage] }
            : b
        )
        return { 
          ...prev, 
          hasStarted: true,
          branches: newBranches,
          messages: [...prev.messages, newMessage]
        }
      })

      // Call the AI API
      const updatedBranch = state.branches.find(b => b.id === state.activeBranchId)
      if (!updatedBranch) return

      const response = await chatApi.sendMessage([...updatedBranch.chatContext, userMessage])
      if (response.error) {
        throw new Error(response.error)
      }

      // AI response message
      const aiMessage = {
        id: crypto.randomUUID(),
        content: response.message,
        timestamp: new Date(),
        type: 'system' as const,
        branchId: state.activeBranchId,
        order: state.messages.length + 1
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message
      }

      // Update local state with AI message
      setState(prev => {
        const newBranches = prev.branches.map(b => 
          b.id === prev.activeBranchId
            ? { ...b, chatContext: [...b.chatContext, assistantMessage] }
            : b
        )
        return {
          ...prev,
          branches: newBranches,
          messages: [...prev.messages, aiMessage]
        }
      })

      setMessage('')
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [message, state.branches, state.activeBranchId])

  // Editing
  const handleEdit = useCallback(async (messageId: string, newContent: string) => {
    setState(prev => {
      const msgIndex = prev.messages.findIndex(m => m.id === messageId)
      if (msgIndex === -1) return prev

      const oldMsg = prev.messages[msgIndex]
      const branch = prev.branches.find(b => b.id === oldMsg.branchId)
      if (!branch) return prev

      // Update the message
      const newMsgs = [...prev.messages]
      newMsgs[msgIndex] = { 
        ...oldMsg, 
        content: newContent, 
        edited: true 
      }

      // Update branch context
      const newBranches = prev.branches.map(b => {
        if (b.id !== oldMsg.branchId) return b

        const newContext = [...b.chatContext]
        // find in the context by comparing the index or content
        const ctxIndex = newContext.findIndex(
          (ctxItem, i) => i === msgIndex
        )
        if (ctxIndex !== -1) {
          newContext[ctxIndex] = {
            role: oldMsg.type === 'user' ? 'user' : 'assistant',
            content: newContent
          }
        }
        return { ...b, chatContext: newContext }
      })

      return { ...prev, messages: newMsgs, branches: newBranches }
    })
  }, [])

  // Regenerate
  const handleRegenerate = useCallback(async (messageId: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const idx = state.messages.findIndex(m => m.id === messageId)
      if (idx === -1) return

      const msg = state.messages[idx]
      const branch = state.branches.find(b => b.id === msg.branchId)
      if (!branch) return

      // previous context up to this message
      const prevContext = branch.chatContext.slice(0, idx)
      const response: ChatResponse = await chatApi.sendMessage(prevContext)
      if (response.error) {
        throw new Error(response.error)
      }

      setState(prev => {
        const newMsgs = [...prev.messages]
        newMsgs[idx] = {
          ...newMsgs[idx],
          content: response.message
        }

        // Update context
        const newBranches = prev.branches.map(b => {
          if (b.id !== msg.branchId) return b
          const newCtx = [...b.chatContext]
          newCtx[idx] = { role: 'assistant', content: response.message }
          newCtx.length = idx + 1
          return { ...b, chatContext: newCtx }
        })
        return { ...prev, messages: newMsgs, branches: newBranches }
      })
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.messages, state.branches])

  // Branching
  const handleBranch = useCallback(async (messageId: string) => {
    const sourceMsg = state.messages.find(m => m.id === messageId)
    if (!sourceMsg) return

    // Create new branch
    const branchId = crypto.randomUUID()
    const branchName = `Branch from "${sourceMsg.content.slice(0, 20)}..."`
    const sourceBranch = state.branches.find(b => b.id === sourceMsg.branchId)
    if (!sourceBranch) return

    // Gather relevant messages from the source branch & ancestors, up to this message
    const relevant = state.messages
      .filter((m) => {
        // If it's from the same branch, include up to the branching message
        if (m.branchId === sourceBranch.id) {
          return m.order <= sourceMsg.order
        }
        // Also include ancestors
        let curr = sourceBranch
        while (curr.parentMessageId) {
          const parentMsg = state.messages.find(mm => mm.id === curr.parentMessageId)
          if (!parentMsg) break
          const parentBr = state.branches.find(bb => bb.id === parentMsg.branchId)
          if (!parentBr) break

          // If the message is from that parent branch & before or at the parent's msg
          if (m.branchId === parentBr.id && m.order <= parentMsg.order) {
            return true
          }
          curr = parentBr
        }
        return false
      })
      .sort((a, b) => a.order - b.order)

    const branchContext: ChatMessage[] = relevant.map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.content
    }))

    const newBranch: Branch = {
      id: branchId,
      parentMessageId: messageId,
      name: branchName,
      createdAt: new Date(),
      active: true,
      chatContext: branchContext
    }

    setState(prev => ({
      ...prev,
      branches: prev.branches.map(b => ({ ...b, active: false })).concat(newBranch),
      activeBranchId: branchId
    }))
  }, [state.messages, state.branches])

  // Switch branch
  const handleBranchSelect = useCallback((branchId: BranchId) => {
    setState(prev => ({
      ...prev,
      branches: prev.branches.map(b => ({
        ...b,
        active: b.id === branchId
      })),
      activeBranchId: branchId
    }))
  }, [])

  // Collect actions
  const messageActions: MessageActions = {
    onEdit: handleEdit,
    onRegenerate: handleRegenerate,
    onBranch: handleBranch
  }

  // NEW: gather all visible messages from active branch + its ancestors
  const visibleMessages = useMemo(() => {
    return getVisibleMessages(state.branches, state.messages, state.activeBranchId)
  }, [state.branches, state.messages, state.activeBranchId])

  // Keybinding
  useKeyboardShortcuts(
    () => handleSubmit(new Event('submit') as any),
    state.isLoading
  )

  // Show error if present
  if (state.error) {
    return (
      <div role="alert" className="text-red-500">
        Error: {state.error.message}
      </div>
    )
  }

  // UI
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col mx-auto w-full">
        {!state.hasStarted ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-8 relative">
                <Image
                  src="/ezql.png"
                  alt="AI Assistant"
                  width={128}
                  height={128}
                  priority
                  className="object-cover"
                />
              </div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold mb-2">Chat with your database</h1>
                <p className="text-gray-600">Ask questions about your data in plain English</p>
              </div>
              
              <div className="w-full max-w-3xl px-4">
                <ChatForm 
                  message={message}
                  setMessage={setMessage}
                  onSubmit={handleSubmit}
                  isLoading={state.isLoading}
                />
              </div>
            </div>
            <Footer />
          </>
        ) : (
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative">
            <div 
              className="absolute inset-0 overflow-y-auto pb-48"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              <div className="min-h-full">
                <div className="max-w-3xl mx-auto px-4">
                  <VirtualMessageList messages={visibleMessages} actions={messageActions} />
                  {state.isLoading && (
                    <div className="w-2/3 mx-auto">
                      <LoadingMessage />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
              <div className="h-32 bg-gradient-to-b from-transparent via-[#fafafa]/50 to-[#fafafa] pointer-events-none" />
              <div className="bg-[#fafafa] pointer-events-auto">
                <div className="max-w-3xl mx-auto px-4 py-4">
                  <ChatForm 
                    message={message}
                    setMessage={setMessage}
                    onSubmit={handleSubmit}
                    isLoading={state.isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* If there's an error, show a floating alert (non-blocking) */}
      {state.error && (
        <div className="fixed top-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-sm">
          {state.error}
        </div>
      )}

      {/* Show minimap once conversation starts */}
      {state.hasStarted && (
        <BranchMinimap
          messages={state.messages}
          branches={state.branches}
          activeBranchId={state.activeBranchId}
          onBranchSelect={handleBranchSelect}
        />
      )}
    </main>
  )
}

export default ChatInterface