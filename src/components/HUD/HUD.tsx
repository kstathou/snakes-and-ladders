'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'

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
        w-52 p-4 rounded-xl border-2 transition-colors
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
      {isCurrentPlayer && state.phase === 'playing' && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-2 text-xs text-spice font-semibold uppercase"
        >
          Your Turn
        </motion.div>
      )}

      {/* Ability section */}
      {factionData && (
        <div className="mt-4 pt-3 border-t border-sand/30">
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-sm ${
                player.abilityUsed ? 'text-shadow/40 line-through' : ''
              }`}
              style={{ color: player.abilityUsed ? undefined : factionData.color }}
            >
              {factionData.abilityName}
            </span>
            {player.abilityUsed ? (
              <span className="text-xs text-shadow/40">Used</span>
            ) : (
              <span className="text-xs text-spice">Ready</span>
            )}
          </div>
          <p className="text-xs text-shadow/60 mt-1 leading-relaxed">
            {factionData.abilityDescription}
          </p>
        </div>
      )}
    </motion.div>
  )
}
