'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SoundToggleProps {
  onToggle: () => boolean
}

export function SoundToggle({ onToggle }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true)

  const handleToggle = () => {
    const newMuted = onToggle()
    setIsMuted(newMuted)
  }

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 w-12 h-12 rounded-full bg-sand/30
                 border border-sand flex items-center justify-center
                 text-2xl hover:bg-sand/50 transition-colors z-50"
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  )
}
