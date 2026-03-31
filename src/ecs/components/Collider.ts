export const COLLIDER = "collider";

/** AABB hitbox relative to entity Position */
export interface Collider {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}
