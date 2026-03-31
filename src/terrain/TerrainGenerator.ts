import { createNoise2D } from "simplex-noise";
import { WORLD_WIDTH, WORLD_HEIGHT, SURFACE_Y } from "@/constants/config";
import { TileType } from "@/constants/tiles";
import { TerrainData } from "./TerrainData";

/** Seedable PRNG (mulberry32) */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateTerrain(seed: number = 42): TerrainData {
  const terrain = new TerrainData();
  const rng = mulberry32(seed);
  const noise = createNoise2D(rng);
  const caveNoise = createNoise2D(rng);
  const oreNoise = createNoise2D(rng);

  for (let x = 0; x < WORLD_WIDTH; x++) {
    // Surface height: base + large hills + small variation
    const hill = noise(x * 0.005, 0) * 25;
    const detail = noise(x * 0.03, 100) * 6;
    const surfaceY = Math.floor(SURFACE_Y + hill + detail);

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (y < surfaceY) {
        // Sky
        terrain.setTile(x, y, TileType.Air);
      } else if (y === surfaceY) {
        // Surface layer
        terrain.setTile(x, y, TileType.Grass);
      } else if (y < surfaceY + 5) {
        // Shallow dirt
        terrain.setTile(x, y, TileType.Dirt);
      } else if (y >= WORLD_HEIGHT - 3) {
        // Bedrock at bottom
        terrain.setTile(x, y, TileType.Bedrock);
      } else {
        // Stone with caves and ores
        const depth = y - surfaceY;
        const caveVal = caveNoise(x * 0.04, y * 0.04);
        const caveVal2 = caveNoise(x * 0.08, y * 0.08);

        // Caves: interconnected tunnels
        if (caveVal > 0.45 && caveVal2 > 0.1 && depth > 10) {
          terrain.setTile(x, y, TileType.Air);
        } else {
          // Iron ore veins
          const oreVal = oreNoise(x * 0.1, y * 0.1);
          if (oreVal > 0.7 && depth > 15) {
            terrain.setTile(x, y, TileType.IronOre);
          } else {
            terrain.setTile(x, y, TileType.Stone);
          }
        }
      }
    }

    // Trees on surface
    if (rng() < 0.08 && surfaceY > 10) {
      const treeHeight = 4 + Math.floor(rng() * 3);
      for (let ty = 1; ty <= treeHeight; ty++) {
        terrain.setTile(x, surfaceY - ty, TileType.Wood);
      }
      // Leaf canopy
      for (let lx = -2; lx <= 2; lx++) {
        for (let ly = treeHeight; ly <= treeHeight + 2; ly++) {
          if (Math.abs(lx) + (ly - treeHeight) <= 3) {
            const tx = x + lx;
            const ty = surfaceY - ly;
            if (terrain.getTile(tx, ty) === TileType.Air) {
              terrain.setTile(tx, ty, TileType.Leaves);
            }
          }
        }
      }
    }
  }

  return terrain;
}
