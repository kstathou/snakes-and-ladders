'use client'

import { useReducer } from 'react'
import { GameState, GameAction, Player } from '@/types/game'
import { calculateFinalPosition } from '@/lib/board'
import { BOARD } from '@/lib/constants'

const createInitialPlayer = (defaultName: string): Player => ({
  name: defaultName,
  faction: null,
  position: 0,
  abilityUsed: false,
})

export const initialState: GameState = {
  phase: 'lobby',
  players: [createInitialPlayer('Player 1'), createInitialPlayer('Player 2')],
  currentPlayerIndex: 0,
  diceValue: null,
  bonusRollPending: false,
  isRolling: false,
  winner: null,
  pendingWormChoice: false,
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME': {
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        name: action.name || `Player ${action.playerIndex + 1}`,
      }
      return { ...state, players }
    }

    case 'SET_PLAYER_FACTION': {
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        faction: action.faction,
      }
      return { ...state, players }
    }

    case 'START_GAME': {
      if (!state.players[0].faction || !state.players[1].faction) {
        return state
      }
      return {
        ...state,
        phase: 'playing',
        currentPlayerIndex: 0,
      }
    }

    case 'ROLL_DICE': {
      return { ...state, isRolling: true }
    }

    case 'SET_DICE_VALUE': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      const newPosition = currentPlayer.position + action.value
      const { finalPosition, wormTriggered } = calculateFinalPosition(newPosition)

      // Check for Fremen worm choice
      if (
        wormTriggered &&
        currentPlayer.faction === 'fremen' &&
        !currentPlayer.abilityUsed
      ) {
        const players = [...state.players] as [Player, Player]
        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          position: newPosition, // Store pre-worm position temporarily
        }
        return {
          ...state,
          players,
          diceValue: action.value,
          isRolling: false,
          pendingWormChoice: true,
        }
      }

      const players = [...state.players] as [Player, Player]
      players[state.currentPlayerIndex] = {
        ...currentPlayer,
        position: finalPosition,
      }

      // Check for win
      if (finalPosition >= BOARD.totalSquares) {
        return {
          ...state,
          players,
          diceValue: action.value,
          isRolling: false,
          phase: 'victory',
          winner: state.currentPlayerIndex,
        }
      }

      return {
        ...state,
        players,
        diceValue: action.value,
        isRolling: false,
        bonusRollPending: action.value === 6,
      }
    }

    case 'FREMEN_CHOICE': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      const players = [...state.players] as [Player, Player]

      if (action.rideWorm) {
        // Ride worm forward: add distance instead of subtract
        const wormHead = currentPlayer.position
        const { finalPosition: wormTail } = calculateFinalPosition(wormHead)
        const distance = wormHead - wormTail
        const forwardPosition = Math.min(wormHead + distance, BOARD.totalSquares)

        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          position: forwardPosition,
          abilityUsed: true,
        }

        if (forwardPosition >= BOARD.totalSquares) {
          return {
            ...state,
            players,
            pendingWormChoice: false,
            phase: 'victory',
            winner: state.currentPlayerIndex,
          }
        }
      } else {
        // Take the fall
        const { finalPosition } = calculateFinalPosition(currentPlayer.position)
        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          position: finalPosition,
        }
      }

      return {
        ...state,
        players,
        pendingWormChoice: false,
        bonusRollPending: state.diceValue === 6,
      }
    }

    case 'USE_ABILITY': {
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        abilityUsed: true,
      }
      return { ...state, players }
    }

    case 'MOVE_COMPLETE': {
      if (state.bonusRollPending) {
        return {
          ...state,
          bonusRollPending: false,
          diceValue: null,
        }
      }
      return {
        ...state,
        currentPlayerIndex: state.currentPlayerIndex === 0 ? 1 : 0,
        diceValue: null,
      }
    }

    case 'RESET_GAME': {
      return initialState
    }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return { state, dispatch }
}
