import { GameState, GameAction } from '@/types/game'

interface LobbyProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Lobby({ state, dispatch }: LobbyProps) {
  return (
    <div className="text-shadow text-2xl">
      Lobby - Coming Soon
    </div>
  )
}
