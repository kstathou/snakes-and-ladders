'use client'

import { motion } from 'framer-motion'
import { Player, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'

interface AbilityButtonProps {
  player: Player
  playerIndex: 0 | 1
  isCurrentPlayer: boolean
  canUse: boolean
  dispatch: React.Dispatch<GameAction>
}

export function AbilityButton({
  player,
  playerIndex,
  isCurrentPlayer,
  canUse,
  dispatch,
}: AbilityButtonProps) {
  if (!player.faction) return null

  const factionData = getFactionData(player.faction)
  const isAvailable = !player.abilityUsed && isCurrentPlayer && canUse

  return (
    <motion.button
      onClick={() => {
        if (isAvailable) {
          dispatch({ type: 'USE_ABILITY', playerIndex })
        }
      }}
      disabled={!isAvailable}
      animate={
        isAvailable
          ? {
              boxShadow: [
                '0 0 0 0 rgba(224, 122, 44, 0)',
                '0 0 0 8px rgba(224, 122, 44, 0.3)',
                '0 0 0 0 rgba(224, 122, 44, 0)',
              ],
            }
          : {}
      }
      transition={{ repeat: Infinity, duration: 2 }}
      className={`
        mt-4 px-4 py-2 rounded-lg text-sm font-semibold
        transition-all
        ${player.abilityUsed
          ? 'bg-sand/20 text-shadow/40 line-through'
          : isAvailable
            ? 'bg-spice text-white cursor-pointer hover:bg-spice/80'
            : 'bg-sand/30 text-shadow/60 cursor-not-allowed'}
      `}
    >
      {factionData.abilityName}
    </motion.button>
  )
}
