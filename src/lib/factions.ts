import { Faction } from '@/types/game'
import { COLORS } from './constants'

export interface FactionData {
  name: string
  color: string
  abilityName: string
  abilityDescription: string
  abilityTiming: 'before_roll' | 'after_own_roll' | 'after_opponent_roll' | 'on_worm'
}

export const FACTIONS: Record<Faction, FactionData> = {
  atreides: {
    name: 'House Atreides',
    color: COLORS.atreides,
    abilityName: 'Prescience',
    abilityDescription: 'Roll two dice and choose which one to play',
    abilityTiming: 'before_roll',
  },
  harkonnen: {
    name: 'House Harkonnen',
    color: COLORS.harkonnen,
    abilityName: 'Sabotage',
    abilityDescription: 'When within 6 squares of opponent, roll a die to push them back',
    abilityTiming: 'before_roll',
  },
  fremen: {
    name: 'Fremen',
    color: COLORS.fremen,
    abilityName: 'Worm Rider',
    abilityDescription: 'First time landing on a sandworm, stay at the head instead of sliding down',
    abilityTiming: 'on_worm',
  },
  sardaukar: {
    name: 'Sardaukar',
    color: COLORS.sardaukar,
    abilityName: 'Forced March',
    abilityDescription: 'Add +2 to dice result',
    abilityTiming: 'after_own_roll',
  },
}

export function getFactionData(faction: Faction): FactionData {
  return FACTIONS[faction]
}
