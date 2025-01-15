'use client'

import { type FC, memo, useMemo, useState, useRef, useCallback, MouseEvent } from 'react'
import type { Message, Branch, BranchId } from '../types'

interface BranchMinimapProps {
  messages: Message[]
  branches: Branch[]
  activeBranchId: BranchId
  onBranchSelect: (branchId: BranchId) => void
}

/**
 * A minimap for the branching conversation.
 * It's small by default, expands on hover, auto-scales & centers,
 * and supports panning/dragging with the mouse.
 */
const BranchMinimap: FC<BranchMinimapProps> = memo(function BranchMinimap({
  messages,
  branches,
  activeBranchId,
  onBranchSelect
}) {
  // ---------------------------------------------------------------------------
  // 1) Basic lookups: message->branch, parent->child
  // ---------------------------------------------------------------------------
  const messageToBranch = useMemo(() => {
    const lookup: Record<string, string> = {}
    messages.forEach((m) => {
      lookup[m.id] = m.branchId
    })
    return lookup
  }, [messages])

  const parentBranchLookup = useMemo(() => {
    const lookup: Record<string, string | null> = {}
    branches.forEach((branch) => {
      if (!branch.parentMessageId) {
        lookup[branch.id] = null
      } else {
        const parentBid = messageToBranch[branch.parentMessageId]
        lookup[branch.id] = parentBid ?? null
      }
    })
    return lookup
  }, [branches, messageToBranch])

  // ---------------------------------------------------------------------------
  // 2) "Display messages" per branch:
  //    If branch has parentMessageId, that message is index 0
  // ---------------------------------------------------------------------------
  const displayMessagesByBranch = useMemo(() => {
    const result: Record<string, Message[]> = {}

    function getDisplayMessages(branch: Branch): Message[] {
      const ownMsgs = messages
        .filter((m) => m.branchId === branch.id)
        .sort((a, b) => a.order - b.order)

      if (branch.parentMessageId) {
        const pm = messages.find((m) => m.id === branch.parentMessageId)
        if (pm && !ownMsgs.some((m) => m.id === pm.id)) {
          return [pm, ...ownMsgs]
        }
      }
      return ownMsgs
    }

    branches.forEach((b) => {
      result[b.id] = getDisplayMessages(b)
    })
    return result
  }, [branches, messages])

  // ---------------------------------------------------------------------------
  // 3) "baseY" so child branch lines up with parent's branching message
  // ---------------------------------------------------------------------------
  const branchBaseY = useMemo(() => {
    const baseYMap: Record<string, number> = {}

    // find root branches
    const rootBranches = branches.filter((b) => !parentBranchLookup[b.id])
    rootBranches.forEach((b) => {
      baseYMap[b.id] = 0
    })

    // BFS from roots
    const queue = [...rootBranches]
    while (queue.length > 0) {
      const parentB = queue.shift()!
      const children = branches.filter((b) => parentBranchLookup[b.id] === parentB.id)

      children.forEach((child) => {
        const pmid = child.parentMessageId
        if (!pmid) {
          baseYMap[child.id] = 0
        } else {
          const parentDisplay = displayMessagesByBranch[parentB.id]
          const parentBase = baseYMap[parentB.id] ?? 0
          const idx = parentDisplay.findIndex((m) => m.id === pmid)
          baseYMap[child.id] = parentBase + (idx >= 0 ? idx : 0)
        }
        queue.push(child)
      })
    }
    return baseYMap
  }, [branches, parentBranchLookup, displayMessagesByBranch])

  // ---------------------------------------------------------------------------
  // 4) Column index ("level")
  // ---------------------------------------------------------------------------
  const branchLevel = useMemo(() => {
    const levelMap: Record<string, number> = {}

    function computeLevel(bid: string): number {
      if (levelMap[bid] !== undefined) return levelMap[bid]
      const parentId = parentBranchLookup[bid]
      if (!parentId) {
        levelMap[bid] = 0
      } else {
        levelMap[bid] = computeLevel(parentId) + 1
      }
      return levelMap[bid]
    }

    branches.forEach((b) => computeLevel(b.id))
    return levelMap
  }, [branches, parentBranchLookup])

  // ---------------------------------------------------------------------------
  // 5) positionsByBranch[b.id][msg.id] = {x,y}
  // ---------------------------------------------------------------------------
  const positionsByBranch = useMemo(() => {
    const result: Record<string, Record<string, { x: number; y: number }>> = {}
    branches.forEach((b) => {
      const dmsgs = displayMessagesByBranch[b.id]
      const baseYVal = branchBaseY[b.id] ?? 0
      const levelVal = branchLevel[b.id] ?? 0

      result[b.id] = {}
      dmsgs.forEach((m, i) => {
        result[b.id][m.id] = {
          x: levelVal,
          y: baseYVal + i
        }
      })
    })
    return result
  }, [branches, displayMessagesByBranch, branchBaseY, branchLevel])

  // ---------------------------------------------------------------------------
  // 6) Connections (L-shaped lines)
  // ---------------------------------------------------------------------------
  const connections = useMemo(() => {
    const lines: Array<{
      key: string
      start: { x: number; y: number }
      end: { x: number; y: number }
    }> = []
    branches.forEach((child) => {
      const pmid = child.parentMessageId
      const parentId = parentBranchLookup[child.id]
      if (!pmid || !parentId) return

      const start = positionsByBranch[parentId]?.[pmid]
      const end = positionsByBranch[child.id]?.[pmid]
      if (start && end) {
        lines.push({
          key: `conn-${child.id}-${pmid}`,
          start,
          end
        })
      }
    })
    return lines
  }, [branches, positionsByBranch, parentBranchLookup])

  // ---------------------------------------------------------------------------
  // 7) Auto-scale + center the bounding box in a smaller default container
  // ---------------------------------------------------------------------------
  const NODE_SIZE = 16
  const NODE_SPACING = 24
  const BRANCH_SPACING = 48

  // We'll track user panning with state
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)

  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number } | null>(null)

  // gather all positions
  const { scale, offsetX, offsetY } = useMemo(() => {
    const allPos: Array<{ x: number; y: number }> = []
    Object.values(positionsByBranch).forEach((branchMap) => {
      Object.values(branchMap).forEach((p) => {
        allPos.push(p)
      })
    })

    if (allPos.length === 0) {
      return { scale: 1, offsetX: 0, offsetY: 0 }
    }

    // bounding box in grid coords
    const minX = Math.min(...allPos.map((p) => p.x))
    const maxX = Math.max(...allPos.map((p) => p.x))
    const minY = Math.min(...allPos.map((p) => p.y))
    const maxY = Math.max(...allPos.map((p) => p.y))

    const gridWidth = maxX - minX + 1
    const gridHeight = maxY - minY + 1

    const pxWidth = gridWidth * BRANCH_SPACING + NODE_SIZE
    const pxHeight = gridHeight * NODE_SPACING + NODE_SIZE

    // default small container (before hover)
    const containerSize = 160 // a bit smaller than the container
    const scaleW = containerSize / pxWidth
    const scaleH = containerSize / pxHeight
    const autoScale = Math.min(scaleW, scaleH, 1)

    // center the bounding box
    const halfC = containerSize / 2
    const halfW = (pxWidth * autoScale) / 2
    const halfH = (pxHeight * autoScale) / 2

    const offsetX = halfC - halfW - minX * BRANCH_SPACING * autoScale
    const offsetY = halfC - halfH - minY * NODE_SPACING * autoScale

    return { scale: autoScale, offsetX, offsetY }
  }, [positionsByBranch])

  // ---------------------------------------------------------------------------
  // 8) Panning with mouse
  // ---------------------------------------------------------------------------
  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !lastMouse) return
      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y
      setPanX((p) => p + dx)
      setPanY((p) => p + dy)
      setLastMouse({ x: e.clientX, y: e.clientY })
    },
    [isDragging, lastMouse]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setLastMouse(null)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    setLastMouse(null)
  }, [])

  // ---------------------------------------------------------------------------
  // 9) Render
  //    - The container is small by default but expands on hover.
  //    - We apply a group container with Tailwind so children can transition.
  // ---------------------------------------------------------------------------
  return (
    <div
      className="
        fixed bottom-4 right-4 
        group 
        z-50
        transition-all
      "
      // We'll handle the panning in the parent container
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer box: smaller by default, grows on hover */}
      <div
        className="
          relative 
          w-40 h-40
          group-hover:w-64 group-hover:h-64 
          transition-all duration-300
          overflow-hidden
          bg-white 
          border border-gray-200 
          rounded-lg 
          shadow-lg
        "
      >
        {/* The content that we transform (scale & pan). 
            We use absolute to fill the container. */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${offsetX + panX}px, ${offsetY + panY}px) scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* CONNECTION LINES */}
          {connections.map(({ key, start, end }) => {
            const startX = start.x * BRANCH_SPACING + NODE_SIZE / 2
            const startY = start.y * NODE_SPACING + NODE_SIZE / 2
            const endX = end.x * BRANCH_SPACING + NODE_SIZE / 2
            const endY = end.y * NODE_SPACING + NODE_SIZE / 2

            const left = Math.min(startX, endX)
            const top = Math.min(startY, endY)
            const width = Math.abs(endX - startX)
            const height = Math.abs(endY - startY)

            return (
              <div key={key} className="absolute pointer-events-none">
                {/* horizontal */}
                <div
                  className="absolute bg-gray-400"
                  style={{
                    left,
                    top: startY,
                    width,
                    height: 1,
                  }}
                />
                {/* vertical */}
                <div
                  className="absolute bg-gray-400"
                  style={{
                    left: endX,
                    top,
                    width: 1,
                    height,
                  }}
                />
              </div>
            )
          })}

          {/* NODES */}
          {branches.map((b) => {
            const dmsgs = displayMessagesByBranch[b.id]
            return dmsgs.map((msg) => {
              const pos = positionsByBranch[b.id][msg.id]
              if (!pos) return null

              const isActive = b.id === activeBranchId
              const left = pos.x * BRANCH_SPACING
              const top = pos.y * NODE_SPACING

              return (
                <div
                  key={`${b.id}-${msg.id}`}
                  className={`
                    absolute 
                    rounded-md
                    transition-colors 
                    ${msg.type === 'user' ? 'bg-blue-500' : 'bg-gray-500'}
                    ${isActive ? 'opacity-100' : 'opacity-60'}
                    cursor-pointer
                  `}
                  style={{
                    left,
                    top,
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                  }}
                  onClick={() => onBranchSelect(b.id)}
                  title={msg.content}
                />
              )
            })
          })}
        </div>
      </div>
    </div>
  )
})

export default BranchMinimap
