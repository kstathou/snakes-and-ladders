'use client'

import { useCallback, useRef } from 'react'

// Sound configuration - paths are placeholders
// Replace with actual sound files when available
const SOUNDS = {
  diceRoll: '/sounds/dice-roll.mp3',
  diceLand: '/sounds/dice-land.mp3',
  spiceBonus: '/sounds/spice-bonus.mp3',
  pieceMove: '/sounds/piece-move.mp3',
  wormRumble: '/sounds/worm-rumble.mp3',
  ornithopterWhir: '/sounds/ornithopter-whir.mp3',
  abilityActivate: '/sounds/ability-activate.mp3',
  victory: '/sounds/victory.mp3',
} as const

type SoundName = keyof typeof SOUNDS

// Set to true once actual sound files are added to /public/sounds/
const SOUNDS_ENABLED = false

export function useAudio() {
  const mutedRef = useRef(true) // Muted by default

  // No-op play function when sounds are disabled
  const play = useCallback((_name: SoundName) => {
    if (!SOUNDS_ENABLED) return
    // Sound loading will be implemented when sound files are added
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted
  }, [])

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current
    return mutedRef.current
  }, [])

  return { play, setMuted, toggleMute, isMuted: () => mutedRef.current }
}
