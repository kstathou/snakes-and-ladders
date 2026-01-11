# Dune: The Spice Trail — Game Design Document

A browser-based Snakes and Ladders reimagining set on Frank Herbert's Arrakis.

## Overview

Two players select their faction, each with a one-time-use special ability, then race across a 10x10 desert board. Sandworms (Shai-Hulud) replace snakes—dragging players backward. Ornithopters replace ladders—lifting players forward. First to reach square 100 wins.

**Target Platform:** Desktop browsers (landscape), deployed on Vercel
**Multiplayer Mode:** Same-device (pass-and-play)
**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion, Howler.js

---

## Visual Identity

### Color Palette (Desert Daytime)

| Role | Color | Hex |
| ---- | ----- | --- |
| Primary Sand | Warm sand | #C2956E |
| Accent | Burnt orange spice | #E07A2C |
| Background | Pale sky | #D4C4A8 |
| Shadow | Deep brown | #3D2914 |
| Atreides | Noble blue | #1E3A5F |
| Harkonnen | Cruel red | #8B0000 |
| Fremen | Desert tan/blue | #7C9885 |
| Sardaukar | Imperial grey/gold | #5C5C5C |

### Typography

**Font Family:** Barlow Condensed
**Weights:** 400 (body), 600 (headings), 700 (titles)
**Style:** Utilitarian, harsh, condensed—reflecting Fremen desert survival aesthetic

### Atmosphere

- Sun-bleached, oppressive desert heat
- Sand textures across UI elements
- Distant rock formations on horizon
- Occasional spice blow effects
- Board squares as varied desert terrain (dunes, rocky ground, spice fields)

---

## Factions & Abilities

Each player selects one faction. Each ability is **one-time use per game**.

| Faction | Piece Icon | Ability Name | Effect | Trigger |
| ------- | ---------- | ------------ | ------ | ------- |
| House Atreides | Hawk | Prescience | See dice result before rolling; choose to keep or reroll once | Before own roll |
| House Harkonnen | Griffin | Sabotage | Force opponent to reroll their dice (must keep new result) | After opponent rolls |
| Fremen | Sietch symbol | Worm Rider | When landing on sandworm, ride it forward instead of backward | On worm landing |
| Sardaukar | Imperial blade | Forced March | Add +2 to dice result | After own roll |

---

## Game Flow

### Phase 1: Lobby

1. Title screen displays with Arrakis landscape backdrop
2. Player 1 enters name (defaults to "Player 1" if empty)
3. Player 1 selects faction (ability preview shown on hover)
4. Player 2 enters name (defaults to "Player 2" if empty)
5. Player 2 selects faction (already-chosen faction greyed out)
6. "Begin Journey" button activates when both players ready

### Phase 2: Gameplay

**Turn Structure:**

1. Current player's faction emblem highlights in HUD
2. Player clicks dice to roll
3. Dice animation plays (~600ms shake, then settle)
4. If 6 rolled: spice glow effect, bonus roll granted
5. Piece animates along path (square-by-square, ~200ms each)
6. If landing on sandworm head: worm encounter sequence triggers
7. If landing on ornithopter pad: ornithopter sequence triggers
8. Turn passes to opponent (unless bonus roll pending)

**Ability Usage:**

- Ability button appears near player's area during their turn
- Button glows subtly as reminder
- Once used, button fades permanently for that player
- Fremen ability prompts when landing on worm (use or decline)

### Phase 3: Victory

- Triggered when any player reaches or exceeds square 100
- Board fades to 50% opacity
- Winner's faction crest scales in with elastic easing
- Spice particles swirl around crest
- Winner's piece pulses with golden glow
- Loser's piece fades to silhouette
- Quote appears: *"He who controls the spice, controls the universe"*
- "Play Again" button fades in after 2 seconds

---

## Board Design

### Structure

- 10x10 grid (100 squares)
- Serpentine path (row 1 left-to-right, row 2 right-to-left, etc.)
- Square 1 at bottom-left, square 100 at top-left

### Sandworm Placements (Head → Tail)

| Head | Tail | Drop |
| ---- | ---- | ---- |
| 99 | 54 | -45 |
| 91 | 73 | -18 |
| 76 | 36 | -40 |
| 66 | 24 | -42 |
| 52 | 29 | -23 |
| 43 | 17 | -26 |

### Ornithopter Placements (Pad → Destination)

| Pad | Destination | Lift |
| --- | ----------- | ---- |
| 4 | 25 | +21 |
| 13 | 46 | +33 |
| 27 | 64 | +37 |
| 40 | 59 | +19 |
| 56 | 84 | +28 |
| 61 | 81 | +20 |
| 71 | 90 | +19 |

---

## Dice Mechanics (Spice Dice)

- Single six-sided die (d6)
- Rolling a 6 grants a bonus roll (additive, can chain)
- No cap on consecutive 6s
- Visual: Standard die with spice-orange pips, glows on 6

---

## Animations

### Dice Roll

- Rapid shake/rotation (~600ms)
- Settles with subtle bounce
- On 6: golden spice glow pulses, particle burst, brief float

### Piece Movement

- Hop square-to-square (~200ms per square, ease-out)
- Dust puff at each landing
- Spice-orange trail fades behind
- Final landing: squash-and-stretch settle

### Sandworm Encounter (~1.5s total)

1. Screen shake (~100ms)
2. Sand particles explode upward
3. Worm silhouette rises from sand
4. Piece scales down, fades (swallowed)
5. View follows worm path briefly
6. Piece emerges at tail (scales up, dust burst)

### Ornithopter Rescue (~1.8s total)

1. Mechanical whir begins
2. Ornithopter descends from off-screen
3. Wings articulate (flutter animation)
4. Piece rises, attaches
5. Aircraft flies arc path to destination
6. Piece drops with float effect
7. Ornithopter exits upward

### Victory Celebration

1. Board fades to 50%
2. Faction crest scales in (elastic ease)
3. Spice vortex particles
4. Winner piece golden pulse
5. Loser piece fades
6. Quote fade-in
7. Button fade-in (2s delay)

### Ambient (subtle)

- Player piece idle: gentle hover/bob
- Turn indicator: soft pulse
- Ability button: glow when available

---

## Sound Design

All sounds muted by default. Toggle in corner of screen.

### Dice

| Sound | File | Duration |
| ----- | ---- | -------- |
| Rolling | dice-shake.mp3 | ~600ms loop |
| Landing | dice-land.mp3 | ~200ms |
| Bonus (6) | spice-bonus.mp3 | ~400ms |

### Movement

| Sound | File | Notes |
| ----- | ---- | ----- |
| Hop | piece-hop.mp3 | Per square, pitch varies |
| Land | piece-land.mp3 | Final position |

### Sandworm

| Sound | File | Duration |
| ----- | ---- | -------- |
| Rumble | worm-rumble.mp3 | ~1.5s |
| Sand burst | sand-burst.mp3 | ~300ms |
| Swallow | worm-swallow.mp3 | ~500ms |

### Ornithopter

| Sound | File | Notes |
| ----- | ---- | ----- |
| Wing whir | thopter-whir.mp3 | Loop during flight |
| Arrive | thopter-arrive.mp3 | Descending pitch |
| Depart | thopter-depart.mp3 | Ascending pitch |

### UI

| Sound | File |
| ----- | ---- |
| Button hover | button-hover.mp3 |
| Button click | button-click.mp3 |
| Ability use | ability-activate.mp3 |
| Victory | victory-fanfare.mp3 |

---

## Technical Architecture

### Project Structure

```
.gitignore
.env.example
package.json
tsconfig.json
tailwind.config.ts
next.config.js
README.md
public/
  sounds/
  fonts/
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    Lobby/
    Board/
    Dice/
    PlayerPiece/
    AbilityButton/
    HUD/
    Victory/
  hooks/
    useGameState.ts
    useAudio.ts
  lib/
    board.ts
    factions.ts
    constants.ts
  types/
    game.ts
```

### State Management

Single reducer pattern with React useReducer:

```typescript
interface GameState {
  phase: 'lobby' | 'playing' | 'victory';
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  diceValue: number | null;
  bonusRollPending: boolean;
  winner: number | null;
}

interface Player {
  name: string;
  faction: 'atreides' | 'harkonnen' | 'fremen' | 'sardaukar';
  position: number;
  abilityUsed: boolean;
}
```

### Key Libraries

| Library | Purpose |
| ------- | ------- |
| Next.js 14+ | Framework, App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Howler.js | Audio playback |

---

## Edge Cases

| Scenario | Behavior |
| -------- | -------- |
| Exact land on 100 | Win immediately |
| Overshoot 100 | Counts as 100, win |
| Worm at 99 | Still triggers, sends back |
| Multiple 6s | All grant bonus rolls, no cap |
| Harkonnen vs Atreides | Can force reroll on prescience roll |
| Fremen on worm | Prompt: use ability or take fall |
| Same faction pick | Grey out chosen faction for player 2 |
| Empty name | Default to "Player 1"/"Player 2" |
| Mid-animation click | Disable controls during sequences |

---

## Accessibility

- Keyboard navigation: Tab to navigate, Space/Enter to interact
- Sufficient color contrast (WCAG AA)
- Reduced motion: respect `prefers-reduced-motion`, skip particles, instant transitions

---

## Testing Strategy

| Type | Coverage |
| ---- | -------- |
| Unit | Game reducer (moves, triggers, win detection) |
| Component | Faction select, dice outcomes, ability triggers |
| Integration | Full game flow (lobby → play → victory) |
| Manual | Animation timing, feel, sound sync |

---

## Future Considerations (Out of Scope)

These are explicitly not part of v1 but noted for potential expansion:

- Online multiplayer (WebSocket integration)
- Mobile-responsive layout
- Additional factions (Bene Gesserit, Spacing Guild)
- Tournament mode
- Custom board editor
- Spice collection scoring variant
