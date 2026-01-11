'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'
import { TIMING } from '@/lib/constants'

interface VictoryProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Victory({ state, dispatch }: VictoryProps) {
  const winner = state.winner !== null ? state.players[state.winner] : null
  const factionData = winner?.faction ? getFactionData(winner.faction) : null

  if (!winner || !factionData) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-shadow/80 z-50"
    >
      <div className="text-center">
        {/* Faction crest placeholder */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-40 h-40 mx-auto mb-8 rounded-full flex items-center justify-center
                     text-6xl border-4"
          style={{
            backgroundColor: factionData.color,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          {winner.faction === 'atreides' && '🦅'}
          {winner.faction === 'harkonnen' && '🦁'}
          {winner.faction === 'fremen' && '🏜️'}
          {winner.faction === 'sardaukar' && '⚔️'}
        </motion.div>

        {/* Winner name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {winner.name}
        </motion.div>

        {/* Faction name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mb-8"
          style={{ color: factionData.color }}
        >
          {factionData.name} Victorious
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-sand italic mb-12 max-w-md mx-auto"
        >
          "He who controls the spice, controls the universe."
        </motion.div>

        {/* Play again button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TIMING.victoryDelay / 1000 }}
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-spice text-white text-xl font-bold rounded-lg
                     hover:bg-spice/80 transition-colors"
        >
          Play Again
        </motion.button>
      </div>
    </motion.div>
  )
}
