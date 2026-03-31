import type { World } from "@/ecs/World";
import { POSITION, type Position } from "@/ecs/components/Position";
import { VELOCITY, type Velocity } from "@/ecs/components/Velocity";
import { COLLIDER, type Collider } from "@/ecs/components/Collider";
import { GRAVITY, MAX_FALL_SPEED, TILE_SIZE } from "@/constants/config";
import type { TerrainData } from "@/terrain/TerrainData";

export function createMovementSystem(terrain: TerrainData) {
  return (world: World, _dt: number): void => {
    const entities = world.queryAll(POSITION, VELOCITY);
    for (const id of entities) {
      const pos = world.getComponent<Position>(id, POSITION)!;
      const vel = world.getComponent<Velocity>(id, VELOCITY)!;
      const col = world.getComponent<Collider>(id, COLLIDER);

      // Apply gravity
      vel.vy = Math.min(vel.vy + GRAVITY, MAX_FALL_SPEED);
      vel.onGround = false;

      if (col) {
        // Resolve horizontal movement
        const newX = pos.x + vel.vx;
        if (!collidesWithTerrain(terrain, newX, pos.y, col)) {
          pos.x = newX;
        } else {
          vel.vx = 0;
        }

        // Resolve vertical movement
        const newY = pos.y + vel.vy;
        if (!collidesWithTerrain(terrain, pos.x, newY, col)) {
          pos.y = newY;
        } else {
          if (vel.vy > 0) {
            vel.onGround = true;
            // Snap to ground
            const feetY = pos.y + col.offsetY + col.height;
            const tileBelow = Math.floor(feetY / TILE_SIZE) + 1;
            pos.y = tileBelow * TILE_SIZE - col.offsetY - col.height;
          }
          vel.vy = 0;
        }
      } else {
        pos.x += vel.vx;
        pos.y += vel.vy;
      }
    }
  };
}

function collidesWithTerrain(
  terrain: TerrainData,
  x: number,
  y: number,
  col: Collider,
): boolean {
  const left = Math.floor((x + col.offsetX) / TILE_SIZE);
  const right = Math.floor((x + col.offsetX + col.width - 0.01) / TILE_SIZE);
  const top = Math.floor((y + col.offsetY) / TILE_SIZE);
  const bottom = Math.floor((y + col.offsetY + col.height - 0.01) / TILE_SIZE);

  for (let ty = top; ty <= bottom; ty++) {
    for (let tx = left; tx <= right; tx++) {
      if (terrain.isSolid(tx, ty)) return true;
    }
  }
  return false;
}
