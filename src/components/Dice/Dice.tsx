'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { TIMING } from '@/lib/constants'

interface DiceProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Dice({ state, dispatch }: DiceProps) {
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    if (isRolling || state.phase !== 'playing') return

    setIsRolling(true)
    dispatch({ type: 'ROLL_DICE' })

    // Simulate roll animation
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1
      dispatch({ type: 'SET_DICE_VALUE', value })
      setIsRolling(false)

      // After movement completes, handle turn transition
      setTimeout(() => {
        dispatch({ type: 'MOVE_COMPLETE' })
      }, 500)
    }, TIMING.diceRoll)
  }

  const canRoll = state.phase === 'playing' && !isRolling && !state.pendingWormChoice

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
      {/* Bonus roll indicator */}
      <AnimatePresence>
        {state.bonusRollPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-spice font-bold text-lg"
          >
            Bonus Roll!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dice */}
      <motion.button
        onClick={rollDice}
        disabled={!canRoll}
        animate={
          isRolling
            ? {
                rotate: [0, 360, 720, 1080],
                scale: [1, 1.1, 0.9, 1],
              }
            : {}
        }
        transition={{
          duration: TIMING.diceRoll / 1000,
          ease: 'easeOut',
        }}
        whileHover={canRoll ? { scale: 1.1 } : undefined}
        whileTap={canRoll ? { scale: 0.9 } : undefined}
        className={`
          w-24 h-24 rounded-xl text-white text-4xl font-bold
          shadow-lg border-4 border-white/20
          flex items-center justify-center
          ${canRoll ? 'bg-spice cursor-pointer' : 'bg-sand cursor-not-allowed'}
          ${state.diceValue === 6 ? 'ring-4 ring-gold ring-opacity-75' : ''}
        `}
      >
        {isRolling ? '?' : state.diceValue ?? 'Roll'}
      </motion.button>

      {/* Roll instruction */}
      {canRoll && !state.diceValue && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-shadow text-sm"
        >
          Click to roll
        </motion.div>
      )}
    </div>
  )
}
