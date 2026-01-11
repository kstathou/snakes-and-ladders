'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'

interface HUDProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  playerIndex: 0 | 1
}

// Check if Harkonnen can use their ability
function canHarkonnenAttack(state: GameState, playerIndex: 0 | 1): boolean {
  const player = state.players[playerIndex]
  if (player.faction !== 'harkonnen' || player.abilityUsed) return false
  if (state.currentPlayerIndex !== playerIndex) return false
  if (state.phase !== 'playing') return false

  const opponentIndex = playerIndex === 0 ? 1 : 0
  const opponent = state.players[opponentIndex]

  // Both players must be on the board and within 6 squares
  if (player.position === 0 || opponent.position === 0) return false
  return Math.abs(player.position - opponent.position) <= 6
}

export function HUD({ state, dispatch, playerIndex }: HUDProps) {
  const player = state.players[playerIndex]
  const isCurrentPlayer = state.currentPlayerIndex === playerIndex
  const factionData = player.faction ? getFactionData(player.faction) : null

  const harkonnenCanAttack = canHarkonnenAttack(state, playerIndex)

  const handleAbilityClick = () => {
    if (harkonnenCanAttack) {
      dispatch({ type: 'USE_ABILITY', playerIndex })
    }
  }

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

          {/* Harkonnen attack button */}
          {player.faction === 'harkonnen' && !player.abilityUsed && isCurrentPlayer && (
            <motion.button
              onClick={handleAbilityClick}
              disabled={!harkonnenCanAttack}
              animate={
                harkonnenCanAttack
                  ? {
                      boxShadow: [
                        '0 0 0 0 rgba(139, 0, 0, 0)',
                        '0 0 0 8px rgba(139, 0, 0, 0.3)',
                        '0 0 0 0 rgba(139, 0, 0, 0)',
                      ],
                    }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 2 }}
              className={`
                mt-3 w-full px-3 py-2 rounded-lg text-sm font-semibold
                transition-all
                ${harkonnenCanAttack
                  ? 'bg-harkonnen text-white cursor-pointer hover:bg-harkonnen/80'
                  : 'bg-sand/30 text-shadow/40 cursor-not-allowed'}
              `}
            >
              {harkonnenCanAttack ? 'Attack!' : 'Not in range'}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  )
}
