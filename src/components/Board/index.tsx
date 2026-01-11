import { GameState, GameAction } from '@/types/game'

interface BoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Board({ state, dispatch }: BoardProps) {
  return (
    <div className="text-shadow text-2xl">
      Board - Coming Soon
    </div>
  )
}
