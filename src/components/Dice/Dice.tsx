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

// D6 Pip positions for each face value
const PIP_LAYOUTS: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 25, y: 25 }, { x: 75, y: 75 }],
  3: [{ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 }],
  4: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
  5: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 50, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
  6: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
}

// D6 Die Face component with pips
function D6Face({ value, size = 64, onClick, disabled, highlight }: {
  value: number | null
  size?: number
  onClick?: () => void
  disabled?: boolean
  highlight?: boolean
}) {
  const pips = value ? PIP_LAYOUTS[value] || [] : []
  const pipSize = size * 0.15

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && onClick ? { scale: 1.1 } : undefined}
      whileTap={!disabled && onClick ? { scale: 0.95 } : undefined}
      className={`
        relative rounded-xl shadow-lg
        flex items-center justify-center
        transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : ''}
        ${highlight ? 'ring-4 ring-gold ring-opacity-75' : ''}
      `}
      style={{
        width: size,
        height: size,
        background: value === 6
          ? 'linear-gradient(135deg, #B8924A 0%, #8B6914 50%, #B8924A 100%)'
          : 'linear-gradient(135deg, #E07A2C 0%, #C45A1C 50%, #E07A2C 100%)',
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: `
          inset 2px 2px 4px rgba(255,255,255,0.3),
          inset -2px -2px 4px rgba(0,0,0,0.2),
          4px 4px 8px rgba(0,0,0,0.3)
        `,
      }}
    >
      {/* Dice pips */}
      {pips.map((pip, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: pipSize,
            height: pipSize,
            left: `${pip.x}%`,
            top: `${pip.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e0e0e0 100%)',
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)',
          }}
        />
      ))}

      {/* Question mark when rolling */}
      {value === null && (
        <span className="text-white text-3xl font-bold" style={{ fontSize: size * 0.4 }}>?</span>
      )}
    </motion.button>
  )
}

// Roll button when no value
function RollButton({ size = 96, onClick, disabled }: {
  size?: number
  onClick: () => void
  disabled: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.1 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={`
        relative rounded-xl shadow-lg
        flex items-center justify-center
        transition-all
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        width: size,
        height: size,
        background: disabled
          ? 'linear-gradient(135deg, #C2956E 0%, #A67B5B 50%, #C2956E 100%)'
          : 'linear-gradient(135deg, #E07A2C 0%, #C45A1C 50%, #E07A2C 100%)',
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: `
          inset 2px 2px 4px rgba(255,255,255,0.3),
          inset -2px -2px 4px rgba(0,0,0,0.2),
          4px 4px 8px rgba(0,0,0,0.3)
        `,
      }}
    >
      {/* D6 icon with dots pattern */}
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
        {/* 6 pips pattern */}
        <circle cx="7" cy="7" r="2" fill="white" />
        <circle cx="17" cy="7" r="2" fill="white" />
        <circle cx="7" cy="12" r="2" fill="white" />
        <circle cx="17" cy="12" r="2" fill="white" />
        <circle cx="7" cy="17" r="2" fill="white" />
        <circle cx="17" cy="17" r="2" fill="white" />
      </svg>
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
    if (state.pendingAtreidesChoice || state.harkonnenAttackResult) return

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

  const hasPendingChoice = state.pendingAtreidesChoice || state.harkonnenAttackResult
  const canRoll = state.phase === 'playing' && !state.isRolling && !hasPendingChoice

  // Handler for Atreides dice choice
  const handleAtreidesChoice = (chosenValue: number) => {
    dispatch({ type: 'ATREIDES_CHOICE', chosenValue })
    // Schedule MOVE_COMPLETE after the choice is applied
    setTimeout(() => {
      dispatch({ type: 'MOVE_COMPLETE' })
    }, TIMING.moveComplete)
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
          className="bg-black/80 backdrop-blur-sm border-2 border-atreides rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: factionData.color }}>
              Prescience
            </div>
            <p className="text-sm text-sand/80 mt-2 mb-4">
              Choose which die to play:
            </p>
            <div className="flex gap-4 justify-center">
              <D6Face
                value={dice1}
                onClick={() => handleAtreidesChoice(dice1)}
              />
              <D6Face
                value={dice2}
                onClick={() => handleAtreidesChoice(dice2)}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Harkonnen Attack Result UI
  if (state.harkonnenAttackResult) {
    const factionData = getFactionData('harkonnen')
    const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0
    const opponent = state.players[opponentIndex]

    return (
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm border-2 border-harkonnen rounded-xl p-6 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: factionData.color }}>
              Sabotage!
            </div>
            <div className="flex justify-center mt-3 mb-2">
              <D6Face value={state.harkonnenAttackResult} size={56} />
            </div>
            <p className="text-sm text-sand/70 mt-2">
              {opponent.name} pushed back to position {opponent.position}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'DISMISS_HARKONNEN_RESULT' })}
              className="mt-4 px-6 py-2 bg-harkonnen text-white font-semibold rounded-lg"
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Normal Dice UI
  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
      {/* Dice */}
      {state.diceValue || state.isRolling ? (
        <motion.div
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
        >
          <D6Face
            value={state.isRolling ? null : state.diceValue}
            size={96}
          />
        </motion.div>
      ) : (
        <RollButton size={96} onClick={rollDice} disabled={!canRoll} />
      )}

      {/* Roll instruction */}
      {canRoll && !state.diceValue && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sand text-sm font-semibold drop-shadow-lg"
        >
          Click to roll
        </motion.div>
      )}
    </div>
  )
}
