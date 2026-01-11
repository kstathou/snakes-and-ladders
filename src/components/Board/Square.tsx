'use client'

import { motion } from 'framer-motion'
import { checkWorm, checkOrnithopter } from '@/lib/board'

interface SquareProps {
  number: number
  row: number
  col: number
}

// Sandworm SVG - inspired by Dune's Shai-Hulud
function SandwormIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-lg">
      {/* Worm body segments emerging from sand */}
      <ellipse cx="20" cy="32" rx="18" ry="6" fill="#C2956E" opacity="0.6" />
      <path
        d="M8 28 Q12 18, 20 14 Q28 18, 32 28"
        fill="none"
        stroke="#8B4513"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M10 26 Q14 18, 20 15 Q26 18, 30 26"
        fill="none"
        stroke="#A0522D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Mouth/teeth ring */}
      <circle cx="20" cy="12" r="8" fill="#4A2810" />
      <circle cx="20" cy="12" r="5" fill="#2D1810" />
      {/* Teeth */}
      <path d="M15 10 L17 14 L19 10" fill="#E8D4B8" />
      <path d="M21 10 L23 14 L25 10" fill="#E8D4B8" />
      <path d="M14 14 L16 12 L18 16" fill="#E8D4B8" />
      <path d="M22 16 L24 12 L26 14" fill="#E8D4B8" />
    </svg>
  )
}

// Ornithopter SVG - dragonfly-winged aircraft
function OrnithopterIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-lg">
      {/* Wings */}
      <motion.ellipse
        cx="10" cy="18"
        rx="9" ry="4"
        fill="#1E3A5F"
        opacity="0.7"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 0.3 }}
        style={{ transformOrigin: '20px 20px' }}
      />
      <motion.ellipse
        cx="30" cy="18"
        rx="9" ry="4"
        fill="#1E3A5F"
        opacity="0.7"
        animate={{ rotate: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 0.3 }}
        style={{ transformOrigin: '20px 20px' }}
      />
      {/* Body */}
      <ellipse cx="20" cy="22" rx="6" ry="10" fill="#3D5A80" />
      <ellipse cx="20" cy="16" rx="4" ry="5" fill="#4A6D8C" />
      {/* Cockpit */}
      <ellipse cx="20" cy="14" rx="2.5" ry="3" fill="#87CEEB" opacity="0.8" />
      {/* Tail */}
      <path d="M17 30 L20 38 L23 30" fill="#2D4A6D" />
    </svg>
  )
}

export function Square({ number, row, col }: SquareProps) {
  const wormTarget = checkWorm(number)
  const ornithopterTarget = checkOrnithopter(number)
  const hasWorm = wormTarget !== null
  const hasOrnithopter = ornithopterTarget !== null

  // Alternate background for visual interest
  const isEvenSquare = (row + col) % 2 === 0

  return (
    <div
      className={`
        relative w-14 h-14 border border-sand/30 flex items-center justify-center
        text-xs font-semibold overflow-hidden
        ${isEvenSquare ? 'bg-sand/20' : 'bg-sand/10'}
        ${hasWorm ? 'bg-gradient-to-b from-harkonnen/30 to-harkonnen/10' : ''}
        ${hasOrnithopter ? 'bg-gradient-to-t from-atreides/30 to-atreides/10' : ''}
      `}
    >
      {/* Square number */}
      <span className={`
        absolute top-0.5 left-1 text-[10px]
        ${hasWorm || hasOrnithopter ? 'text-white/70' : 'text-shadow/50'}
      `}>
        {number}
      </span>

      {/* Worm */}
      {hasWorm && (
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <SandwormIcon />
        </motion.div>
      )}

      {/* Ornithopter */}
      {hasOrnithopter && (
        <motion.div
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <OrnithopterIcon />
        </motion.div>
      )}
    </div>
  )
}
