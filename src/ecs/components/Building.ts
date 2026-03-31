export const BUILDING = "building";

export enum BuildingType {
  Shelter = "shelter",
  Storage = "storage",
  Workshop = "workshop",
  Farm = "farm",
  Wall = "wall",
}

export interface Building {
  type: BuildingType;
  health: number;
  maxHealth: number;
  built: boolean; // false = under construction
}
