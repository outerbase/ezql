'use client'

import { useState, useCallback } from 'react'
import type { ChatState } from '../types'
import type { ChatMessage } from '../types/api'
import { chatApi } from '../lib/api'

/**
 * Custom hook for managing chat state and interactions.
 * Provides a reusable way to handle chat state and message sending.
 * 
 * @returns {Object} Chat state and methods
 * @example
 * ```tsx
 * const { state, message, setMessage, sendMessage, resetChat } = useChat()
 * ```
 */
export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    chatMessages: [],
    isLoading: false,
    error: null,
    hasStarted: false
  })
  const [message, setMessage] = useState('')

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) return

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const userMessage: ChatMessage = {
        role: 'user',
        content,
      }

      setState(prev => ({ 
        ...prev, 
        hasStarted: true,
        messages: [...prev.messages, {
          id: crypto.randomUUID(),
          content,
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
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.chatMessages])

  const resetChat = useCallback((): void => {
    setState({
      messages: [],
      chatMessages: [],
      isLoading: false,
      error: null,
      hasStarted: false
    })
  }, [])

  return {
    state,
    message,
    setMessage,
    sendMessage,
    resetChat
  }
} 