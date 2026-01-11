'use client'

import { motion } from 'framer-motion'
import { checkWorm, checkOrnithopter } from '@/lib/board'

interface SquareProps {
  number: number
  row: number
  col: number
}

export function Square({ number, row, col }: SquareProps) {
  const hasWorm = checkWorm(number) !== null
  const hasOrnithopter = checkOrnithopter(number) !== null

  // Alternate background for visual interest
  const isEvenSquare = (row + col) % 2 === 0

  return (
    <div
      className={`
        relative w-14 h-14 border border-sand/30 flex items-center justify-center
        text-xs font-semibold
        ${isEvenSquare ? 'bg-sand/20' : 'bg-sand/10'}
        ${hasWorm ? 'bg-harkonnen/20' : ''}
        ${hasOrnithopter ? 'bg-atreides/20' : ''}
      `}
    >
      <span className="text-shadow/60">{number}</span>

      {hasWorm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-2xl"
        >
          🐛
        </motion.div>
      )}

      {hasOrnithopter && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-2xl"
        >
          🚁
        </motion.div>
      )}
    </div>
  )
}
