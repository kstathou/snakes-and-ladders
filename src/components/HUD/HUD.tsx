'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'
import { AbilityButton } from '@/components/AbilityButton'

interface HUDProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  playerIndex: 0 | 1
}

export function HUD({ state, dispatch, playerIndex }: HUDProps) {
  const player = state.players[playerIndex]
  const isCurrentPlayer = state.currentPlayerIndex === playerIndex
  const factionData = player.faction ? getFactionData(player.faction) : null

  return (
    <motion.div
      animate={{
        scale: isCurrentPlayer ? 1.02 : 1,
        opacity: isCurrentPlayer ? 1 : 0.7,
      }}
      className={`
        w-48 p-4 rounded-xl border-2 transition-colors
        ${isCurrentPlayer ? 'border-spice bg-sand/30' : 'border-sand/50 bg-sand/20'}
      `}
    >
      {/* Player name */}
      <div className="font-bold text-lg text-shadow">{player.name}</div>

      {/* Faction */}
      {factionData && (
        <div
          className="text-sm font-semibold mt-1"
          style={{ color: factionData.color }}
        >
          {factionData.name}
        </div>
      )}

      {/* Position */}
      <div className="mt-3 text-sm text-shadow/80">
        Position: <span className="font-bold text-spice">{player.position}</span>
      </div>

      {/* Current turn indicator */}
      {isCurrentPlayer && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-2 text-xs text-spice font-semibold uppercase"
        >
          Your Turn
        </motion.div>
      )}

      {/* Ability button */}
      <AbilityButton
        player={player}
        playerIndex={playerIndex}
        isCurrentPlayer={isCurrentPlayer}
        canUse={!state.isRolling}
        dispatch={dispatch}
      />
    </motion.div>
  )
}
