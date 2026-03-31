import { create } from "zustand";
import { ResourceType } from "@/constants/resources";
import { FULL_CYCLE, DAY_DURATION } from "@/constants/config";

export interface GameState {
  /** Player resource counts */
  resources: Record<ResourceType, number>;

  /** Time of day in seconds (0 = dawn, wraps at FULL_CYCLE) */
  timeOfDay: number;

  /** Is it currently daytime? */
  isDay: boolean;

  /** Current world seed */
  seed: number;

  /** Update resource count */
  addResource: (type: ResourceType, amount: number) => void;

  /** Advance time by delta seconds */
  advanceTime: (dt: number) => void;

  /** Set seed */
  setSeed: (seed: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  resources: {
    [ResourceType.Wood]: 0,
    [ResourceType.Stone]: 0,
    [ResourceType.Iron]: 0,
  },
  timeOfDay: 0,
  isDay: true,
  seed: 42,

  addResource: (type, amount) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [type]: Math.max(0, state.resources[type] + amount),
      },
    })),

  advanceTime: (dt) =>
    set((state) => {
      const timeOfDay = (state.timeOfDay + dt) % FULL_CYCLE;
      return { timeOfDay, isDay: timeOfDay < DAY_DURATION };
    }),

  setSeed: (seed) => set({ seed }),
}));
