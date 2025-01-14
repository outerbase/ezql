'use client'

import { type FC, memo, useCallback, useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { Message, ChatState, ConnectionType, MessageActions } from '../types'
import { Icons } from './ui/icons'
import { usePopover } from '../hooks/usePopover'
import { Popover } from './ui/Popover'
import { chatApi } from '../lib/api'
import type { ChatMessage, ChatResponse } from '../types/api'
import Footer from '../components/Footer'
import { useVirtualizer } from '@tanstack/react-virtual'

/**
 * Props for the connection option buttons in the chat interface
 * @property {("database" | "fileUpload")} icon - Icon to display
 * @property {string} label - Button label text
 * @property {() => void} onClick - Click handler
 * @property {ConnectionType} type - Type of connection
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
 */
const Message: FC<MessageProps> = memo(function Message({ message, isHovered, actions }) {
  const isUser = message.type === 'user'
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus management
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(editContent.length, editContent.length)
    }
  }, [isEditing])

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
        className={`relative flex max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-blue-500 text-white rounded-tr-none ml-auto' 
            : 'bg-gray-100 text-gray-900 rounded-tl-none'
        }`}
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
        <span className="text-sm">Thinking</span>
      </div>
    </div>
  )
})

/**
 * Virtualized message list for efficient rendering of large message lists
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
      // Estimate based on content length
      const content = messages[index].content
      const lines = content.split('\n').length
      const baseHeight = 80 // Base height for a message
      const lineHeight = 20 // Estimated height per line
      return baseHeight + (lines * lineHeight)
    }, [messages]),
    overscan: 5,
    measureElement: useCallback((element: HTMLElement) => {
      return element.getBoundingClientRect().height
    }, []),
  })

  // Handle scrolling when new messages arrive
  useEffect(() => {
    if (!messages.length) return
    
    const lastMessage = messages[messages.length - 1]
    // Only scroll if this is a new message
    if (lastMessage.id !== lastMessageRef.current) {
      lastMessageRef.current = lastMessage.id
      
      // Wait for the message to be rendered and measured
      requestAnimationFrame(() => {
        const scrollContainer = parentRef.current?.closest('.overflow-y-auto')
        if (scrollContainer) {
          // Calculate scroll position including padding for input bar
          const scrollHeight = scrollContainer.scrollHeight
          const clientHeight = scrollContainer.clientHeight
          const paddingBottom = 200 // Account for input bar and padding
          
          scrollContainer.scrollTo({
            top: scrollHeight - clientHeight + paddingBottom,
            behavior: 'smooth'
          })
        }
      })
    }
  }, [messages])

  return (
    <div ref={parentRef} className="relative w-full">
      <div
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
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
 * - Accessibility support
 * - Loading states and error handling
 */
const ChatInterface: FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    chatMessages: [],
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
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
      }

      setState(prev => ({ 
        ...prev, 
        hasStarted: true,
        messages: [...prev.messages, {
          id: crypto.randomUUID(),
          content: message,
          timestamp: new Date(),
          type: 'user'
        }],
        chatMessages: [...prev.chatMessages, userMessage]
      }))

      const response = await chatApi.sendMessage([...state.chatMessages, userMessage])

      if (response.error) {
        throw new Error(response.error)
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: crypto.randomUUID(),
          content: response.message,
          timestamp: new Date(),
          type: 'system'
        }],
        chatMessages: [...prev.chatMessages, userMessage, {
          role: 'assistant',
          content: response.message
        }]
      }))

      setMessage('')
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [message, state.chatMessages])

  const handleEdit = useCallback(async (messageId: string, newContent: string) => {
    setState(prev => {
      const messageIndex = prev.messages.findIndex(m => m.id === messageId)
      if (messageIndex === -1) return prev

      const newMessages = [...prev.messages]
      newMessages[messageIndex] = {
        ...newMessages[messageIndex],
        content: newContent,
        edited: true
      }

      const chatMessageIndex = prev.chatMessages.findIndex((_, i) => i === messageIndex)
      const newChatMessages = [...prev.chatMessages]
      if (chatMessageIndex !== -1) {
        newChatMessages[chatMessageIndex] = {
          role: 'user',
          content: newContent
        }
      }

      return {
        ...prev,
        messages: newMessages,
        chatMessages: newChatMessages
      }
    })
  }, [])

  const handleRegenerate = useCallback(async (messageId: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      // Find the message and all previous messages up to it
      const messageIndex = state.messages.findIndex(m => m.id === messageId)
      if (messageIndex === -1) return

      const previousMessages = state.chatMessages.slice(0, messageIndex)
      const response: ChatResponse = await chatApi.sendMessage(previousMessages)

      if (response.error) {
        throw new Error(response.error)
      }

      setState(prev => {
        const newMessages = [...prev.messages]
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          content: response.message
        }

        const newChatMessages = [...prev.chatMessages]
        newChatMessages[messageIndex] = {
          role: 'assistant',
          content: response.message
        }

        return {
          ...prev,
          messages: newMessages,
          chatMessages: newChatMessages
        }
      })
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.messages, state.chatMessages])

  const messageActions: MessageActions = {
    onEdit: handleEdit,
    onRegenerate: handleRegenerate,
    // Placeholder for future branch implementation
    onBranch: async () => {}
  }

  if (state.error) {
    return (
      <div role="alert" className="text-red-500">
        Error: {state.error.message}
      </div>
    )
  }
// IMPORTANT the state error message is not easily fixable, ignore it for now
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
                  <VirtualMessageList messages={state.messages} actions={messageActions} />
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
      {state.error && (
        <div className="fixed top-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-sm">
          {state.error}
        </div>
      )}
    </main>
  )
}

export default ChatInterface 