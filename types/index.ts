import { ChatMessage } from './api'
import { Icons } from '../components/ui/icons'

export type MessageType = 'user' | 'system'

/**
 * Unique identifier for a conversation branch
 */
export type BranchId = string

/**
 * Represents a single message in the conversation
 */
export interface Message {
  id: string
  content: string
  timestamp: Date
  type: MessageType
  edited?: boolean
  branchId: BranchId
  parentId?: string // ID of the message this branches from
  order: number // Position in the conversation
}

/**
 * Represents a branch in the conversation
 */
export interface Branch {
  id: BranchId
  parentMessageId?: string // Message this branch starts from
  name: string // Auto-generated name for the branch
  createdAt: Date
  active: boolean // Whether this is the currently active branch
  chatContext: ChatMessage[] // Chat context specific to this branch
}

/**
 * Represents the entire conversation state
 */
export interface ChatState {
  messages: Message[]
  branches: Branch[]
  activeBranchId: BranchId
  isLoading: boolean
  error: Error | null
  hasStarted: boolean
}

export type ConnectionType = 'database' | 'csv'

/**
 * Message action handlers
 */
export interface MessageActions {
  onRegenerate?: (messageId: string) => Promise<void>
  onEdit?: (messageId: string, newContent: string) => Promise<void>
  onBranch?: (messageId: string) => Promise<void>
}

export interface ConnectionOption {
  type: ConnectionType
  label: string
  icon: keyof typeof Icons
} 