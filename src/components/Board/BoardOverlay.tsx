'use client'

import { motion } from 'framer-motion'
import { getSquarePosition } from '@/lib/board'
import { WORMS, ORNITHOPTERS, BOARD } from '@/lib/constants'

const SQUARE_SIZE = 56
const BORDER_OFFSET = 4

// Get pixel coordinates for a square center
function getSquarePixelPosition(square: number) {
  const { row, col } = getSquarePosition(square)
  return {
    x: BORDER_OFFSET + col * SQUARE_SIZE + SQUARE_SIZE / 2,
    y: BORDER_OFFSET + row * SQUARE_SIZE + SQUARE_SIZE / 2,
  }
}

// Sandworm - massive mouth with teeth, inspired by Dune movie
function SandwormPath({ head, tail }: { head: number; tail: number }) {
  const start = getSquarePixelPosition(head)
  const end = getSquarePixelPosition(tail)

  // Create a curved path from head to tail
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const dx = end.x - start.x
  const dy = end.y - start.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Control point offset perpendicular to the line
  const perpX = -dy / distance * 30
  const perpY = dx / distance * 30

  const controlX = midX + perpX
  const controlY = midY + perpY

  return (
    <g>
      {/* Worm body - segmented curved path */}
      <motion.path
        d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
        fill="none"
        stroke="#8B4513"
        strokeWidth="14"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.path
        d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
        fill="none"
        stroke="#A0522D"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
      />
      {/* Segment lines */}
      <motion.path
        d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
        fill="none"
        stroke="#654321"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="4 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* Worm head - circular mouth with teeth */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        {/* Outer mouth ring */}
        <circle cx={start.x} cy={start.y} r="20" fill="#4A2810" />
        <circle cx={start.x} cy={start.y} r="16" fill="#3D2010" />
        <circle cx={start.x} cy={start.y} r="10" fill="#1A0A05" />

        {/* Teeth around the mouth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const innerR = 10
          const outerR = 18
          const x1 = start.x + Math.cos(rad) * innerR
          const y1 = start.y + Math.sin(rad) * innerR
          const x2 = start.x + Math.cos(rad) * outerR
          const y2 = start.y + Math.sin(rad) * outerR
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#E8D4B8"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
          )
        })}
      </motion.g>

      {/* Tail end - narrowing */}
      <motion.circle
        cx={end.x} cy={end.y} r="8"
        fill="#8B4513"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      />
    </g>
  )
}

// Ornithopter - sleek dragonfly aircraft
function OrnithopterPath({ pad, destination }: { pad: number; destination: number }) {
  const start = getSquarePixelPosition(pad)
  const end = getSquarePixelPosition(destination)

  // Create an arc path (flying up)
  const midX = (start.x + end.x) / 2
  const midY = Math.min(start.y, end.y) - 40 // Arc above

  return (
    <g>
      {/* Flight path - dashed line */}
      <motion.path
        d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="2"
        strokeDasharray="8 4"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Landing pad marker */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <circle cx={start.x} cy={start.y} r="6" fill="#1E3A5F" opacity="0.3" />
        <circle cx={start.x} cy={start.y} r="3" fill="#1E3A5F" />
      </motion.g>

      {/* Ornithopter at destination - sleek dragonfly design */}
      <motion.g
        initial={{ scale: 0, y: -30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', delay: 0.8 }}
      >
        {/* Body */}
        <ellipse cx={end.x} cy={end.y + 2} rx="4" ry="12" fill="#3D5A80" />
        <ellipse cx={end.x} cy={end.y - 4} rx="3" ry="5" fill="#4A6D8C" />

        {/* Wings - long swept back */}
        <motion.path
          d={`M ${end.x - 2} ${end.y - 2}
              L ${end.x - 22} ${end.y - 8}
              Q ${end.x - 25} ${end.y - 4} ${end.x - 20} ${end.y + 2}
              L ${end.x - 2} ${end.y + 2} Z`}
          fill="#1E3A5F"
          opacity="0.8"
          animate={{
            d: [
              `M ${end.x - 2} ${end.y - 2} L ${end.x - 22} ${end.y - 8} Q ${end.x - 25} ${end.y - 4} ${end.x - 20} ${end.y + 2} L ${end.x - 2} ${end.y + 2} Z`,
              `M ${end.x - 2} ${end.y - 2} L ${end.x - 22} ${end.y - 12} Q ${end.x - 25} ${end.y - 8} ${end.x - 20} ${end.y - 2} L ${end.x - 2} ${end.y + 2} Z`,
              `M ${end.x - 2} ${end.y - 2} L ${end.x - 22} ${end.y - 8} Q ${end.x - 25} ${end.y - 4} ${end.x - 20} ${end.y + 2} L ${end.x - 2} ${end.y + 2} Z`,
            ]
          }}
          transition={{ repeat: Infinity, duration: 0.4 }}
        />
        <motion.path
          d={`M ${end.x + 2} ${end.y - 2}
              L ${end.x + 22} ${end.y - 8}
              Q ${end.x + 25} ${end.y - 4} ${end.x + 20} ${end.y + 2}
              L ${end.x + 2} ${end.y + 2} Z`}
          fill="#1E3A5F"
          opacity="0.8"
          animate={{
            d: [
              `M ${end.x + 2} ${end.y - 2} L ${end.x + 22} ${end.y - 8} Q ${end.x + 25} ${end.y - 4} ${end.x + 20} ${end.y + 2} L ${end.x + 2} ${end.y + 2} Z`,
              `M ${end.x + 2} ${end.y - 2} L ${end.x + 22} ${end.y - 12} Q ${end.x + 25} ${end.y - 8} ${end.x + 20} ${end.y - 2} L ${end.x + 2} ${end.y + 2} Z`,
              `M ${end.x + 2} ${end.y - 2} L ${end.x + 22} ${end.y - 8} Q ${end.x + 25} ${end.y - 4} ${end.x + 20} ${end.y + 2} L ${end.x + 2} ${end.y + 2} Z`,
            ]
          }}
          transition={{ repeat: Infinity, duration: 0.4 }}
        />

        {/* Cockpit */}
        <ellipse cx={end.x} cy={end.y - 6} rx="2" ry="2.5" fill="#87CEEB" opacity="0.9" />

        {/* Tail */}
        <path d={`M ${end.x - 1} ${end.y + 10} L ${end.x} ${end.y + 16} L ${end.x + 1} ${end.y + 10}`} fill="#2D4A6D" />
      </motion.g>
    </g>
  )
}

export function BoardOverlay() {
  const boardSize = BOARD.size * SQUARE_SIZE + BORDER_OFFSET * 2

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={boardSize}
      height={boardSize}
      style={{ zIndex: 10 }}
    >
      {/* Render all worm paths */}
      {WORMS.map((worm, i) => (
        <SandwormPath key={`worm-${i}`} head={worm.head} tail={worm.tail} />
      ))}

      {/* Render all ornithopter paths */}
      {ORNITHOPTERS.map((orn, i) => (
        <OrnithopterPath key={`orn-${i}`} pad={orn.pad} destination={orn.destination} />
      ))}
    </svg>
  )
}
