import { describe, it, expect } from 'vitest'
import { gameReducer, initialState } from '../useGameState'
import { GameState, Player } from '@/types/game'

// Helper to create a playing state with specific factions
function createPlayingState(
  faction1: Player['faction'],
  faction2: Player['faction'],
  overrides: Partial<GameState> = {}
): GameState {
  return {
    ...initialState,
    phase: 'playing',
    players: [
      { name: 'Player 1', faction: faction1, position: 0, abilityUsed: false },
      { name: 'Player 2', faction: faction2, position: 0, abilityUsed: false },
    ],
    currentPlayerIndex: 0,
    ...overrides,
  }
}

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
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 0, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 5 })

      expect(newState.diceValue).toBe(5)
      expect(newState.players[0].position).toBe(5)
    })

    it('grants bonus roll on 6', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 0, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 6 })

      expect(newState.bonusRollPending).toBe(true)
    })

    it('triggers win at 100', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 95, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 5 })

      expect(newState.phase).toBe('victory')
      expect(newState.winner).toBe(0)
    })
  })

  describe('MOVE_COMPLETE', () => {
    it('switches to next player when no bonus roll', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        currentPlayerIndex: 0,
        bonusRollPending: false,
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 5, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(newState.currentPlayerIndex).toBe(1)
    })

    it('keeps same player on bonus roll', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        currentPlayerIndex: 0,
        bonusRollPending: true,
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 6, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(newState.currentPlayerIndex).toBe(0)
      expect(newState.bonusRollPending).toBe(false)
    })
  })

  describe('RESET_GAME', () => {
    it('resets to initial state', () => {
      const state = createPlayingState('atreides', 'harkonnen', {
        phase: 'victory',
        winner: 0,
      })
      const newState = gameReducer(state, { type: 'RESET_GAME' })

      expect(newState.phase).toBe('lobby')
      expect(newState.winner).toBeNull()
    })
  })

  // SKILL TESTS

  describe('Atreides Prescience ability', () => {
    it('shows two dice options when Atreides rolls', () => {
      const state = createPlayingState('atreides', 'sardaukar')
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 4 })

      expect(newState.pendingAtreidesChoice).not.toBeNull()
      expect(newState.pendingAtreidesChoice?.dice1).toBe(4)
      expect(typeof newState.pendingAtreidesChoice?.dice2).toBe('number')
      expect(newState.isRolling).toBe(false)
      expect(newState.players[0].abilityUsed).toBe(true)
    })

    it('applies chosen dice value via ATREIDES_CHOICE', () => {
      const state = createPlayingState('atreides', 'sardaukar', {
        pendingAtreidesChoice: { dice1: 3, dice2: 5 },
        players: [
          { name: 'Player 1', faction: 'atreides', position: 10, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'ATREIDES_CHOICE', chosenValue: 5 })

      expect(newState.pendingAtreidesChoice).toBeNull()
      expect(newState.players[0].position).toBe(15) // 10 + 5
    })

    it('does not trigger Prescience if ability already used', () => {
      // Use position 30, rolling 3 = 33 (no worm/ornithopter)
      const state = createPlayingState('atreides', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'atreides', position: 30, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 3 })

      expect(newState.pendingAtreidesChoice).toBeNull()
      expect(newState.players[0].position).toBe(33)
    })
  })

  describe('Harkonnen Sabotage ability', () => {
    it('attacks opponent when within 6 squares', () => {
      const state = createPlayingState('harkonnen', 'sardaukar', {
        currentPlayerIndex: 0,
        players: [
          { name: 'Player 1', faction: 'harkonnen', position: 20, abilityUsed: false },
          { name: 'Player 2', faction: 'sardaukar', position: 23, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'HARKONNEN_ATTACK' })

      expect(newState.harkonnenAttackResult).toBeGreaterThanOrEqual(1)
      expect(newState.harkonnenAttackResult).toBeLessThanOrEqual(6)
      expect(newState.players[0].abilityUsed).toBe(true)
      // Opponent position should be reduced by attack roll
      expect(newState.players[1].position).toBeLessThan(23)
    })

    it('does not attack if not within 6 squares', () => {
      const state = createPlayingState('harkonnen', 'sardaukar', {
        currentPlayerIndex: 0,
        players: [
          { name: 'Player 1', faction: 'harkonnen', position: 10, abilityUsed: false },
          { name: 'Player 2', faction: 'sardaukar', position: 30, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'HARKONNEN_ATTACK' })

      expect(newState.harkonnenAttackResult).toBeNull()
      expect(newState.players[0].abilityUsed).toBe(false)
      expect(newState.players[1].position).toBe(30) // Unchanged
    })

    it('does not attack if ability already used', () => {
      const state = createPlayingState('harkonnen', 'sardaukar', {
        currentPlayerIndex: 0,
        players: [
          { name: 'Player 1', faction: 'harkonnen', position: 20, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 23, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'HARKONNEN_ATTACK' })

      expect(newState.harkonnenAttackResult).toBeNull()
    })

    it('does not push opponent below position 1', () => {
      const state = createPlayingState('harkonnen', 'sardaukar', {
        currentPlayerIndex: 0,
        players: [
          { name: 'Player 1', faction: 'harkonnen', position: 3, abilityUsed: false },
          { name: 'Player 2', faction: 'sardaukar', position: 2, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'HARKONNEN_ATTACK' })

      expect(newState.players[1].position).toBeGreaterThanOrEqual(1)
    })

    it('dismisses attack result with DISMISS_HARKONNEN_RESULT', () => {
      const state = createPlayingState('harkonnen', 'sardaukar', {
        harkonnenAttackResult: 4,
      })
      const newState = gameReducer(state, { type: 'DISMISS_HARKONNEN_RESULT' })

      expect(newState.harkonnenAttackResult).toBeNull()
    })
  })

  describe('Fremen Worm Rider ability', () => {
    it('stays at worm head when Fremen lands on worm for first time', () => {
      // Position 97 + 2 = 99, which is a worm head
      const state = createPlayingState('fremen', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'fremen', position: 97, abilityUsed: false },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 2 })

      // Fremen stays at 99 (worm head) instead of sliding to 54
      expect(newState.players[0].position).toBe(99)
      expect(newState.players[0].abilityUsed).toBe(true)
    })

    it('slides down worm if ability already used', () => {
      const state = createPlayingState('fremen', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'fremen', position: 97, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 2 })

      expect(newState.players[0].position).toBe(54) // Slid down to worm tail
    })

    it('non-Fremen always slides down worm', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 97, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 2 })

      expect(newState.players[0].position).toBe(54) // Slid down to worm tail
    })
  })

  describe('Sardaukar Forced March ability', () => {
    it('adds +2 to dice result on first roll', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 0, abilityUsed: false },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 3 })

      expect(newState.players[0].position).toBe(5) // 3 + 2 = 5
      expect(newState.players[0].abilityUsed).toBe(true)
      expect(newState.diceValue).toBe(5) // Shows modified value
    })

    it('does not add bonus after ability used', () => {
      // Use position 30, rolling 3 = 33 (no worm/ornithopter)
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 30, abilityUsed: true },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 3 })

      expect(newState.players[0].position).toBe(33) // Just 30 + 3, no bonus
    })

    it('grants bonus roll when modified result is 6', () => {
      const state = createPlayingState('sardaukar', 'sardaukar', {
        players: [
          { name: 'Player 1', faction: 'sardaukar', position: 0, abilityUsed: false },
          { name: 'Player 2', faction: 'sardaukar', position: 0, abilityUsed: true },
        ],
      })
      const newState = gameReducer(state, { type: 'SET_DICE_VALUE', value: 4 })

      expect(newState.players[0].position).toBe(6) // 4 + 2 = 6
      expect(newState.bonusRollPending).toBe(true)
    })
  })

  describe('skill interaction edge cases', () => {
    it('does not allow MOVE_COMPLETE during pending Atreides choice', () => {
      const state = createPlayingState('atreides', 'sardaukar', {
        pendingAtreidesChoice: { dice1: 3, dice2: 5 },
        currentPlayerIndex: 0,
      })
      const newState = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(newState.pendingAtreidesChoice).not.toBeNull() // Unchanged
    })

    it('does not allow MOVE_COMPLETE during pending Harkonnen result', () => {
      const state = createPlayingState('harkonnen', 'sardaukar', {
        harkonnenAttackResult: 4,
        currentPlayerIndex: 0,
      })
      const newState = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(newState.harkonnenAttackResult).toBe(4) // Unchanged
    })
  })
})
