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
    <main
      className="min-h-screen flex items-center justify-center p-8 relative"
      style={{
        backgroundImage: 'url(/arrakis-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for better contrast with panels */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <SoundToggle onToggle={audio.toggleMute} />
        {state.phase === 'lobby' && <Lobby state={state} dispatch={dispatch} />}
        {state.phase === 'playing' && <Board state={state} dispatch={dispatch} />}
        {state.phase === 'victory' && <Victory state={state} dispatch={dispatch} />}
      </div>
    </main>
  )
}
