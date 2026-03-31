import type { World } from "@/ecs/World";
import { PLAYER } from "@/ecs/components/Player";
import { VELOCITY, type Velocity } from "@/ecs/components/Velocity";
import { PLAYER_SPEED, PLAYER_JUMP_FORCE } from "@/constants/config";
import type { InputManager } from "@/engine/InputManager";

export function createPlayerControlSystem(input: InputManager) {
  return (world: World, _dt: number): void => {
    const players = world.queryAll(PLAYER, VELOCITY);
    for (const id of players) {
      const vel = world.getComponent<Velocity>(id, VELOCITY)!;

      // Horizontal movement
      vel.vx = 0;
      if (input.isKeyDown("a") || input.isKeyDown("A") || input.isKeyDown("ArrowLeft")) {
        vel.vx = -PLAYER_SPEED;
      }
      if (input.isKeyDown("d") || input.isKeyDown("D") || input.isKeyDown("ArrowRight")) {
        vel.vx = PLAYER_SPEED;
      }

      // Jump
      if (
        (input.isKeyDown("w") || input.isKeyDown("W") || input.isKeyDown(" ") || input.isKeyDown("ArrowUp")) &&
        vel.onGround
      ) {
        vel.vy = PLAYER_JUMP_FORCE;
      }
    }
  };
}
