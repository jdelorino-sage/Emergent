/** World dimensions in tiles */
export const WORLD_WIDTH = 512;
export const WORLD_HEIGHT = 256;

/** Tile size in pixels */
export const TILE_SIZE = 16;

/** Surface level: tiles above this Y are air/sky, below are ground */
export const SURFACE_Y = 80;

/** Physics */
export const GRAVITY = 0.5;
export const MAX_FALL_SPEED = 12;
export const PLAYER_SPEED = 3;
export const PLAYER_JUMP_FORCE = -8;

/** Game loop */
export const TICKS_PER_SECOND = 60;
export const MS_PER_TICK = 1000 / TICKS_PER_SECOND;

/** Day/night cycle duration in seconds */
export const DAY_DURATION = 720; // 12 minutes
export const NIGHT_DURATION = 480; // 8 minutes
export const FULL_CYCLE = DAY_DURATION + NIGHT_DURATION;

/** Camera viewport buffer (extra tiles rendered outside viewport) */
export const CAMERA_BUFFER = 2;
