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
  moveComplete: 500,
} as const

// Board configuration
export const BOARD = {
  size: 10,
  totalSquares: 100,
} as const

// Sandworm placements (head -> tail, max 2 rows / 20 squares drop)
export const WORMS = [
  { head: 99, tail: 79 },
  { head: 95, tail: 75 },
  { head: 87, tail: 68 },
  { head: 76, tail: 57 },
  { head: 64, tail: 44 },
  { head: 52, tail: 33 },
  { head: 47, tail: 28 },
  { head: 36, tail: 18 },
  { head: 24, tail: 5 },
] as const

// Ornithopter placements (pad -> destination, max 2 rows / 20 squares boost)
export const ORNITHOPTERS = [
  { pad: 3, destination: 22 },
  { pad: 8, destination: 26 },
  { pad: 17, destination: 35 },
  { pad: 29, destination: 48 },
  { pad: 41, destination: 59 },
  { pad: 53, destination: 72 },
  { pad: 69, destination: 88 },
] as const
