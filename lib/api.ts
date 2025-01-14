import { ChatMessage, ChatResponse } from '../types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/chat'

/**
 * Lightweight wrapper for chat API calls
 * Will be replaced with more sophisticated agent-based system later
 */
export const chatApi = {
  /**
   * Send a message to the chat API
   * @param messages - Array of chat messages
   * @returns Promise with the API response
   */
  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Chat API error:', error)
      return {
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
} 