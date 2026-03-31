export enum TileType {
  Air = 0,
  Grass = 1,
  Dirt = 2,
  Stone = 3,
  IronOre = 4,
  Wood = 5, // tree trunk
  Leaves = 6,
  Water = 7,
  Sand = 8,
  Bedrock = 9,
}

export interface TileProperties {
  solid: boolean;
  mineable: boolean;
  color: number; // hex color for placeholder rendering
  hardness: number; // ticks to mine (0 = instant)
}

export const TILE_PROPS: Record<TileType, TileProperties> = {
  [TileType.Air]: { solid: false, mineable: false, color: 0x87ceeb, hardness: 0 },
  [TileType.Grass]: { solid: true, mineable: true, color: 0x4a8c3f, hardness: 15 },
  [TileType.Dirt]: { solid: true, mineable: true, color: 0x8b6914, hardness: 10 },
  [TileType.Stone]: { solid: true, mineable: true, color: 0x808080, hardness: 30 },
  [TileType.IronOre]: { solid: true, mineable: true, color: 0xb87333, hardness: 45 },
  [TileType.Wood]: { solid: true, mineable: true, color: 0x6b4226, hardness: 12 },
  [TileType.Leaves]: { solid: false, mineable: true, color: 0x2d6e2d, hardness: 5 },
  [TileType.Water]: { solid: false, mineable: false, color: 0x2266aa, hardness: 0 },
  [TileType.Sand]: { solid: true, mineable: true, color: 0xc2b280, hardness: 8 },
  [TileType.Bedrock]: { solid: true, mineable: false, color: 0x1a1a1a, hardness: 0 },
};
