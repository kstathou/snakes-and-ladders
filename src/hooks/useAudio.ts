'use client'

import { useCallback, useRef, useEffect } from 'react'
import { Howl } from 'howler'

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

export function useAudio() {
  const soundsRef = useRef<Map<SoundName, Howl>>(new Map())
  const mutedRef = useRef(true) // Muted by default

  // Initialize sounds
  useEffect(() => {
    const sounds = soundsRef.current
    Object.entries(SOUNDS).forEach(([name, src]) => {
      const howl = new Howl({
        src: [src],
        volume: 0.5,
        preload: true,
        onloaderror: () => {
          // Silently fail if sound file doesn't exist
          console.debug(`Sound not found: ${src}`)
        },
      })
      sounds.set(name as SoundName, howl)
    })

    return () => {
      sounds.forEach((howl) => howl.unload())
    }
  }, [])

  const play = useCallback((name: SoundName) => {
    if (mutedRef.current) return
    const sound = soundsRef.current.get(name)
    if (sound) {
      sound.play()
    }
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
