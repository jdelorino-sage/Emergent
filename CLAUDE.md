# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
npm run lint         # ESLint on src/
npm run format       # Prettier format src/
npm run test         # Run tests (vitest)
npm run test:watch   # Run tests in watch mode
```

## Architecture

EMERGENT is a browser-based 2D side-scrolling game (Terraria-style) built with **PixiJS** for WebGL rendering and **React** for the HUD overlay. They are intentionally separated: PixiJS owns the game canvas, React owns UI panels. They communicate through a **Zustand** store.

### Two-layer rendering model
- **PixiJS** (WebGL canvas): terrain tiles, entity sprites, particles — runs in the game loop at 60fps
- **React** (DOM overlay): resource bar, time display, build menu, crafting panel — re-renders only when subscribed Zustand slices change

### Game loop (`src/engine/GameLoop.ts`)
Fixed-timestep at 60 UPS with render interpolation. The loop drives ECS system updates, then renders. System execution order matters:
1. `PlayerControlSystem` — reads input, sets velocity
2. `MovementSystem` — applies velocity, gravity, terrain collision (AABB)
3. `DayNightSystem` — advances game clock
4. `RenderSystem` — syncs ECS positions to PixiJS sprites (render-time only)

### ECS (`src/ecs/`)
Lightweight custom Entity-Component-System. Entity = numeric ID. Components = plain TS objects in `Map<EntityId, T>` keyed by string type tag. Systems = functions `(world, dt) => void`.

Key component types: `Position`, `Velocity`, `Collider`, `SpriteComponent`, `Player`, `Citizen`, `Inventory`, `Building`

### Terrain (`src/terrain/`)
- `TerrainData`: 512×256 tile grid stored as `Uint8Array` (~128KB). Access: `tiles[y * width + x]`.
- `TerrainGenerator`: Simplex noise for elevation, caves, ore veins, trees. Seeded via mulberry32 PRNG.
- `TerrainRenderer`: Viewport-culled sprite pooling — only renders visible tiles plus buffer. Recycles offscreen sprites on camera pan.

### State bridge (`src/store/gameStore.ts`)
Zustand store holds data the HUD cares about (resources, time-of-day). Game loop writes via `useGameStore.getState().method()`. React components subscribe to slices.

### Entity factories (`src/entities/`)
`createPlayer`, `createCitizen` — compose entities from components and add PixiJS graphics to the stage.

### Path alias
`@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts).

## Key Conventions

- **No React in the game hot path** — PixiJS renders the world; React only renders HUD elements
- **Component type tags** are string constants exported alongside their interface (e.g., `export const POSITION = "position"`)
- **Terrain coordinates**: (x, y) where y increases downward. Surface is around y=80. Underground extends to y=256.
- **Tile types** defined in `src/constants/tiles.ts` with properties (solid, mineable, color, hardness)
- **Phase 1 scope**: 3 resources (wood/stone/iron), 5 buildings, 3 citizens with simplified traits (bravery/diligence/curiosity)
