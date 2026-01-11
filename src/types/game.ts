export type Faction = 'atreides' | 'harkonnen' | 'fremen' | 'sardaukar'

export type GamePhase = 'lobby' | 'playing' | 'victory'

export interface Player {
  name: string
  faction: Faction | null
  position: number
  abilityUsed: boolean
}

export interface GameState {
  phase: GamePhase
  players: [Player, Player]
  currentPlayerIndex: 0 | 1
  diceValue: number | null
  isRolling: boolean
  winner: number | null
  atreidesAbilityActive: boolean // When true, next roll shows two dice to choose from
  pendingAtreidesChoice: { dice1: number; dice2: number } | null // For Atreides ability
  harkonnenAttackResult: number | null // Shows the result of Harkonnen's attack roll
}

export type GameAction =
  | { type: 'SET_PLAYER_NAME'; playerIndex: 0 | 1; name: string }
  | { type: 'SET_PLAYER_FACTION'; playerIndex: 0 | 1; faction: Faction }
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'SET_DICE_VALUE'; value: number }
  | { type: 'MOVE_COMPLETE' }
  | { type: 'USE_ABILITY'; playerIndex: 0 | 1 }
  | { type: 'ACTIVATE_ATREIDES_ABILITY' }
  | { type: 'ATREIDES_CHOICE'; chosenValue: number }
  | { type: 'HARKONNEN_ATTACK' }
  | { type: 'DISMISS_HARKONNEN_RESULT' }
  | { type: 'RESET_GAME' }
