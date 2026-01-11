'use client'

import { motion } from 'framer-motion'
import { Player } from '@/types/game'
import { getSquarePosition } from '@/lib/board'
import { getFactionData } from '@/lib/factions'

interface PlayerPieceProps {
  player: Player
  playerIndex: 0 | 1
}

// Square size in pixels (w-14 = 56px)
const SQUARE_SIZE = 56
// Border offset (border-4 = 4px)
const BORDER_OFFSET = 4

// Faction icons/symbols
const FACTION_ICONS: Record<string, string> = {
  atreides: '🦅',
  harkonnen: '🦂',
  fremen: '👁️',
  sardaukar: '⚔️',
}

export function PlayerPiece({ player, playerIndex }: PlayerPieceProps) {
  if (player.position === 0 || !player.faction) return null

  const { row, col } = getSquarePosition(player.position)
  const factionData = getFactionData(player.faction)

  // Offset slightly so pieces don't overlap completely
  const offset = playerIndex === 0 ? -10 : 10

  // Calculate position accounting for border offset
  const top = BORDER_OFFSET + row * SQUARE_SIZE + SQUARE_SIZE / 2 + offset
  const left = BORDER_OFFSET + col * SQUARE_SIZE + SQUARE_SIZE / 2 + offset

  return (
    <motion.div
      initial={false}
      animate={{ top, left }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2
                 border-2 border-white/80 shadow-xl flex items-center justify-center
                 text-lg"
      style={{
        backgroundColor: factionData.color,
        boxShadow: `0 0 12px ${factionData.color}80`,
      }}
    >
      {FACTION_ICONS[player.faction]}
    </motion.div>
  )
}
