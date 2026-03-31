import { Graphics, Container } from "pixi.js";
import { World } from "@/ecs/World";
import { POSITION } from "@/ecs/components/Position";
import { VELOCITY } from "@/ecs/components/Velocity";
import { SPRITE } from "@/ecs/components/SpriteComponent";
import { PLAYER } from "@/ecs/components/Player";
import { COLLIDER } from "@/ecs/components/Collider";
import { INVENTORY, createEmptyInventory } from "@/ecs/components/Inventory";
import { TILE_SIZE } from "@/constants/config";
import type { EntityId } from "@/ecs/types";

export function createPlayer(
  world: World,
  stage: Container,
  x: number,
  y: number,
): EntityId {
  const id = world.createEntity();

  world.addComponent(id, POSITION, { x, y });
  world.addComponent(id, VELOCITY, { vx: 0, vy: 0, onGround: false });
  world.addComponent(id, PLAYER, { selectedSlot: 0 });
  world.addComponent(id, COLLIDER, {
    offsetX: 2,
    offsetY: 0,
    width: TILE_SIZE - 4,
    height: TILE_SIZE * 2,
  });
  world.addComponent(id, INVENTORY, createEmptyInventory());

  // Placeholder character graphic: 16x32 blue rectangle
  const graphics = new Graphics();
  graphics.rect(0, 0, TILE_SIZE, TILE_SIZE * 2);
  graphics.fill(0x3366ff);
  stage.addChild(graphics);

  world.addComponent(id, SPRITE, {
    graphics,
    width: TILE_SIZE,
    height: TILE_SIZE * 2,
    color: 0x3366ff,
  });

  return id;
}
