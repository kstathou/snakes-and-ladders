'use client'

import { useGameState } from '@/hooks/useGameState'
import { Lobby } from '@/components/Lobby'
import { Board } from '@/components/Board'
import { Victory } from '@/components/Victory'

export function Game() {
  const { state, dispatch } = useGameState()

  return (
    <main className="min-h-screen bg-sky flex items-center justify-center p-8">
      {state.phase === 'lobby' && <Lobby state={state} dispatch={dispatch} />}
      {state.phase === 'playing' && <Board state={state} dispatch={dispatch} />}
      {state.phase === 'victory' && <Victory state={state} dispatch={dispatch} />}
    </main>
  )
}
