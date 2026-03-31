export enum ResourceType {
  Wood = "wood",
  Stone = "stone",
  Iron = "iron",
}

export const RESOURCE_DISPLAY: Record<ResourceType, { name: string; color: string }> = {
  [ResourceType.Wood]: { name: "Wood", color: "#6b4226" },
  [ResourceType.Stone]: { name: "Stone", color: "#808080" },
  [ResourceType.Iron]: { name: "Iron", color: "#b87333" },
};
