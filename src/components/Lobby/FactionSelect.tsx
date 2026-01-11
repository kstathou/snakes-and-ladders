'use client'

import { motion } from 'framer-motion'
import { Faction } from '@/types/game'
import { FACTIONS, getFactionData } from '@/lib/factions'

interface FactionSelectProps {
  selectedFaction: Faction | null
  disabledFaction: Faction | null
  onSelect: (faction: Faction) => void
}

export function FactionSelect({
  selectedFaction,
  disabledFaction,
  onSelect,
}: FactionSelectProps) {
  const factions = Object.keys(FACTIONS) as Faction[]

  return (
    <div className="grid grid-cols-2 gap-4">
      {factions.map((faction) => {
        const data = getFactionData(faction)
        const isSelected = selectedFaction === faction
        const isDisabled = disabledFaction === faction

        return (
          <motion.button
            key={faction}
            onClick={() => !isDisabled && onSelect(faction)}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.05 } : undefined}
            whileTap={!isDisabled ? { scale: 0.95 } : undefined}
            className={`
              p-4 rounded-lg border-2 text-left transition-colors
              ${isSelected ? 'border-spice bg-black/50' : 'border-sand/50 bg-black/30'}
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-spice/70'}
            `}
            style={{
              borderColor: isSelected ? data.color : undefined,
            }}
          >
            <div
              className="font-bold text-lg"
              style={{ color: data.color }}
            >
              {data.name}
            </div>
            <div className="text-sm text-sand/90 mt-1">
              <span className="font-semibold">{data.abilityName}:</span>{' '}
              {data.abilityDescription}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
