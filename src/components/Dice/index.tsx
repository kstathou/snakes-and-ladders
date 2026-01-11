import { GameState, GameAction } from '@/types/game'

interface DiceProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Dice({ state, dispatch }: DiceProps) {
  const rollDice = () => {
    const value = Math.floor(Math.random() * 6) + 1
    dispatch({ type: 'SET_DICE_VALUE', value })
  }

  return (
    <button
      onClick={rollDice}
      className="fixed bottom-8 right-8 w-20 h-20 bg-spice rounded-lg
                 text-white text-3xl font-bold hover:bg-spice/80"
    >
      {state.diceValue ?? '?'}
    </button>
  )
}
