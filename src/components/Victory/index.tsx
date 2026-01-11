import { GameState, GameAction } from '@/types/game'

interface VictoryProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Victory({ state, dispatch }: VictoryProps) {
  return (
    <div className="text-shadow text-2xl">
      Victory - Coming Soon
    </div>
  )
}
