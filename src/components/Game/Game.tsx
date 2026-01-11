'use client'

import { useGameState } from '@/hooks/useGameState'
import { useAudio } from '@/hooks/useAudio'
import { Lobby } from '@/components/Lobby'
import { Board } from '@/components/Board'
import { Victory } from '@/components/Victory'
import { SoundToggle } from '@/components/SoundToggle'

export function Game() {
  const { state, dispatch } = useGameState()
  const audio = useAudio()

  return (
    <main className="min-h-screen bg-sky flex items-center justify-center p-8">
      <SoundToggle onToggle={audio.toggleMute} />
      {state.phase === 'lobby' && <Lobby state={state} dispatch={dispatch} />}
      {state.phase === 'playing' && <Board state={state} dispatch={dispatch} />}
      {state.phase === 'victory' && <Victory state={state} dispatch={dispatch} />}
    </main>
  )
}
