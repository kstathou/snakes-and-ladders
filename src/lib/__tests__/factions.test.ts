import { describe, it, expect } from 'vitest'
import { FACTIONS, getFactionData } from '../factions'

describe('FACTIONS', () => {
  it('contains all four factions', () => {
    expect(Object.keys(FACTIONS)).toHaveLength(4)
    expect(FACTIONS.atreides).toBeDefined()
    expect(FACTIONS.harkonnen).toBeDefined()
    expect(FACTIONS.fremen).toBeDefined()
    expect(FACTIONS.sardaukar).toBeDefined()
  })

  it('each faction has required properties', () => {
    Object.values(FACTIONS).forEach((faction) => {
      expect(faction.name).toBeDefined()
      expect(faction.color).toBeDefined()
      expect(faction.abilityName).toBeDefined()
      expect(faction.abilityDescription).toBeDefined()
    })
  })
})

describe('getFactionData', () => {
  it('returns correct data for atreides', () => {
    const data = getFactionData('atreides')
    expect(data.name).toBe('House Atreides')
    expect(data.abilityName).toBe('Prescience')
  })

  it('returns correct data for harkonnen', () => {
    const data = getFactionData('harkonnen')
    expect(data.name).toBe('House Harkonnen')
    expect(data.abilityName).toBe('Sabotage')
  })
})
