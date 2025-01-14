'use client'

import { type FC, memo, useMemo } from 'react'
import type { Message, Branch, BranchId } from '../types'

interface BranchMinimapProps {
  messages: Message[]
  branches: Branch[]
  activeBranchId: BranchId
  onBranchSelect: (branchId: BranchId) => void
}

/**
 * Visual representation of conversation branches
 * Displays a minimap of the conversation structure
 */
const BranchMinimap: FC<BranchMinimapProps> = memo(function BranchMinimap({
  messages,
  branches,
  activeBranchId,
  onBranchSelect
}) {
  // Build branch tree structure
  const branchTree = useMemo(() => {
    const tree: Record<string, {
      branch: Branch
      messages: Message[]
      children: Branch[]
      level: number
    }> = {}
    
    // Initialize branches
    branches.forEach(branch => {
      tree[branch.id] = {
        branch,
        messages: messages.filter(m => m.branchId === branch.id),
        children: [],
        level: 0
      }
    })
    
    // Build relationships
    branches.forEach(branch => {
      if (branch.parentMessageId) {
        const parentMessage = messages.find(m => m.id === branch.parentMessageId)
        if (parentMessage) {
          const parentBranch = tree[parentMessage.branchId]
          if (parentBranch) {
            parentBranch.children.push(branch)
            tree[branch.id].level = parentBranch.level + 1
          }
        }
      }
    })
    
    return tree
  }, [messages, branches])

  return (
    <div className="fixed bottom-32 right-4 w-48 bg-white rounded-lg shadow-lg p-2 z-20">
      <div className="text-xs font-medium mb-2 text-gray-500">Conversation Branches</div>
      <div className="space-y-1">
        {Object.values(branchTree).map(({ branch, messages, level }) => (
          <button
            key={branch.id}
            onClick={() => onBranchSelect(branch.id)}
            className={`
              w-full text-left px-2 py-1 rounded text-xs
              ${branch.id === activeBranchId ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
              ${level > 0 ? 'ml-' + (level * 2) : ''}
            `}
          >
            <div className="font-medium">{branch.name}</div>
            <div className="text-gray-400">{messages.length} messages</div>
          </button>
        ))}
      </div>
    </div>
  )
})

export default BranchMinimap 