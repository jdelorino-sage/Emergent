import type { Graphics } from "pixi.js";

export const SPRITE = "sprite";

export interface SpriteComponent {
  graphics: Graphics;
  width: number;
  height: number;
  color: number;
}
