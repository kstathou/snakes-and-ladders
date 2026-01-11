'use client'

import { useGameState } from '@/hooks/useGameState'
import { useAudio } from '@/hooks/useAudio'
import { Lobby } from '@/components/Lobby'
import { Board } from '@/components/Board'
import { Victory } from '@/components/Victory'
import { SoundToggle } from '@/components/SoundToggle'

// Unsplash desert dune image - free to use, no attribution required
const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80'

export function Game() {
  const { state, dispatch } = useGameState()
  const audio = useAudio()

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8 relative"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-transparent to-amber-950/50 pointer-events-none" />

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
