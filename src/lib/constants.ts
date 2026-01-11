// Color palette - Desert Daytime
export const COLORS = {
  sand: '#C2956E',
  spice: '#E07A2C',
  sky: '#D4C4A8',
  shadow: '#3D2914',
  atreides: '#1E3A5F',
  harkonnen: '#8B0000',
  fremen: '#7C9885',
  sardaukar: '#5C5C5C',
  gold: '#B8924A',
} as const

// Timing constants (milliseconds)
export const TIMING = {
  diceRoll: 600,
  pieceHop: 200,
  wormEncounter: 1500,
  ornithopterFlight: 1800,
  victoryDelay: 2000,
} as const

// Board configuration
export const BOARD = {
  size: 10,
  totalSquares: 100,
} as const

// Sandworm placements (head -> tail)
export const WORMS = [
  { head: 99, tail: 54 },
  { head: 91, tail: 73 },
  { head: 76, tail: 36 },
  { head: 66, tail: 24 },
  { head: 52, tail: 29 },
  { head: 43, tail: 17 },
] as const

// Ornithopter placements (pad -> destination)
export const ORNITHOPTERS = [
  { pad: 4, destination: 25 },
  { pad: 13, destination: 46 },
  { pad: 27, destination: 64 },
  { pad: 40, destination: 59 },
  { pad: 56, destination: 84 },
  { pad: 61, destination: 81 },
  { pad: 71, destination: 90 },
] as const
