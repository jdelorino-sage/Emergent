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
import { TILE_SIZE } from "@/constants/config";
import { useGameStore } from "@/store/gameStore";

let gameLoop: GameLoop | null = null;
let input: InputManager | null = null;

export async function initGame(container: HTMLElement): Promise<void> {
  const app = await createPixiApp(container);
  const seed = useGameStore.getState().seed;

  // Generate terrain
  const terrain = generateTerrain(seed);

  // Camera
  const camera = new Camera(app.screen.width, app.screen.height);

  // Handle resize
  const onResize = () => camera.resize(app.screen.width, app.screen.height);
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

  // Find a spawn point: middle of map, on the surface
  const spawnX = Math.floor(terrain.width / 2);
  let spawnY = 0;
  for (let y = 0; y < terrain.height; y++) {
    if (terrain.isSolid(spawnX, y)) {
      spawnY = y - 2; // 2 tiles above first solid block (player is 2 tiles tall)
      break;
    }
  }

  // Create player
  const playerId = createPlayer(
    world,
    entityLayer,
    spawnX * TILE_SIZE,
    spawnY * TILE_SIZE,
  );

  // Create 3 citizens near spawn
  for (let i = 0; i < 3; i++) {
    const cx = (spawnX + 3 + i * 4) * TILE_SIZE;
    let cy = 0;
    for (let y = 0; y < terrain.height; y++) {
      if (terrain.isSolid(spawnX + 3 + i * 4, y)) {
        cy = (y - 2) * TILE_SIZE;
        break;
      }
    }
    createCitizen(world, entityLayer, cx, cy);
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
  destroyPixiApp();
}
