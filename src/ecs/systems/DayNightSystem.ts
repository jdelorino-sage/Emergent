import type { World } from "@/ecs/World";
import { MS_PER_TICK } from "@/constants/config";
import { useGameStore } from "@/store/gameStore";

export function dayNightSystem(_world: World, _dt: number): void {
  const dtSeconds = MS_PER_TICK / 1000;
  useGameStore.getState().advanceTime(dtSeconds);
}
