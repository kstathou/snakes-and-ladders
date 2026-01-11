'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getSquarePosition } from '@/lib/board'
import { BOARD } from '@/lib/constants'
import { Square } from './Square'
import { Dice } from '@/components/Dice'
import { HUD } from '@/components/HUD'
import { PlayerPiece } from '@/components/PlayerPiece'

interface BoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Board({ state, dispatch }: BoardProps) {
  // Generate board squares
  const squares = []
  for (let row = 0; row < BOARD.size; row++) {
    for (let col = 0; col < BOARD.size; col++) {
      // Find which square number corresponds to this position
      let squareNum = 0
      for (let s = 1; s <= BOARD.totalSquares; s++) {
        const pos = getSquarePosition(s)
        if (pos.row === row && pos.col === col) {
          squareNum = s
          break
        }
      }
      squares.push(
        <Square key={`${row}-${col}`} number={squareNum} row={row} col={col} />
      )
    }
  }

  return (
    <div className="flex gap-8 items-start">
      {/* HUD - Left side */}
      <HUD state={state} dispatch={dispatch} playerIndex={0} />

      {/* Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Grid */}
        <div
          className="grid bg-sand/30 border-4 border-sand rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${BOARD.size}, 1fr)`,
          }}
        >
          {squares}
        </div>

        {/* Player Pieces */}
        <PlayerPiece
          player={state.players[0]}
          playerIndex={0}
          isCurrentPlayer={state.currentPlayerIndex === 0}
        />
        <PlayerPiece
          player={state.players[1]}
          playerIndex={1}
          isCurrentPlayer={state.currentPlayerIndex === 1}
        />
      </motion.div>

      {/* HUD - Right side */}
      <HUD state={state} dispatch={dispatch} playerIndex={1} />

      {/* Dice */}
      <Dice state={state} dispatch={dispatch} />
    </div>
  )
}
