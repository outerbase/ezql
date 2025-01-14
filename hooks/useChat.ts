'use client'

import { useState, useCallback } from 'react'
import type { ChatState, Message, Branch, BranchId } from '../types'
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
    branches: [{
      id: 'main',
      name: 'Main Conversation',
      createdAt: new Date(),
      active: true,
      chatContext: []
    }],
    activeBranchId: 'main',
    isLoading: false,
    error: null,
    hasStarted: false
  })
  const [message, setMessage] = useState('')

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) return

    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const activeBranch = state.branches.find(b => b.id === state.activeBranchId)
      if (!activeBranch) throw new Error('No active branch found')

      // Create the new message
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content,
        timestamp: new Date(),
        type: 'user',
        branchId: state.activeBranchId,
        order: state.messages.length
      }

      // Create chat message for context
      const userMessage: ChatMessage = {
        role: 'user',
        content,
      }

      // Update state with new user message
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

      // Get the updated context and send the message
      const updatedBranch = state.branches.find(b => b.id === state.activeBranchId)
      if (!updatedBranch) throw new Error('Branch not found')

      const response = await chatApi.sendMessage([...updatedBranch.chatContext, userMessage])

      if (response.error) {
        throw new Error(response.error)
      }

      // Create the AI response message
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: response.message,
        timestamp: new Date(),
        type: 'system',
        branchId: state.activeBranchId,
        order: state.messages.length + 1
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message
      }

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
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.branches, state.activeBranchId, state.messages.length])

  const resetChat = useCallback((): void => {
    setState({
      messages: [],
      branches: [{
        id: 'main',
        name: 'Main Conversation',
        createdAt: new Date(),
        active: true,
        chatContext: []
      }],
      activeBranchId: 'main',
      isLoading: false,
      error: null,
      hasStarted: false
    })
    setMessage('')
  }, [])

  return {
    state,
    message,
    setMessage,
    sendMessage,
    resetChat
  }
} 