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
  pendingAtreidesChoice: null,
  pendingHarkonnenSabotage: false,
  lastOpponentRoll: null,
}

// Helper to apply dice value and move player
function applyDiceMove(
  state: GameState,
  value: number,
  skipWormCheck = false
): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex]

  // Apply Sardaukar +2 bonus
  let finalValue = value
  if (
    currentPlayer.faction === 'sardaukar' &&
    !currentPlayer.abilityUsed
  ) {
    finalValue = value + 2
    const players = [...state.players] as [Player, Player]
    players[state.currentPlayerIndex] = {
      ...currentPlayer,
      abilityUsed: true,
    }
    state = { ...state, players }
  }

  const newPosition = currentPlayer.position + finalValue
  const { finalPosition, wormTriggered } = calculateFinalPosition(newPosition)

  // Check for Fremen worm choice
  if (
    wormTriggered &&
    !skipWormCheck &&
    currentPlayer.faction === 'fremen' &&
    !currentPlayer.abilityUsed
  ) {
    const players = [...state.players] as [Player, Player]
    players[state.currentPlayerIndex] = {
      ...players[state.currentPlayerIndex],
      position: newPosition, // Store pre-worm position temporarily
    }
    return {
      ...state,
      players,
      diceValue: finalValue,
      isRolling: false,
      pendingWormChoice: true,
    }
  }

  const players = [...state.players] as [Player, Player]
  players[state.currentPlayerIndex] = {
    ...players[state.currentPlayerIndex],
    position: finalPosition,
  }

  // Check for win
  if (finalPosition >= BOARD.totalSquares) {
    return {
      ...state,
      players,
      diceValue: finalValue,
      isRolling: false,
      phase: 'victory',
      winner: state.currentPlayerIndex,
    }
  }

  // Check if opponent is Harkonnen and can sabotage
  const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0
  const opponent = state.players[opponentIndex]
  if (
    opponent.faction === 'harkonnen' &&
    !opponent.abilityUsed
  ) {
    return {
      ...state,
      players,
      diceValue: finalValue,
      isRolling: false,
      bonusRollPending: false,
      lastOpponentRoll: finalValue,
      pendingHarkonnenSabotage: true,
    }
  }

  return {
    ...state,
    players,
    diceValue: finalValue,
    isRolling: false,
    bonusRollPending: finalValue === 6,
    lastOpponentRoll: null,
  }
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

      // Check if Atreides ability is active
      if (
        currentPlayer.faction === 'atreides' &&
        !currentPlayer.abilityUsed
      ) {
        // Roll two dice for Atreides to choose from
        const dice1 = action.value
        const dice2 = Math.floor(Math.random() * 6) + 1

        const players = [...state.players] as [Player, Player]
        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          abilityUsed: true,
        }

        return {
          ...state,
          players,
          isRolling: false,
          pendingAtreidesChoice: { dice1, dice2 },
        }
      }

      return applyDiceMove(state, action.value)
    }

    case 'ATREIDES_CHOICE': {
      if (!state.pendingAtreidesChoice) return state

      return applyDiceMove(
        { ...state, pendingAtreidesChoice: null },
        action.chosenValue
      )
    }

    case 'HARKONNEN_SABOTAGE': {
      // Harkonnen forces opponent to reroll
      const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0
      const players = [...state.players] as [Player, Player]
      players[opponentIndex] = {
        ...players[opponentIndex],
        abilityUsed: true,
      }

      // Revert the opponent's position back
      const currentPlayer = state.players[state.currentPlayerIndex]
      const revertedPosition = state.lastOpponentRoll
        ? currentPlayer.position - state.lastOpponentRoll
        : currentPlayer.position

      players[state.currentPlayerIndex] = {
        ...players[state.currentPlayerIndex],
        position: Math.max(0, revertedPosition),
      }

      // Roll new dice for the sabotaged player
      const newRoll = Math.floor(Math.random() * 6) + 1

      // Apply the new roll
      return applyDiceMove(
        {
          ...state,
          players,
          pendingHarkonnenSabotage: false,
          lastOpponentRoll: null,
        },
        newRoll
      )
    }

    case 'HARKONNEN_DECLINE': {
      // Harkonnen chose not to sabotage, continue normal turn flow
      const diceVal = state.diceValue ?? 0
      return {
        ...state,
        pendingHarkonnenSabotage: false,
        lastOpponentRoll: null,
        bonusRollPending: diceVal === 6,
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
      // This action is now only used for manual ability activation
      // Most abilities are auto-triggered at the right time
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        abilityUsed: true,
      }
      return { ...state, players }
    }

    case 'MOVE_COMPLETE': {
      // Don't complete move if there's a pending choice
      if (state.pendingWormChoice || state.pendingAtreidesChoice || state.pendingHarkonnenSabotage) {
        return state
      }

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
