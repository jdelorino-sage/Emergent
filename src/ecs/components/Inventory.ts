import { ResourceType } from "@/constants/resources";

export const INVENTORY = "inventory";

export type Inventory = Record<ResourceType, number>;

export function createEmptyInventory(): Inventory {
  return {
    [ResourceType.Wood]: 0,
    [ResourceType.Stone]: 0,
    [ResourceType.Iron]: 0,
  };
}
