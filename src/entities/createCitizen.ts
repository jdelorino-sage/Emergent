import { Graphics, Container } from "pixi.js";
import { World } from "@/ecs/World";
import { POSITION } from "@/ecs/components/Position";
import { VELOCITY } from "@/ecs/components/Velocity";
import { SPRITE } from "@/ecs/components/SpriteComponent";
import { CITIZEN, type Citizen } from "@/ecs/components/Citizen";
import { COLLIDER } from "@/ecs/components/Collider";
import { TILE_SIZE } from "@/constants/config";
import type { EntityId } from "@/ecs/types";

const CITIZEN_NAMES = [
  "Ada", "Bjorn", "Cleo", "Dax", "Elara",
  "Finn", "Greta", "Hugo", "Iris", "Jonas",
];

let nameIndex = 0;

function randomTrait(): number {
  return Math.floor(Math.random() * 80) + 10; // 10-90
}

export function createCitizen(
  world: World,
  stage: Container,
  x: number,
  y: number,
): EntityId {
  const id = world.createEntity();
  const name = CITIZEN_NAMES[nameIndex % CITIZEN_NAMES.length]!;
  nameIndex++;

  const citizen: Citizen = {
    name,
    traits: {
      bravery: randomTrait(),
      diligence: randomTrait(),
      curiosity: randomTrait(),
    },
    currentTask: "idle",
  };

  world.addComponent(id, POSITION, { x, y });
  world.addComponent(id, VELOCITY, { vx: 0, vy: 0, onGround: false });
  world.addComponent(id, CITIZEN, citizen);
  world.addComponent(id, COLLIDER, {
    offsetX: 2,
    offsetY: 0,
    width: TILE_SIZE - 4,
    height: TILE_SIZE * 2,
  });

  // Placeholder citizen graphic: 16x32 green rectangle
  const color = 0x33aa55;
  const graphics = new Graphics();
  graphics.rect(0, 0, TILE_SIZE, TILE_SIZE * 2);
  graphics.fill(color);
  stage.addChild(graphics);

  world.addComponent(id, SPRITE, {
    graphics,
    width: TILE_SIZE,
    height: TILE_SIZE * 2,
    color,
  });

  return id;
}
