'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { TIMING } from '@/lib/constants'
import { getFactionData } from '@/lib/factions'

interface DiceProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

// Dice face component for showing numbers
function DiceFace({ value, onClick, selected, disabled }: {
  value: number
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.1 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={`
        w-16 h-16 rounded-xl text-white text-3xl font-bold
        shadow-lg border-4 flex items-center justify-center
        transition-all
        ${selected ? 'border-gold ring-4 ring-gold/50' : 'border-white/20'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${value === 6 ? 'bg-gold' : 'bg-spice'}
      `}
    >
      {value}
    </motion.button>
  )
}

export function Dice({ state, dispatch }: DiceProps) {
  const rollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current)
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
    }
  }, [])

  const rollDice = () => {
    if (state.isRolling || state.phase !== 'playing') return
    if (state.pendingWormChoice || state.pendingAtreidesChoice || state.pendingHarkonnenSabotage) return

    dispatch({ type: 'ROLL_DICE' })

    rollTimeoutRef.current = setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1
      dispatch({ type: 'SET_DICE_VALUE', value })

      // After movement completes, handle turn transition
      moveTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'MOVE_COMPLETE' })
      }, TIMING.moveComplete)
    }, TIMING.diceRoll)
  }

  const hasPendingChoice = state.pendingWormChoice || state.pendingAtreidesChoice || state.pendingHarkonnenSabotage
  const canRoll = state.phase === 'playing' && !state.isRolling && !hasPendingChoice

  // Fremen Worm Choice UI
  if (state.pendingWormChoice) {
    const currentPlayer = state.players[state.currentPlayerIndex]
    const factionData = getFactionData('fremen')

    return (
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sand/90 border-2 border-fremen rounded-xl p-6 shadow-2xl max-w-xs"
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: factionData.color }}>
              Worm Rider
            </div>
            <p className="text-sm text-shadow/80 mt-2">
              You landed on a sandworm! Use your Fremen ability to ride it forward instead of falling back?
            </p>
            <div className="flex gap-3 mt-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'FREMEN_CHOICE', rideWorm: true })}
                className="px-4 py-2 bg-fremen text-white font-semibold rounded-lg"
              >
                Ride Forward
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'FREMEN_CHOICE', rideWorm: false })}
                className="px-4 py-2 bg-sand border border-shadow/30 text-shadow font-semibold rounded-lg"
              >
                Take the Fall
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Atreides Prescience Choice UI
  if (state.pendingAtreidesChoice) {
    const { dice1, dice2 } = state.pendingAtreidesChoice
    const factionData = getFactionData('atreides')

    return (
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sand/90 border-2 border-atreides rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: factionData.color }}>
              Prescience
            </div>
            <p className="text-sm text-shadow/80 mt-2 mb-4">
              Choose which die to play:
            </p>
            <div className="flex gap-4 justify-center">
              <DiceFace
                value={dice1}
                onClick={() => dispatch({ type: 'ATREIDES_CHOICE', chosenValue: dice1 })}
              />
              <DiceFace
                value={dice2}
                onClick={() => dispatch({ type: 'ATREIDES_CHOICE', chosenValue: dice2 })}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Harkonnen Sabotage Choice UI
  if (state.pendingHarkonnenSabotage) {
    const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0
    const opponent = state.players[opponentIndex]
    const factionData = getFactionData('harkonnen')

    return (
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sand/90 border-2 border-harkonnen rounded-xl p-6 shadow-2xl max-w-xs"
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: factionData.color }}>
              Sabotage
            </div>
            <p className="text-sm text-shadow/80 mt-2">
              {opponent.name} rolled a {state.lastOpponentRoll}. Force them to reroll?
            </p>
            <div className="flex gap-3 mt-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'HARKONNEN_SABOTAGE' })}
                className="px-4 py-2 bg-harkonnen text-white font-semibold rounded-lg"
              >
                Sabotage!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'HARKONNEN_DECLINE' })}
                className="px-4 py-2 bg-sand border border-shadow/30 text-shadow font-semibold rounded-lg"
              >
                Let it Stand
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Normal Dice UI
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
          state.isRolling
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
        {state.isRolling ? '?' : state.diceValue ?? 'Roll'}
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
