import { Container } from "pixi.js";
import { createPixiApp, destroyPixiApp } from "@/rendering/PixiApp";
import { GameLoop } from "@/engine/GameLoop";
import { Camera } from "@/engine/Camera";
import { InputManager } from "@/engine/InputManager";
import { World } from "@/ecs/World";
import { generateTerrain } from "@/terrain/TerrainGenerator";
import { TerrainRenderer } from "@/terrain/TerrainRenderer";
import { createMovementSystem } from "@/ecs/systems/MovementSystem";
import { createRenderSystem } from "@/ecs/systems/RenderSystem";
import { createPlayerControlSystem } from "@/ecs/systems/PlayerControlSystem";
import { dayNightSystem } from "@/ecs/systems/DayNightSystem";
import { createPlayer } from "@/entities/createPlayer";
import { createCitizen } from "@/entities/createCitizen";
import { POSITION, type Position } from "@/ecs/components/Position";
import { TILE_SIZE, SURFACE_Y, DAY_DURATION, NIGHT_DURATION } from "@/constants/config";
import type { TerrainData } from "@/terrain/TerrainData";
import { useGameStore } from "@/store/gameStore";

let gameLoop: GameLoop | null = null;
let input: InputManager | null = null;
let onResize: (() => void) | null = null;

/** Find the Y tile coordinate of the first solid block at the given X tile */
function findSurfaceY(terrain: TerrainData, tileX: number): number {
  for (let y = 0; y < terrain.height; y++) {
    if (terrain.isSolid(tileX, y)) {
      return y;
    }
  }
  return SURFACE_Y; // fallback
}

export async function initGame(container: HTMLElement): Promise<void> {
  const app = await createPixiApp(container);
  const seed = useGameStore.getState().seed;

  // Generate terrain
  const terrain = generateTerrain(seed);

  // Camera
  const camera = new Camera(app.screen.width, app.screen.height);

  // Handle resize
  onResize = () => camera.resize(app.screen.width, app.screen.height);
  window.addEventListener("resize", onResize);

  // Terrain renderer
  const terrainRenderer = new TerrainRenderer(terrain, camera);
  app.stage.addChild(terrainRenderer.container);

  // Entity layer
  const entityLayer = new Container();
  app.stage.addChild(entityLayer);

  // ECS
  const world = new World();

  // Input
  input = new InputManager(container);

  // Spawn player at middle of map, 2 tiles above surface (player is 2 tiles tall)
  const spawnX = Math.floor(terrain.width / 2);
  const spawnSurfaceY = findSurfaceY(terrain, spawnX);
  const spawnY = spawnSurfaceY - 2;

  const playerId = createPlayer(
    world,
    entityLayer,
    spawnX * TILE_SIZE,
    spawnY * TILE_SIZE,
  );

  // Create 3 citizens near spawn
  const CITIZEN_COUNT = 3;
  const CITIZEN_OFFSET = 3;
  const CITIZEN_SPACING = 4;
  for (let i = 0; i < CITIZEN_COUNT; i++) {
    const citizenTileX = spawnX + CITIZEN_OFFSET + i * CITIZEN_SPACING;
    const citizenSurfaceY = findSurfaceY(terrain, citizenTileX);
    createCitizen(
      world,
      entityLayer,
      citizenTileX * TILE_SIZE,
      (citizenSurfaceY - 2) * TILE_SIZE,
    );
  }

  // Register ECS systems
  world.registerSystem(createPlayerControlSystem(input));
  world.registerSystem(createMovementSystem(terrain));
  world.registerSystem(dayNightSystem);

  // Create and start game loop
  gameLoop = new GameLoop();

  // Fixed-step update
  gameLoop.registerSystem((dt) => {
    world.update(dt);
  });

  // Render step
  const renderSystem = createRenderSystem(camera);
  gameLoop.setRender((_interpolation) => {
    // Camera follows player
    const playerPos = world.getComponent<Position>(playerId, POSITION);
    if (playerPos) {
      camera.centerOn(playerPos.x, playerPos.y);
    }

    // Update sky color based on day/night cycle
    const { isDay, timeOfDay } = useGameStore.getState();
    if (isDay) {
      terrainRenderer.skyColor = 0x87ceeb; // day sky blue
    } else {
      // Lerp to dark blue at night
      const nightProgress = (timeOfDay - DAY_DURATION) / NIGHT_DURATION;
      const midNight = nightProgress < 0.5 ? nightProgress * 2 : (1 - nightProgress) * 2;
      const r = Math.floor(0x87 * (1 - midNight * 0.8));
      const g = Math.floor(0xce * (1 - midNight * 0.85));
      const b = Math.floor(0xeb * (1 - midNight * 0.5));
      terrainRenderer.skyColor = (r << 16) | (g << 8) | b;
    }

    // Update terrain tiles
    terrainRenderer.update();

    // Update entity sprites
    renderSystem(world, 0);
  });

  gameLoop.start();
}

export function cleanupGame(): void {
  gameLoop?.stop();
  gameLoop = null;
  input?.destroy();
  input = null;
  if (onResize) {
    window.removeEventListener("resize", onResize);
    onResize = null;
  }
  destroyPixiApp();
}
