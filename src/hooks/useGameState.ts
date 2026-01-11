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
  atreidesAbilityActive: false,
  pendingAtreidesChoice: null,
  harkonnenAttackResult: null,
}

// Helper to check if player is within N squares of opponent
function isWithinSquares(player1Pos: number, player2Pos: number, distance: number): boolean {
  return Math.abs(player1Pos - player2Pos) <= distance && player1Pos > 0 && player2Pos > 0
}

// Helper to apply dice value and move player
function applyDiceMove(state: GameState, value: number): GameState {
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

  // Check for Fremen worm immunity
  let actualFinalPosition = finalPosition
  if (
    wormTriggered &&
    currentPlayer.faction === 'fremen' &&
    !currentPlayer.abilityUsed
  ) {
    // Fremen stays at worm head instead of sliding down
    actualFinalPosition = newPosition
    const players = [...state.players] as [Player, Player]
    players[state.currentPlayerIndex] = {
      ...players[state.currentPlayerIndex],
      position: actualFinalPosition,
      abilityUsed: true,
    }

    // Check for win
    if (actualFinalPosition >= BOARD.totalSquares) {
      return {
        ...state,
        players,
        diceValue: finalValue,
        isRolling: false,
        phase: 'victory',
        winner: state.currentPlayerIndex,
      }
    }

    return {
      ...state,
      players,
      diceValue: finalValue,
      isRolling: false,
      bonusRollPending: finalValue === 6,
    }
  }

  const players = [...state.players] as [Player, Player]
  players[state.currentPlayerIndex] = {
    ...players[state.currentPlayerIndex],
    position: actualFinalPosition,
  }

  // Check for win
  if (actualFinalPosition >= BOARD.totalSquares) {
    return {
      ...state,
      players,
      diceValue: finalValue,
      isRolling: false,
      phase: 'victory',
      winner: state.currentPlayerIndex,
    }
  }

  return {
    ...state,
    players,
    diceValue: finalValue,
    isRolling: false,
    bonusRollPending: finalValue === 6,
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

      // Check if Atreides ability was manually activated
      if (state.atreidesAbilityActive) {
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
          atreidesAbilityActive: false,
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

    case 'HARKONNEN_ATTACK': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      if (currentPlayer.faction !== 'harkonnen' || currentPlayer.abilityUsed) {
        return state
      }

      const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0
      const opponent = state.players[opponentIndex]

      // Check if within 6 squares
      if (!isWithinSquares(currentPlayer.position, opponent.position, 6)) {
        return state
      }

      // Roll a die for the attack
      const attackRoll = Math.floor(Math.random() * 6) + 1

      // Push opponent back (but not below 1)
      const newOpponentPosition = Math.max(1, opponent.position - attackRoll)

      const players = [...state.players] as [Player, Player]
      players[state.currentPlayerIndex] = {
        ...currentPlayer,
        abilityUsed: true,
      }
      players[opponentIndex] = {
        ...opponent,
        position: newOpponentPosition,
      }

      return {
        ...state,
        players,
        harkonnenAttackResult: attackRoll,
      }
    }

    case 'DISMISS_HARKONNEN_RESULT': {
      return {
        ...state,
        harkonnenAttackResult: null,
      }
    }

    case 'USE_ABILITY': {
      // Used by Harkonnen and Atreides to trigger their abilities
      const player = state.players[action.playerIndex]
      if (player.faction === 'harkonnen' && !player.abilityUsed) {
        return gameReducer(state, { type: 'HARKONNEN_ATTACK' })
      }
      if (player.faction === 'atreides' && !player.abilityUsed) {
        return gameReducer(state, { type: 'ACTIVATE_ATREIDES_ABILITY' })
      }
      return state
    }

    case 'ACTIVATE_ATREIDES_ABILITY': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      if (
        currentPlayer.faction !== 'atreides' ||
        currentPlayer.abilityUsed ||
        state.currentPlayerIndex !== state.players.findIndex(p => p.faction === 'atreides')
      ) {
        return state
      }
      // Activate prescience - next roll will show two dice
      return { ...state, atreidesAbilityActive: true }
    }

    case 'MOVE_COMPLETE': {
      // Don't complete move if there's a pending choice
      if (state.pendingAtreidesChoice || state.harkonnenAttackResult) {
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
