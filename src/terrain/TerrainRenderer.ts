import { Container, Graphics } from "pixi.js";
import { TILE_SIZE } from "@/constants/config";
import { TileType, TILE_PROPS } from "@/constants/tiles";
import type { Camera } from "@/engine/Camera";
import type { TerrainData } from "./TerrainData";

interface TileSprite {
  graphics: Graphics;
  tileX: number;
  tileY: number;
  tileType: TileType;
}

export class TerrainRenderer {
  readonly container: Container;
  private terrain: TerrainData;
  private camera: Camera;
  private pool: TileSprite[] = [];
  private active = new Map<string, TileSprite>();

  /** Sky background color — updated by day/night cycle */
  skyColor = 0x87ceeb;
  private lastSkyColor = 0x87ceeb;

  constructor(terrain: TerrainData, camera: Camera) {
    this.container = new Container();
    this.terrain = terrain;
    this.camera = camera;
  }

  update(): void {
    // If sky color changed, force redraw of air tiles
    const skyChanged = this.skyColor !== this.lastSkyColor;
    if (skyChanged) {
      this.lastSkyColor = this.skyColor;
      for (const sprite of this.active.values()) {
        if (sprite.tileType === TileType.Air) {
          this.drawTile(sprite.graphics, TileType.Air);
        }
      }
    }

    const { startX, startY, endX, endY } = this.camera.getVisibleTileRange();

    // Mark tiles that are no longer visible for recycling
    const keysToRemove: string[] = [];
    for (const [key, sprite] of this.active) {
      if (
        sprite.tileX < startX ||
        sprite.tileX > endX ||
        sprite.tileY < startY ||
        sprite.tileY > endY
      ) {
        sprite.graphics.visible = false;
        this.pool.push(sprite);
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      this.active.delete(key);
    }

    // Add/update visible tiles
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const tileType = this.terrain.getTile(x, y);
        const key = `${x},${y}`;
        const existing = this.active.get(key);

        if (existing) {
          // Update position for camera movement
          existing.graphics.x = x * TILE_SIZE - this.camera.x;
          existing.graphics.y = y * TILE_SIZE - this.camera.y;

          // Re-draw if tile changed (e.g., mined)
          if (existing.tileType !== tileType) {
            this.drawTile(existing.graphics, tileType);
            existing.tileType = tileType;
          }
          continue;
        }

        // Get or create a tile sprite
        const sprite = this.pool.pop() ?? this.createTileSprite();
        sprite.tileX = x;
        sprite.tileY = y;
        sprite.tileType = tileType;
        sprite.graphics.visible = true;
        sprite.graphics.x = x * TILE_SIZE - this.camera.x;
        sprite.graphics.y = y * TILE_SIZE - this.camera.y;
        this.drawTile(sprite.graphics, tileType);
        this.active.set(key, sprite);
      }
    }
  }

  private createTileSprite(): TileSprite {
    const graphics = new Graphics();
    this.container.addChild(graphics);
    return { graphics, tileX: -1, tileY: -1, tileType: TileType.Air };
  }

  private drawTile(g: Graphics, type: TileType): void {
    g.clear();
    if (type === TileType.Air) {
      // Draw sky color for air tiles
      g.rect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fill(this.skyColor);
    } else {
      const props = TILE_PROPS[type];
      g.rect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fill(props.color);
    }
  }
}
