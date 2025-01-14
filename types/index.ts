import { ChatMessage } from './api'
import { Icons } from '../components/ui/icons'

export type MessageType = 'user' | 'system'

export interface Message {
  id: string
  content: string
  timestamp: Date
  type: MessageType
  // Optional edited flag to track message edits
  edited?: boolean
}

export interface ChatState {
  messages: Message[]
  chatMessages: ChatMessage[]
  isLoading: boolean
  error: Error | null
  hasStarted: boolean
}

export type ConnectionType = 'database' | 'csv'

// Message action handlers
export interface MessageActions {
  onRegenerate?: (messageId: string) => Promise<void>
  onEdit?: (messageId: string, newContent: string) => Promise<void>
  // Placeholder for future branch implementation
  onBranch?: (messageId: string) => Promise<void>
}

export interface ConnectionOption {
  type: ConnectionType
  label: string
  icon: keyof typeof Icons
} 