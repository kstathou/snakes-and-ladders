'use client'

import { checkWorm, checkOrnithopter } from '@/lib/board'

interface SquareProps {
  number: number
  row: number
  col: number
}

export function Square({ number, row, col }: SquareProps) {
  const wormTarget = checkWorm(number)
  const ornithopterTarget = checkOrnithopter(number)
  const hasWorm = wormTarget !== null
  const hasOrnithopter = ornithopterTarget !== null

  // Check if this is a destination square
  const isWormDestination = wormTarget !== null
  const isOrnithopterDestination = ornithopterTarget !== null

  // Alternate background for visual interest
  const isEvenSquare = (row + col) % 2 === 0

  return (
    <div
      className={`
        relative w-14 h-14 border border-shadow/10 flex items-center justify-center
        text-xs font-semibold
        ${isEvenSquare ? 'bg-sand/30' : 'bg-sand/20'}
      `}
    >
      {/* Square number */}
      <span className="text-shadow/40 text-sm font-bold">
        {number}
      </span>
    </div>
  )
}
