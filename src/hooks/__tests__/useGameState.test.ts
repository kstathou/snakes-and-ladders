import { describe, it, expect } from 'vitest'
import { gameReducer, initialState } from '../useGameState'

describe('gameReducer', () => {
  describe('SET_PLAYER_NAME', () => {
    it('sets player 1 name', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_NAME',
        playerIndex: 0,
        name: 'Paul',
      })
      expect(state.players[0].name).toBe('Paul')
    })

    it('sets player 2 name', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_NAME',
        playerIndex: 1,
        name: 'Feyd',
      })
      expect(state.players[1].name).toBe('Feyd')
    })
  })

  describe('SET_PLAYER_FACTION', () => {
    it('sets player faction', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_FACTION',
        playerIndex: 0,
        faction: 'atreides',
      })
      expect(state.players[0].faction).toBe('atreides')
    })
  })

  describe('START_GAME', () => {
    it('transitions to playing phase when both players have factions', () => {
      let state = gameReducer(initialState, {
        type: 'SET_PLAYER_FACTION',
        playerIndex: 0,
        faction: 'atreides',
      })
      state = gameReducer(state, {
        type: 'SET_PLAYER_FACTION',
        playerIndex: 1,
        faction: 'harkonnen',
      })
      state = gameReducer(state, { type: 'START_GAME' })

      expect(state.phase).toBe('playing')
      expect(state.currentPlayerIndex).toBe(0)
    })

    it('does not start if factions not selected', () => {
      const state = gameReducer(initialState, { type: 'START_GAME' })
      expect(state.phase).toBe('lobby')
    })
  })

  describe('SET_DICE_VALUE', () => {
    it('sets dice value and moves player', () => {
      let state = { ...initialState, phase: 'playing' as const }
      state = gameReducer(state, { type: 'SET_DICE_VALUE', value: 5 })

      expect(state.diceValue).toBe(5)
      expect(state.players[0].position).toBe(5)
    })

    it('grants bonus roll on 6', () => {
      let state = { ...initialState, phase: 'playing' as const }
      state = gameReducer(state, { type: 'SET_DICE_VALUE', value: 6 })

      expect(state.bonusRollPending).toBe(true)
    })

    it('triggers win at 100', () => {
      let state = {
        ...initialState,
        phase: 'playing' as const,
        players: [
          { ...initialState.players[0], position: 95 },
          initialState.players[1],
        ] as [typeof initialState.players[0], typeof initialState.players[1]],
      }
      state = gameReducer(state, { type: 'SET_DICE_VALUE', value: 5 })

      expect(state.phase).toBe('victory')
      expect(state.winner).toBe(0)
    })
  })

  describe('MOVE_COMPLETE', () => {
    it('switches to next player when no bonus roll', () => {
      let state = {
        ...initialState,
        phase: 'playing' as const,
        currentPlayerIndex: 0 as const,
        bonusRollPending: false,
      }
      state = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(state.currentPlayerIndex).toBe(1)
    })

    it('keeps same player on bonus roll', () => {
      let state = {
        ...initialState,
        phase: 'playing' as const,
        currentPlayerIndex: 0 as const,
        bonusRollPending: true,
      }
      state = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(state.currentPlayerIndex).toBe(0)
      expect(state.bonusRollPending).toBe(false)
    })
  })

  describe('RESET_GAME', () => {
    it('resets to initial state', () => {
      let state = {
        ...initialState,
        phase: 'victory' as const,
        winner: 0,
      }
      state = gameReducer(state, { type: 'RESET_GAME' })

      expect(state.phase).toBe('lobby')
      expect(state.winner).toBeNull()
    })
  })
})
