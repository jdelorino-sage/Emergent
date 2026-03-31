import { WORLD_WIDTH, WORLD_HEIGHT } from "@/constants/config";
import { TileType } from "@/constants/tiles";

export class TerrainData {
  readonly width = WORLD_WIDTH;
  readonly height = WORLD_HEIGHT;
  private tiles: Uint8Array;

  constructor() {
    this.tiles = new Uint8Array(this.width * this.height);
  }

  getTile(x: number, y: number): TileType {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return TileType.Bedrock;
    }
    return this.tiles[y * this.width + x] as TileType;
  }

  setTile(x: number, y: number, type: TileType): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.tiles[y * this.width + x] = type;
  }

  isSolid(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile !== TileType.Air && tile !== TileType.Water && tile !== TileType.Leaves;
  }
}
