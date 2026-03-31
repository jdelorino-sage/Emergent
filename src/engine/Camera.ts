import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT } from "@/constants/config";

export class Camera {
  /** Camera position in world pixels (top-left corner of viewport) */
  x = 0;
  y = 0;
  width: number;
  height: number;

  constructor(viewportWidth: number, viewportHeight: number) {
    this.width = viewportWidth;
    this.height = viewportHeight;
  }

  /** Center the camera on a world position */
  centerOn(worldX: number, worldY: number): void {
    this.x = worldX - this.width / 2;
    this.y = worldY - this.height / 2;
    this.clamp();
  }

  /** Move camera by pixel delta */
  pan(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    this.clamp();
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.clamp();
  }

  /** Get visible tile range (inclusive) */
  getVisibleTileRange(): {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } {
    const startX = Math.max(0, Math.floor(this.x / TILE_SIZE) - 1);
    const startY = Math.max(0, Math.floor(this.y / TILE_SIZE) - 1);
    const endX = Math.min(
      WORLD_WIDTH - 1,
      Math.ceil((this.x + this.width) / TILE_SIZE) + 1,
    );
    const endY = Math.min(
      WORLD_HEIGHT - 1,
      Math.ceil((this.y + this.height) / TILE_SIZE) + 1,
    );
    return { startX, startY, endX, endY };
  }

  /** Convert world pixel coords to screen pixel coords */
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return { x: worldX - this.x, y: worldY - this.y };
  }

  /** Convert screen pixel coords to world pixel coords */
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return { x: screenX + this.x, y: screenY + this.y };
  }

  /** Convert screen pixel coords to tile coords */
  screenToTile(screenX: number, screenY: number): { tx: number; ty: number } {
    const world = this.screenToWorld(screenX, screenY);
    return {
      tx: Math.floor(world.x / TILE_SIZE),
      ty: Math.floor(world.y / TILE_SIZE),
    };
  }

  private clamp(): void {
    const maxX = WORLD_WIDTH * TILE_SIZE - this.width;
    const maxY = WORLD_HEIGHT * TILE_SIZE - this.height;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }
}
