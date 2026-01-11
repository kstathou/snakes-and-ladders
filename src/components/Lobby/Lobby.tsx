'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { FactionSelect } from './FactionSelect'

interface LobbyProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Lobby({ state, dispatch }: LobbyProps) {
  const canStart = state.players[0].faction && state.players[1].faction

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold text-center text-shadow mb-2"
      >
        DUNE
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl text-center text-spice mb-12"
      >
        The Spice Trail
      </motion.h2>

      {/* Player Setup */}
      <div className="grid grid-cols-2 gap-12">
        {/* Player 1 */}
        <div>
          <h3 className="text-xl font-semibold text-shadow mb-4">Player 1</h3>
          <input
            type="text"
            placeholder="Enter name..."
            value={state.players[0].name === 'Player 1' ? '' : state.players[0].name}
            onChange={(e) =>
              dispatch({
                type: 'SET_PLAYER_NAME',
                playerIndex: 0,
                name: e.target.value,
              })
            }
            className="w-full p-3 mb-4 bg-sand/20 border border-sand rounded-lg
                       text-shadow placeholder:text-shadow/50 focus:outline-none
                       focus:border-spice"
          />
          <FactionSelect
            selectedFaction={state.players[0].faction}
            disabledFaction={state.players[1].faction}
            onSelect={(faction) =>
              dispatch({ type: 'SET_PLAYER_FACTION', playerIndex: 0, faction })
            }
          />
        </div>

        {/* Player 2 */}
        <div>
          <h3 className="text-xl font-semibold text-shadow mb-4">Player 2</h3>
          <input
            type="text"
            placeholder="Enter name..."
            value={state.players[1].name === 'Player 2' ? '' : state.players[1].name}
            onChange={(e) =>
              dispatch({
                type: 'SET_PLAYER_NAME',
                playerIndex: 1,
                name: e.target.value,
              })
            }
            className="w-full p-3 mb-4 bg-sand/20 border border-sand rounded-lg
                       text-shadow placeholder:text-shadow/50 focus:outline-none
                       focus:border-spice"
          />
          <FactionSelect
            selectedFaction={state.players[1].faction}
            disabledFaction={state.players[0].faction}
            onSelect={(faction) =>
              dispatch({ type: 'SET_PLAYER_FACTION', playerIndex: 1, faction })
            }
          />
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={() => dispatch({ type: 'START_GAME' })}
        disabled={!canStart}
        whileHover={canStart ? { scale: 1.05 } : undefined}
        whileTap={canStart ? { scale: 0.95 } : undefined}
        className={`
          mt-12 mx-auto block px-12 py-4 text-2xl font-bold rounded-lg
          transition-all
          ${canStart
            ? 'bg-spice text-white cursor-pointer hover:bg-spice/90'
            : 'bg-sand/30 text-shadow/50 cursor-not-allowed'}
        `}
      >
        Begin Journey
      </motion.button>
    </motion.div>
  )
}
