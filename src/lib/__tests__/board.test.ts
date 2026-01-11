import { describe, it, expect } from 'vitest'
import {
  getSquarePosition,
  checkWorm,
  checkOrnithopter,
  calculateFinalPosition,
} from '../board'

describe('getSquarePosition', () => {
  it('returns correct row and column for square 1', () => {
    const pos = getSquarePosition(1)
    expect(pos).toEqual({ row: 9, col: 0 })
  })

  it('returns correct position for square 10 (end of first row)', () => {
    const pos = getSquarePosition(10)
    expect(pos).toEqual({ row: 9, col: 9 })
  })

  it('returns correct position for square 11 (second row, serpentine)', () => {
    const pos = getSquarePosition(11)
    expect(pos).toEqual({ row: 8, col: 9 })
  })

  it('returns correct position for square 20', () => {
    const pos = getSquarePosition(20)
    expect(pos).toEqual({ row: 8, col: 0 })
  })

  it('returns correct position for square 100', () => {
    const pos = getSquarePosition(100)
    expect(pos).toEqual({ row: 0, col: 0 })
  })
})

describe('checkWorm', () => {
  it('returns tail position when landing on worm head', () => {
    expect(checkWorm(99)).toBe(54)
    expect(checkWorm(43)).toBe(17)
  })

  it('returns null when not on worm head', () => {
    expect(checkWorm(50)).toBeNull()
    expect(checkWorm(1)).toBeNull()
  })
})

describe('checkOrnithopter', () => {
  it('returns destination when landing on ornithopter pad', () => {
    expect(checkOrnithopter(4)).toBe(25)
    expect(checkOrnithopter(71)).toBe(90)
  })

  it('returns null when not on pad', () => {
    expect(checkOrnithopter(5)).toBeNull()
    expect(checkOrnithopter(100)).toBeNull()
  })
})

describe('calculateFinalPosition', () => {
  it('returns position when no worm or ornithopter', () => {
    expect(calculateFinalPosition(50)).toEqual({
      finalPosition: 50,
      wormTriggered: false,
      ornithopterTriggered: false,
    })
  })

  it('returns worm tail when landing on worm', () => {
    expect(calculateFinalPosition(99)).toEqual({
      finalPosition: 54,
      wormTriggered: true,
      ornithopterTriggered: false,
    })
  })

  it('returns ornithopter destination when landing on pad', () => {
    expect(calculateFinalPosition(4)).toEqual({
      finalPosition: 25,
      wormTriggered: false,
      ornithopterTriggered: true,
    })
  })

  it('caps position at 100 for win', () => {
    expect(calculateFinalPosition(105)).toEqual({
      finalPosition: 100,
      wormTriggered: false,
      ornithopterTriggered: false,
    })
  })
})
