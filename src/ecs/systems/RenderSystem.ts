import type { World } from "@/ecs/World";
import { POSITION, type Position } from "@/ecs/components/Position";
import { SPRITE, type SpriteComponent } from "@/ecs/components/SpriteComponent";
import type { Camera } from "@/engine/Camera";

export function createRenderSystem(camera: Camera) {
  return (_world: World, _dt: number): void => {
    const entities = _world.queryAll(POSITION, SPRITE);
    for (const id of entities) {
      const pos = _world.getComponent<Position>(id, POSITION)!;
      const sprite = _world.getComponent<SpriteComponent>(id, SPRITE)!;
      const screen = camera.worldToScreen(pos.x, pos.y);
      sprite.graphics.x = screen.x;
      sprite.graphics.y = screen.y;
    }
  };
}
