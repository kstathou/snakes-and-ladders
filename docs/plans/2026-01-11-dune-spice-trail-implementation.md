# Dune: The Spice Trail — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a browser-based Snakes and Ladders game with Dune theming, faction abilities, and cinematic animations.

**Architecture:** Single-page React app using Next.js App Router. All game state managed via useReducer. Animations orchestrated with Framer Motion. Sound effects via Howler.js. Desktop-first, deployed to Vercel.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion, Howler.js, Vitest + React Testing Library

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.js`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Step 1: Create Next.js app with TypeScript and Tailwind**

Run:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

Expected: Project scaffolded with Next.js 14+, TypeScript, Tailwind CSS

**Step 2: Install additional dependencies**

Run:

```bash
npm install framer-motion howler
npm install -D @types/howler vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Expected: Dependencies installed successfully

**Step 3: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

**Step 4: Add test script to package.json**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

**Step 5: Verify setup**

Run:

```bash
npm run dev
```

Expected: App runs on localhost:3000

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js project with TypeScript, Tailwind, Vitest"
```

---

### Task 2: Configure Design Tokens

**Files:**

- Create: `src/lib/constants.ts`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Create constants file**

Create `src/lib/constants.ts`:

```typescript
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
```

**Step 2: Extend Tailwind config**

Modify `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: '#C2956E',
        spice: '#E07A2C',
        sky: '#D4C4A8',
        shadow: '#3D2914',
        atreides: '#1E3A5F',
        harkonnen: '#8B0000',
        fremen: '#7C9885',
        sardaukar: '#5C5C5C',
        gold: '#B8924A',
      },
      fontFamily: {
        barlow: ['var(--font-barlow)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

**Step 3: Setup global styles and font**

Modify `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-sand: #C2956E;
  --color-spice: #E07A2C;
  --color-sky: #D4C4A8;
  --color-shadow: #3D2914;
}

body {
  background-color: var(--color-sky);
  color: var(--color-shadow);
  min-height: 100vh;
}
```

Modify `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Barlow_Condensed } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: 'Dune: The Spice Trail',
  description: 'A Snakes and Ladders game set on Arrakis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} font-barlow`}>{children}</body>
    </html>
  )
}
```

**Step 4: Verify font loads**

Run:

```bash
npm run dev
```

Expected: Page displays with Barlow Condensed font

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, colors, and typography"
```

---

## Phase 2: Game Logic (TDD)

### Task 3: Define TypeScript Types

**Files:**

- Create: `src/types/game.ts`

**Step 1: Create game types**

Create `src/types/game.ts`:

```typescript
export type Faction = 'atreides' | 'harkonnen' | 'fremen' | 'sardaukar'

export type GamePhase = 'lobby' | 'playing' | 'victory'

export interface Player {
  name: string
  faction: Faction | null
  position: number
  abilityUsed: boolean
}

export interface GameState {
  phase: GamePhase
  players: [Player, Player]
  currentPlayerIndex: 0 | 1
  diceValue: number | null
  bonusRollPending: boolean
  isRolling: boolean
  winner: number | null
  pendingWormChoice: boolean // For Fremen ability prompt
}

export type GameAction =
  | { type: 'SET_PLAYER_NAME'; playerIndex: 0 | 1; name: string }
  | { type: 'SET_PLAYER_FACTION'; playerIndex: 0 | 1; faction: Faction }
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'SET_DICE_VALUE'; value: number }
  | { type: 'MOVE_COMPLETE' }
  | { type: 'USE_ABILITY'; playerIndex: 0 | 1 }
  | { type: 'FREMEN_CHOICE'; rideWorm: boolean }
  | { type: 'RESET_GAME' }
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: define TypeScript types for game state"
```

---

### Task 4: Implement Board Logic

**Files:**

- Create: `src/lib/board.ts`
- Create: `src/lib/__tests__/board.test.ts`

**Step 1: Write failing tests for board utilities**

Create `src/lib/__tests__/board.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test:run src/lib/__tests__/board.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement board utilities**

Create `src/lib/board.ts`:

```typescript
import { WORMS, ORNITHOPTERS, BOARD } from './constants'

/**
 * Convert square number (1-100) to grid position.
 * Row 0 is top, Row 9 is bottom.
 * Serpentine path: odd rows go left-to-right, even rows right-to-left.
 */
export function getSquarePosition(square: number): { row: number; col: number } {
  const zeroIndexed = square - 1
  const rowFromBottom = Math.floor(zeroIndexed / BOARD.size)
  const row = BOARD.size - 1 - rowFromBottom

  const posInRow = zeroIndexed % BOARD.size
  // Even rows from bottom go left-to-right, odd rows go right-to-left
  const col = rowFromBottom % 2 === 0 ? posInRow : BOARD.size - 1 - posInRow

  return { row, col }
}

/**
 * Check if square has a sandworm head. Returns tail position or null.
 */
export function checkWorm(square: number): number | null {
  const worm = WORMS.find((w) => w.head === square)
  return worm ? worm.tail : null
}

/**
 * Check if square has an ornithopter pad. Returns destination or null.
 */
export function checkOrnithopter(square: number): number | null {
  const ornithopter = ORNITHOPTERS.find((o) => o.pad === square)
  return ornithopter ? ornithopter.destination : null
}

/**
 * Calculate final position after landing, including worm/ornithopter effects.
 */
export function calculateFinalPosition(position: number): {
  finalPosition: number
  wormTriggered: boolean
  ornithopterTriggered: boolean
} {
  // Cap at 100 for win
  if (position >= BOARD.totalSquares) {
    return {
      finalPosition: BOARD.totalSquares,
      wormTriggered: false,
      ornithopterTriggered: false,
    }
  }

  const wormTail = checkWorm(position)
  if (wormTail !== null) {
    return {
      finalPosition: wormTail,
      wormTriggered: true,
      ornithopterTriggered: false,
    }
  }

  const ornithopterDestination = checkOrnithopter(position)
  if (ornithopterDestination !== null) {
    return {
      finalPosition: ornithopterDestination,
      wormTriggered: false,
      ornithopterTriggered: true,
    }
  }

  return {
    finalPosition: position,
    wormTriggered: false,
    ornithopterTriggered: false,
  }
}
```

**Step 4: Run tests to verify they pass**

Run:

```bash
npm run test:run src/lib/__tests__/board.test.ts
```

Expected: All tests PASS

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement board utilities with worm/ornithopter logic"
```

---

### Task 5: Implement Faction Definitions

**Files:**

- Create: `src/lib/factions.ts`
- Create: `src/lib/__tests__/factions.test.ts`

**Step 1: Write failing tests**

Create `src/lib/__tests__/factions.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test:run src/lib/__tests__/factions.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement factions**

Create `src/lib/factions.ts`:

```typescript
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
    abilityDescription: 'See dice result before rolling; choose to keep or reroll once',
    abilityTiming: 'before_roll',
  },
  harkonnen: {
    name: 'House Harkonnen',
    color: COLORS.harkonnen,
    abilityName: 'Sabotage',
    abilityDescription: 'Force opponent to reroll their dice (must keep new result)',
    abilityTiming: 'after_opponent_roll',
  },
  fremen: {
    name: 'Fremen',
    color: COLORS.fremen,
    abilityName: 'Worm Rider',
    abilityDescription: 'When landing on sandworm, ride it forward instead of backward',
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
```

**Step 4: Run tests to verify they pass**

Run:

```bash
npm run test:run src/lib/__tests__/factions.test.ts
```

Expected: All tests PASS

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement faction definitions with abilities"
```

---

### Task 6: Implement Game Reducer

**Files:**

- Create: `src/hooks/useGameState.ts`
- Create: `src/hooks/__tests__/useGameState.test.ts`

**Step 1: Write failing tests for game reducer**

Create `src/hooks/__tests__/useGameState.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { gameReducer, initialState } from '../useGameState'

describe('gameReducer', () => {
  describe('SET_PLAYER_NAME', () => {
    it('sets player 1 name', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_NAME',
        playerIndex: 0,
        name: 'Paul',
      })
      expect(state.players[0].name).toBe('Paul')
    })

    it('sets player 2 name', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_NAME',
        playerIndex: 1,
        name: 'Feyd',
      })
      expect(state.players[1].name).toBe('Feyd')
    })
  })

  describe('SET_PLAYER_FACTION', () => {
    it('sets player faction', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_FACTION',
        playerIndex: 0,
        faction: 'atreides',
      })
      expect(state.players[0].faction).toBe('atreides')
    })
  })

  describe('START_GAME', () => {
    it('transitions to playing phase when both players have factions', () => {
      let state = gameReducer(initialState, {
        type: 'SET_PLAYER_FACTION',
        playerIndex: 0,
        faction: 'atreides',
      })
      state = gameReducer(state, {
        type: 'SET_PLAYER_FACTION',
        playerIndex: 1,
        faction: 'harkonnen',
      })
      state = gameReducer(state, { type: 'START_GAME' })

      expect(state.phase).toBe('playing')
      expect(state.currentPlayerIndex).toBe(0)
    })

    it('does not start if factions not selected', () => {
      const state = gameReducer(initialState, { type: 'START_GAME' })
      expect(state.phase).toBe('lobby')
    })
  })

  describe('SET_DICE_VALUE', () => {
    it('sets dice value and moves player', () => {
      let state = { ...initialState, phase: 'playing' as const }
      state = gameReducer(state, { type: 'SET_DICE_VALUE', value: 5 })

      expect(state.diceValue).toBe(5)
      expect(state.players[0].position).toBe(5)
    })

    it('grants bonus roll on 6', () => {
      let state = { ...initialState, phase: 'playing' as const }
      state = gameReducer(state, { type: 'SET_DICE_VALUE', value: 6 })

      expect(state.bonusRollPending).toBe(true)
    })

    it('triggers win at 100', () => {
      let state = {
        ...initialState,
        phase: 'playing' as const,
        players: [
          { ...initialState.players[0], position: 95 },
          initialState.players[1],
        ] as [typeof initialState.players[0], typeof initialState.players[1]],
      }
      state = gameReducer(state, { type: 'SET_DICE_VALUE', value: 5 })

      expect(state.phase).toBe('victory')
      expect(state.winner).toBe(0)
    })
  })

  describe('MOVE_COMPLETE', () => {
    it('switches to next player when no bonus roll', () => {
      let state = {
        ...initialState,
        phase: 'playing' as const,
        currentPlayerIndex: 0 as const,
        bonusRollPending: false,
      }
      state = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(state.currentPlayerIndex).toBe(1)
    })

    it('keeps same player on bonus roll', () => {
      let state = {
        ...initialState,
        phase: 'playing' as const,
        currentPlayerIndex: 0 as const,
        bonusRollPending: true,
      }
      state = gameReducer(state, { type: 'MOVE_COMPLETE' })

      expect(state.currentPlayerIndex).toBe(0)
      expect(state.bonusRollPending).toBe(false)
    })
  })

  describe('RESET_GAME', () => {
    it('resets to initial state', () => {
      let state = {
        ...initialState,
        phase: 'victory' as const,
        winner: 0,
      }
      state = gameReducer(state, { type: 'RESET_GAME' })

      expect(state.phase).toBe('lobby')
      expect(state.winner).toBeNull()
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test:run src/hooks/__tests__/useGameState.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement game reducer**

Create `src/hooks/useGameState.ts`:

```typescript
'use client'

import { useReducer } from 'react'
import { GameState, GameAction, Player } from '@/types/game'
import { calculateFinalPosition } from '@/lib/board'
import { BOARD } from '@/lib/constants'

const createInitialPlayer = (defaultName: string): Player => ({
  name: defaultName,
  faction: null,
  position: 0,
  abilityUsed: false,
})

export const initialState: GameState = {
  phase: 'lobby',
  players: [createInitialPlayer('Player 1'), createInitialPlayer('Player 2')],
  currentPlayerIndex: 0,
  diceValue: null,
  bonusRollPending: false,
  isRolling: false,
  winner: null,
  pendingWormChoice: false,
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME': {
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        name: action.name || `Player ${action.playerIndex + 1}`,
      }
      return { ...state, players }
    }

    case 'SET_PLAYER_FACTION': {
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        faction: action.faction,
      }
      return { ...state, players }
    }

    case 'START_GAME': {
      if (!state.players[0].faction || !state.players[1].faction) {
        return state
      }
      return {
        ...state,
        phase: 'playing',
        currentPlayerIndex: 0,
      }
    }

    case 'ROLL_DICE': {
      return { ...state, isRolling: true }
    }

    case 'SET_DICE_VALUE': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      const newPosition = currentPlayer.position + action.value
      const { finalPosition, wormTriggered } = calculateFinalPosition(newPosition)

      // Check for Fremen worm choice
      if (
        wormTriggered &&
        currentPlayer.faction === 'fremen' &&
        !currentPlayer.abilityUsed
      ) {
        const players = [...state.players] as [Player, Player]
        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          position: newPosition, // Store pre-worm position temporarily
        }
        return {
          ...state,
          players,
          diceValue: action.value,
          isRolling: false,
          pendingWormChoice: true,
        }
      }

      const players = [...state.players] as [Player, Player]
      players[state.currentPlayerIndex] = {
        ...currentPlayer,
        position: finalPosition,
      }

      // Check for win
      if (finalPosition >= BOARD.totalSquares) {
        return {
          ...state,
          players,
          diceValue: action.value,
          isRolling: false,
          phase: 'victory',
          winner: state.currentPlayerIndex,
        }
      }

      return {
        ...state,
        players,
        diceValue: action.value,
        isRolling: false,
        bonusRollPending: action.value === 6,
      }
    }

    case 'FREMEN_CHOICE': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      const players = [...state.players] as [Player, Player]

      if (action.rideWorm) {
        // Ride worm forward: add distance instead of subtract
        const wormHead = currentPlayer.position
        const { finalPosition: wormTail } = calculateFinalPosition(wormHead)
        const distance = wormHead - wormTail
        const forwardPosition = Math.min(wormHead + distance, BOARD.totalSquares)

        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          position: forwardPosition,
          abilityUsed: true,
        }

        if (forwardPosition >= BOARD.totalSquares) {
          return {
            ...state,
            players,
            pendingWormChoice: false,
            phase: 'victory',
            winner: state.currentPlayerIndex,
          }
        }
      } else {
        // Take the fall
        const { finalPosition } = calculateFinalPosition(currentPlayer.position)
        players[state.currentPlayerIndex] = {
          ...currentPlayer,
          position: finalPosition,
        }
      }

      return {
        ...state,
        players,
        pendingWormChoice: false,
        bonusRollPending: state.diceValue === 6,
      }
    }

    case 'USE_ABILITY': {
      const players = [...state.players] as [Player, Player]
      players[action.playerIndex] = {
        ...players[action.playerIndex],
        abilityUsed: true,
      }
      return { ...state, players }
    }

    case 'MOVE_COMPLETE': {
      if (state.bonusRollPending) {
        return {
          ...state,
          bonusRollPending: false,
          diceValue: null,
        }
      }
      return {
        ...state,
        currentPlayerIndex: state.currentPlayerIndex === 0 ? 1 : 0,
        diceValue: null,
      }
    }

    case 'RESET_GAME': {
      return initialState
    }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return { state, dispatch }
}
```

**Step 4: Run tests to verify they pass**

Run:

```bash
npm run test:run src/hooks/__tests__/useGameState.test.ts
```

Expected: All tests PASS

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement game state reducer with TDD"
```

---

## Phase 3: UI Components

### Task 7: Create Game Container

**Files:**

- Create: `src/components/Game/Game.tsx`
- Create: `src/components/Game/index.ts`
- Modify: `src/app/page.tsx`

**Step 1: Create Game component**

Create `src/components/Game/Game.tsx`:

```typescript
'use client'

import { useGameState } from '@/hooks/useGameState'
import { Lobby } from '@/components/Lobby'
import { Board } from '@/components/Board'
import { Victory } from '@/components/Victory'

export function Game() {
  const { state, dispatch } = useGameState()

  return (
    <main className="min-h-screen bg-sky flex items-center justify-center p-8">
      {state.phase === 'lobby' && <Lobby state={state} dispatch={dispatch} />}
      {state.phase === 'playing' && <Board state={state} dispatch={dispatch} />}
      {state.phase === 'victory' && <Victory state={state} dispatch={dispatch} />}
    </main>
  )
}
```

Create `src/components/Game/index.ts`:

```typescript
export { Game } from './Game'
```

**Step 2: Create placeholder components**

Create `src/components/Lobby/index.ts`:

```typescript
import { GameState, GameAction } from '@/types/game'

interface LobbyProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Lobby({ state, dispatch }: LobbyProps) {
  return (
    <div className="text-shadow text-2xl">
      Lobby - Coming Soon
    </div>
  )
}
```

Create `src/components/Board/index.ts`:

```typescript
import { GameState, GameAction } from '@/types/game'

interface BoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Board({ state, dispatch }: BoardProps) {
  return (
    <div className="text-shadow text-2xl">
      Board - Coming Soon
    </div>
  )
}
```

Create `src/components/Victory/index.ts`:

```typescript
import { GameState, GameAction } from '@/types/game'

interface VictoryProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Victory({ state, dispatch }: VictoryProps) {
  return (
    <div className="text-shadow text-2xl">
      Victory - Coming Soon
    </div>
  )
}
```

**Step 3: Update page**

Modify `src/app/page.tsx`:

```typescript
import { Game } from '@/components/Game'

export default function Home() {
  return <Game />
}
```

**Step 4: Verify app runs**

Run:

```bash
npm run dev
```

Expected: "Lobby - Coming Soon" displays

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Game container with phase-based rendering"
```

---

### Task 8: Implement Lobby Screen

**Files:**

- Create: `src/components/Lobby/Lobby.tsx`
- Create: `src/components/Lobby/FactionSelect.tsx`
- Modify: `src/components/Lobby/index.ts`

**Step 1: Create FactionSelect component**

Create `src/components/Lobby/FactionSelect.tsx`:

```typescript
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
              ${isSelected ? 'border-spice bg-sand/30' : 'border-sand/50 bg-sand/10'}
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
            <div className="text-sm text-shadow mt-1">
              <span className="font-semibold">{data.abilityName}:</span>{' '}
              {data.abilityDescription}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
```

**Step 2: Create Lobby component**

Create `src/components/Lobby/Lobby.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { FactionSelect } from './FactionSelect'

interface LobbyProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Lobby({ state, dispatch }: LobbyProps) {
  const canStart = state.players[0].faction && state.players[1].faction

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold text-center text-shadow mb-2"
      >
        DUNE
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl text-center text-spice mb-12"
      >
        The Spice Trail
      </motion.h2>

      {/* Player Setup */}
      <div className="grid grid-cols-2 gap-12">
        {/* Player 1 */}
        <div>
          <h3 className="text-xl font-semibold text-shadow mb-4">Player 1</h3>
          <input
            type="text"
            placeholder="Enter name..."
            value={state.players[0].name === 'Player 1' ? '' : state.players[0].name}
            onChange={(e) =>
              dispatch({
                type: 'SET_PLAYER_NAME',
                playerIndex: 0,
                name: e.target.value,
              })
            }
            className="w-full p-3 mb-4 bg-sand/20 border border-sand rounded-lg
                       text-shadow placeholder:text-shadow/50 focus:outline-none
                       focus:border-spice"
          />
          <FactionSelect
            selectedFaction={state.players[0].faction}
            disabledFaction={state.players[1].faction}
            onSelect={(faction) =>
              dispatch({ type: 'SET_PLAYER_FACTION', playerIndex: 0, faction })
            }
          />
        </div>

        {/* Player 2 */}
        <div>
          <h3 className="text-xl font-semibold text-shadow mb-4">Player 2</h3>
          <input
            type="text"
            placeholder="Enter name..."
            value={state.players[1].name === 'Player 2' ? '' : state.players[1].name}
            onChange={(e) =>
              dispatch({
                type: 'SET_PLAYER_NAME',
                playerIndex: 1,
                name: e.target.value,
              })
            }
            className="w-full p-3 mb-4 bg-sand/20 border border-sand rounded-lg
                       text-shadow placeholder:text-shadow/50 focus:outline-none
                       focus:border-spice"
          />
          <FactionSelect
            selectedFaction={state.players[1].faction}
            disabledFaction={state.players[0].faction}
            onSelect={(faction) =>
              dispatch({ type: 'SET_PLAYER_FACTION', playerIndex: 1, faction })
            }
          />
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={() => dispatch({ type: 'START_GAME' })}
        disabled={!canStart}
        whileHover={canStart ? { scale: 1.05 } : undefined}
        whileTap={canStart ? { scale: 0.95 } : undefined}
        className={`
          mt-12 mx-auto block px-12 py-4 text-2xl font-bold rounded-lg
          transition-all
          ${canStart
            ? 'bg-spice text-white cursor-pointer hover:bg-spice/90'
            : 'bg-sand/30 text-shadow/50 cursor-not-allowed'}
        `}
      >
        Begin Journey
      </motion.button>
    </motion.div>
  )
}
```

**Step 3: Update index export**

Modify `src/components/Lobby/index.ts`:

```typescript
export { Lobby } from './Lobby'
```

**Step 4: Verify lobby renders**

Run:

```bash
npm run dev
```

Expected: Lobby screen with title, player inputs, faction selection, and start button

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement Lobby screen with faction selection"
```

---

### Task 9: Implement Game Board Grid

**Files:**

- Create: `src/components/Board/Board.tsx`
- Create: `src/components/Board/Square.tsx`
- Modify: `src/components/Board/index.ts`

**Step 1: Create Square component**

Create `src/components/Board/Square.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { checkWorm, checkOrnithopter } from '@/lib/board'

interface SquareProps {
  number: number
  row: number
  col: number
}

export function Square({ number, row, col }: SquareProps) {
  const hasWorm = checkWorm(number) !== null
  const hasOrnithopter = checkOrnithopter(number) !== null

  // Alternate background for visual interest
  const isEvenSquare = (row + col) % 2 === 0

  return (
    <div
      className={`
        relative w-14 h-14 border border-sand/30 flex items-center justify-center
        text-xs font-semibold
        ${isEvenSquare ? 'bg-sand/20' : 'bg-sand/10'}
        ${hasWorm ? 'bg-harkonnen/20' : ''}
        ${hasOrnithopter ? 'bg-atreides/20' : ''}
      `}
    >
      <span className="text-shadow/60">{number}</span>

      {hasWorm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-2xl"
        >
          🐛
        </motion.div>
      )}

      {hasOrnithopter && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-2xl"
        >
          🚁
        </motion.div>
      )}
    </div>
  )
}
```

**Step 2: Create Board component**

Create `src/components/Board/Board.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getSquarePosition } from '@/lib/board'
import { BOARD } from '@/lib/constants'
import { Square } from './Square'
import { Dice } from '@/components/Dice'
import { HUD } from '@/components/HUD'
import { PlayerPiece } from '@/components/PlayerPiece'

interface BoardProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Board({ state, dispatch }: BoardProps) {
  // Generate board squares
  const squares = []
  for (let row = 0; row < BOARD.size; row++) {
    for (let col = 0; col < BOARD.size; col++) {
      // Find which square number corresponds to this position
      let squareNum = 0
      for (let s = 1; s <= BOARD.totalSquares; s++) {
        const pos = getSquarePosition(s)
        if (pos.row === row && pos.col === col) {
          squareNum = s
          break
        }
      }
      squares.push(
        <Square key={`${row}-${col}`} number={squareNum} row={row} col={col} />
      )
    }
  }

  return (
    <div className="flex gap-8 items-start">
      {/* HUD - Left side */}
      <HUD state={state} dispatch={dispatch} playerIndex={0} />

      {/* Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Grid */}
        <div
          className="grid bg-sand/30 border-4 border-sand rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${BOARD.size}, 1fr)`,
          }}
        >
          {squares}
        </div>

        {/* Player Pieces */}
        <PlayerPiece
          player={state.players[0]}
          playerIndex={0}
          isCurrentPlayer={state.currentPlayerIndex === 0}
        />
        <PlayerPiece
          player={state.players[1]}
          playerIndex={1}
          isCurrentPlayer={state.currentPlayerIndex === 1}
        />
      </motion.div>

      {/* HUD - Right side */}
      <HUD state={state} dispatch={dispatch} playerIndex={1} />

      {/* Dice */}
      <Dice state={state} dispatch={dispatch} />
    </div>
  )
}
```

**Step 3: Update index export**

Modify `src/components/Board/index.ts`:

```typescript
export { Board } from './Board'
```

**Step 4: Create placeholder HUD, Dice, PlayerPiece**

Create `src/components/HUD/index.ts`:

```typescript
import { GameState, GameAction } from '@/types/game'

interface HUDProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  playerIndex: 0 | 1
}

export function HUD({ state, dispatch, playerIndex }: HUDProps) {
  const player = state.players[playerIndex]
  const isCurrentPlayer = state.currentPlayerIndex === playerIndex

  return (
    <div className={`p-4 rounded-lg ${isCurrentPlayer ? 'bg-spice/20' : 'bg-sand/20'}`}>
      <div className="font-bold">{player.name}</div>
      <div className="text-sm">Position: {player.position}</div>
    </div>
  )
}
```

Create `src/components/Dice/index.ts`:

```typescript
import { GameState, GameAction } from '@/types/game'

interface DiceProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Dice({ state, dispatch }: DiceProps) {
  const rollDice = () => {
    const value = Math.floor(Math.random() * 6) + 1
    dispatch({ type: 'SET_DICE_VALUE', value })
  }

  return (
    <button
      onClick={rollDice}
      className="fixed bottom-8 right-8 w-20 h-20 bg-spice rounded-lg
                 text-white text-3xl font-bold hover:bg-spice/80"
    >
      {state.diceValue ?? '?'}
    </button>
  )
}
```

Create `src/components/PlayerPiece/index.ts`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { Player } from '@/types/game'
import { getSquarePosition } from '@/lib/board'
import { getFactionData } from '@/lib/factions'

interface PlayerPieceProps {
  player: Player
  playerIndex: 0 | 1
  isCurrentPlayer: boolean
}

export function PlayerPiece({ player, playerIndex, isCurrentPlayer }: PlayerPieceProps) {
  if (player.position === 0 || !player.faction) return null

  const { row, col } = getSquarePosition(player.position)
  const factionData = getFactionData(player.faction)

  // Offset slightly so pieces don't overlap completely
  const offset = playerIndex === 0 ? -8 : 8

  return (
    <motion.div
      initial={false}
      animate={{
        top: row * 56 + 28 + offset,
        left: col * 56 + 28 + offset,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2
                 border-2 border-white shadow-lg"
      style={{ backgroundColor: factionData.color }}
    />
  )
}
```

**Step 5: Verify board renders**

Run:

```bash
npm run dev
```

Expected: Board grid with numbered squares, worm/ornithopter markers, basic HUD and dice

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Board grid with squares and player pieces"
```

---

### Task 10: Implement Dice with Animation

**Files:**

- Create: `src/components/Dice/Dice.tsx`
- Modify: `src/components/Dice/index.ts`

**Step 1: Create animated Dice component**

Create `src/components/Dice/Dice.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { TIMING } from '@/lib/constants'

interface DiceProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Dice({ state, dispatch }: DiceProps) {
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    if (isRolling || state.phase !== 'playing') return

    setIsRolling(true)
    dispatch({ type: 'ROLL_DICE' })

    // Simulate roll animation
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1
      dispatch({ type: 'SET_DICE_VALUE', value })
      setIsRolling(false)

      // After movement completes, handle turn transition
      setTimeout(() => {
        dispatch({ type: 'MOVE_COMPLETE' })
      }, 500)
    }, TIMING.diceRoll)
  }

  const canRoll = state.phase === 'playing' && !isRolling && !state.pendingWormChoice

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
      {/* Bonus roll indicator */}
      <AnimatePresence>
        {state.bonusRollPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-spice font-bold text-lg"
          >
            Bonus Roll!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dice */}
      <motion.button
        onClick={rollDice}
        disabled={!canRoll}
        animate={
          isRolling
            ? {
                rotate: [0, 360, 720, 1080],
                scale: [1, 1.1, 0.9, 1],
              }
            : {}
        }
        transition={{
          duration: TIMING.diceRoll / 1000,
          ease: 'easeOut',
        }}
        whileHover={canRoll ? { scale: 1.1 } : undefined}
        whileTap={canRoll ? { scale: 0.9 } : undefined}
        className={`
          w-24 h-24 rounded-xl text-white text-4xl font-bold
          shadow-lg border-4 border-white/20
          flex items-center justify-center
          ${canRoll ? 'bg-spice cursor-pointer' : 'bg-sand cursor-not-allowed'}
          ${state.diceValue === 6 ? 'ring-4 ring-gold ring-opacity-75' : ''}
        `}
      >
        {isRolling ? '?' : state.diceValue ?? 'Roll'}
      </motion.button>

      {/* Roll instruction */}
      {canRoll && !state.diceValue && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-shadow text-sm"
        >
          Click to roll
        </motion.div>
      )}
    </div>
  )
}
```

**Step 2: Update index export**

Modify `src/components/Dice/index.ts`:

```typescript
export { Dice } from './Dice'
```

**Step 3: Verify dice animation**

Run:

```bash
npm run dev
```

Expected: Dice rolls with rotation animation, shows value, handles bonus rolls

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement Dice with roll animation and bonus roll handling"
```

---

### Task 11: Implement HUD with Ability Button

**Files:**

- Create: `src/components/HUD/HUD.tsx`
- Create: `src/components/AbilityButton/index.ts`
- Modify: `src/components/HUD/index.ts`

**Step 1: Create AbilityButton component**

Create `src/components/AbilityButton/index.ts`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { Player, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'

interface AbilityButtonProps {
  player: Player
  playerIndex: 0 | 1
  isCurrentPlayer: boolean
  canUse: boolean
  dispatch: React.Dispatch<GameAction>
}

export function AbilityButton({
  player,
  playerIndex,
  isCurrentPlayer,
  canUse,
  dispatch,
}: AbilityButtonProps) {
  if (!player.faction) return null

  const factionData = getFactionData(player.faction)
  const isAvailable = !player.abilityUsed && isCurrentPlayer && canUse

  return (
    <motion.button
      onClick={() => {
        if (isAvailable) {
          dispatch({ type: 'USE_ABILITY', playerIndex })
        }
      }}
      disabled={!isAvailable}
      animate={
        isAvailable
          ? {
              boxShadow: [
                '0 0 0 0 rgba(224, 122, 44, 0)',
                '0 0 0 8px rgba(224, 122, 44, 0.3)',
                '0 0 0 0 rgba(224, 122, 44, 0)',
              ],
            }
          : {}
      }
      transition={{ repeat: Infinity, duration: 2 }}
      className={`
        mt-4 px-4 py-2 rounded-lg text-sm font-semibold
        transition-all
        ${player.abilityUsed
          ? 'bg-sand/20 text-shadow/40 line-through'
          : isAvailable
            ? 'bg-spice text-white cursor-pointer hover:bg-spice/80'
            : 'bg-sand/30 text-shadow/60 cursor-not-allowed'}
      `}
    >
      {factionData.abilityName}
    </motion.button>
  )
}
```

**Step 2: Create HUD component**

Create `src/components/HUD/HUD.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'
import { AbilityButton } from '@/components/AbilityButton'

interface HUDProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  playerIndex: 0 | 1
}

export function HUD({ state, dispatch, playerIndex }: HUDProps) {
  const player = state.players[playerIndex]
  const isCurrentPlayer = state.currentPlayerIndex === playerIndex
  const factionData = player.faction ? getFactionData(player.faction) : null

  return (
    <motion.div
      animate={{
        scale: isCurrentPlayer ? 1.02 : 1,
        opacity: isCurrentPlayer ? 1 : 0.7,
      }}
      className={`
        w-48 p-4 rounded-xl border-2 transition-colors
        ${isCurrentPlayer ? 'border-spice bg-sand/30' : 'border-sand/50 bg-sand/20'}
      `}
    >
      {/* Player name */}
      <div className="font-bold text-lg text-shadow">{player.name}</div>

      {/* Faction */}
      {factionData && (
        <div
          className="text-sm font-semibold mt-1"
          style={{ color: factionData.color }}
        >
          {factionData.name}
        </div>
      )}

      {/* Position */}
      <div className="mt-3 text-sm text-shadow/80">
        Position: <span className="font-bold text-spice">{player.position}</span>
      </div>

      {/* Current turn indicator */}
      {isCurrentPlayer && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-2 text-xs text-spice font-semibold uppercase"
        >
          Your Turn
        </motion.div>
      )}

      {/* Ability button */}
      <AbilityButton
        player={player}
        playerIndex={playerIndex}
        isCurrentPlayer={isCurrentPlayer}
        canUse={!state.isRolling}
        dispatch={dispatch}
      />
    </motion.div>
  )
}
```

**Step 3: Update index export**

Modify `src/components/HUD/index.ts`:

```typescript
export { HUD } from './HUD'
```

**Step 4: Verify HUD displays**

Run:

```bash
npm run dev
```

Expected: HUD shows player info, current turn indicator, and ability button

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement HUD with ability button"
```

---

### Task 12: Implement Victory Screen

**Files:**

- Create: `src/components/Victory/Victory.tsx`
- Modify: `src/components/Victory/index.ts`

**Step 1: Create Victory component**

Create `src/components/Victory/Victory.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { GameState, GameAction } from '@/types/game'
import { getFactionData } from '@/lib/factions'
import { TIMING } from '@/lib/constants'

interface VictoryProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function Victory({ state, dispatch }: VictoryProps) {
  const winner = state.winner !== null ? state.players[state.winner] : null
  const factionData = winner?.faction ? getFactionData(winner.faction) : null

  if (!winner || !factionData) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-shadow/80 z-50"
    >
      <div className="text-center">
        {/* Faction crest placeholder */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-40 h-40 mx-auto mb-8 rounded-full flex items-center justify-center
                     text-6xl border-4"
          style={{
            backgroundColor: factionData.color,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          {winner.faction === 'atreides' && '🦅'}
          {winner.faction === 'harkonnen' && '🦁'}
          {winner.faction === 'fremen' && '🏜️'}
          {winner.faction === 'sardaukar' && '⚔️'}
        </motion.div>

        {/* Winner name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {winner.name}
        </motion.div>

        {/* Faction name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mb-8"
          style={{ color: factionData.color }}
        >
          {factionData.name} Victorious
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-sand italic mb-12 max-w-md mx-auto"
        >
          "He who controls the spice, controls the universe."
        </motion.div>

        {/* Play again button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TIMING.victoryDelay / 1000 }}
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-spice text-white text-xl font-bold rounded-lg
                     hover:bg-spice/80 transition-colors"
        >
          Play Again
        </motion.button>
      </div>
    </motion.div>
  )
}
```

**Step 2: Update index export**

Modify `src/components/Victory/index.ts`:

```typescript
export { Victory } from './Victory'
```

**Step 3: Verify victory screen**

Run:

```bash
npm run dev
```

Test by modifying initial position to 95 and rolling

Expected: Victory screen with faction crest, winner info, quote, and replay button

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement Victory screen with animations"
```

---

## Phase 4: Polish & Sound

### Task 13: Add Sound Effects

**Files:**

- Create: `src/hooks/useAudio.ts`
- Create: `public/sounds/.gitkeep`

**Step 1: Create audio hook**

Create `src/hooks/useAudio.ts`:

```typescript
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
      soundsRef.current.set(name as SoundName, howl)
    })

    return () => {
      soundsRef.current.forEach((howl) => howl.unload())
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
    return !mutedRef.current
  }, [])

  return { play, setMuted, toggleMute, isMuted: () => mutedRef.current }
}
```

**Step 2: Create sounds directory placeholder**

Run:

```bash
mkdir -p public/sounds && touch public/sounds/.gitkeep
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add audio hook with Howler.js integration"
```

---

### Task 14: Add Sound Toggle UI

**Files:**

- Create: `src/components/SoundToggle/index.ts`
- Modify: `src/components/Game/Game.tsx`

**Step 1: Create SoundToggle component**

Create `src/components/SoundToggle/index.ts`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SoundToggleProps {
  onToggle: () => boolean
}

export function SoundToggle({ onToggle }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true)

  const handleToggle = () => {
    const newMuted = !onToggle()
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
```

**Step 2: Integrate into Game component**

Modify `src/components/Game/Game.tsx`:

```typescript
'use client'

import { useGameState } from '@/hooks/useGameState'
import { useAudio } from '@/hooks/useAudio'
import { Lobby } from '@/components/Lobby'
import { Board } from '@/components/Board'
import { Victory } from '@/components/Victory'
import { SoundToggle } from '@/components/SoundToggle'

export function Game() {
  const { state, dispatch } = useGameState()
  const audio = useAudio()

  return (
    <main className="min-h-screen bg-sky flex items-center justify-center p-8">
      <SoundToggle onToggle={audio.toggleMute} />
      {state.phase === 'lobby' && <Lobby state={state} dispatch={dispatch} />}
      {state.phase === 'playing' && (
        <Board state={state} dispatch={dispatch} audio={audio} />
      )}
      {state.phase === 'victory' && (
        <Victory state={state} dispatch={dispatch} audio={audio} />
      )}
    </main>
  )
}
```

**Step 3: Update Board and Victory to accept audio prop**

The audio prop allows components to trigger sounds. Update component interfaces as needed.

**Step 4: Verify sound toggle displays**

Run:

```bash
npm run dev
```

Expected: Sound toggle button in top-right corner

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sound toggle UI"
```

---

### Task 15: Final Integration and Testing

**Files:**

- Run all tests
- Manual playthrough

**Step 1: Run all tests**

Run:

```bash
npm run test:run
```

Expected: All tests PASS

**Step 2: Run linting**

Run:

```bash
npm run lint
```

Expected: No errors

**Step 3: Build for production**

Run:

```bash
npm run build
```

Expected: Build succeeds

**Step 4: Manual playthrough**

Run:

```bash
npm run dev
```

Test checklist:
- [ ] Lobby: Enter names, select factions
- [ ] Lobby: Start button only active when both factions selected
- [ ] Board: Dice rolls and animates
- [ ] Board: Player pieces move correctly
- [ ] Board: Worm sends player backward
- [ ] Board: Ornithopter sends player forward
- [ ] Board: Bonus roll on 6
- [ ] Board: Turn switches correctly
- [ ] Victory: Displays when reaching 100
- [ ] Victory: Play again resets game

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: complete initial game implementation"
```

---

## Summary

This plan implements Dune: The Spice Trail in 15 tasks across 4 phases:

1. **Foundation** (Tasks 1-2): Project setup, design tokens
2. **Game Logic** (Tasks 3-6): Types, board utilities, factions, game reducer (all TDD)
3. **UI Components** (Tasks 7-12): Game container, Lobby, Board, Dice, HUD, Victory
4. **Polish** (Tasks 13-15): Sound effects, final integration

Each task is 2-5 minutes of focused work with explicit file paths, code, and verification steps.

---

**Plan complete and saved to `docs/plans/2026-01-11-dune-spice-trail-implementation.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
