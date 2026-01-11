import { GameState, GameAction } from '@/types/game'

interface HUDProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  playerIndex: 0 | 1
}

export function HUD({ state, dispatch, playerIndex }: HUDProps) {
  const player = state.players[playerIndex]
  const isCurrentPlayer = state.currentPlayerIndex === playerIndex

  return (
    <div className={`p-4 rounded-lg ${isCurrentPlayer ? 'bg-spice/20' : 'bg-sand/20'}`}>
      <div className="font-bold">{player.name}</div>
      <div className="text-sm">Position: {player.position}</div>
    </div>
  )
}
