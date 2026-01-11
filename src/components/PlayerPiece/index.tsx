'use client'

import { motion } from 'framer-motion'
import { Player } from '@/types/game'
import { getSquarePosition } from '@/lib/board'
import { getFactionData } from '@/lib/factions'

interface PlayerPieceProps {
  player: Player
  playerIndex: 0 | 1
}

export function PlayerPiece({ player, playerIndex }: PlayerPieceProps) {
  if (player.position === 0 || !player.faction) return null

  const { row, col } = getSquarePosition(player.position)
  const factionData = getFactionData(player.faction)

  // Offset slightly so pieces don't overlap completely
  const offset = playerIndex === 0 ? -8 : 8

  return (
    <motion.div
      initial={false}
      animate={{
        top: row * 56 + 28 + offset,
        left: col * 56 + 28 + offset,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2
                 border-2 border-white shadow-lg"
      style={{ backgroundColor: factionData.color }}
    />
  )
}
