import { WORMS, ORNITHOPTERS, BOARD } from './constants'

/**
 * Convert square number (1-100) to grid position.
 * Row 0 is top, Row 9 is bottom.
 * Serpentine path: odd rows go left-to-right, even rows right-to-left.
 */
export function getSquarePosition(square: number): { row: number; col: number } {
  const zeroIndexed = square - 1
  const rowFromBottom = Math.floor(zeroIndexed / BOARD.size)
  const row = BOARD.size - 1 - rowFromBottom

  const posInRow = zeroIndexed % BOARD.size
  // Even rows from bottom go left-to-right, odd rows go right-to-left
  const col = rowFromBottom % 2 === 0 ? posInRow : BOARD.size - 1 - posInRow

  return { row, col }
}

/**
 * Check if square has a sandworm head. Returns tail position or null.
 */
export function checkWorm(square: number): number | null {
  const worm = WORMS.find((w) => w.head === square)
  return worm ? worm.tail : null
}

/**
 * Check if square has an ornithopter pad. Returns destination or null.
 */
export function checkOrnithopter(square: number): number | null {
  const ornithopter = ORNITHOPTERS.find((o) => o.pad === square)
  return ornithopter ? ornithopter.destination : null
}

/**
 * Calculate final position after landing, including worm/ornithopter effects.
 */
export function calculateFinalPosition(position: number): {
  finalPosition: number
  wormTriggered: boolean
  ornithopterTriggered: boolean
} {
  // Cap at 100 for win
  if (position >= BOARD.totalSquares) {
    return {
      finalPosition: BOARD.totalSquares,
      wormTriggered: false,
      ornithopterTriggered: false,
    }
  }

  const wormTail = checkWorm(position)
  if (wormTail !== null) {
    return {
      finalPosition: wormTail,
      wormTriggered: true,
      ornithopterTriggered: false,
    }
  }

  const ornithopterDestination = checkOrnithopter(position)
  if (ornithopterDestination !== null) {
    return {
      finalPosition: ornithopterDestination,
      wormTriggered: false,
      ornithopterTriggered: true,
    }
  }

  return {
    finalPosition: position,
    wormTriggered: false,
    ornithopterTriggered: false,
  }
}
