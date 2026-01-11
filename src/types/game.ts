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
  bonusRollPending: boolean
  isRolling: boolean
  winner: number | null
  pendingWormChoice: boolean // For Fremen ability prompt
}

export type GameAction =
  | { type: 'SET_PLAYER_NAME'; playerIndex: 0 | 1; name: string }
  | { type: 'SET_PLAYER_FACTION'; playerIndex: 0 | 1; faction: Faction }
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'SET_DICE_VALUE'; value: number }
  | { type: 'MOVE_COMPLETE' }
  | { type: 'USE_ABILITY'; playerIndex: 0 | 1 }
  | { type: 'FREMEN_CHOICE'; rideWorm: boolean }
  | { type: 'RESET_GAME' }
