import { Application } from "pixi.js";
// Eagerly load browser environment extensions
import "pixi.js/browser";

let app: Application | null = null;

export async function createPixiApp(
  container: HTMLElement,
): Promise<Application> {
  if (app) return app;

  // Ensure the container has dimensions before PixiJS init
  // (position:absolute containers may report 0 on first frame)
  if (container.clientWidth === 0 || container.clientHeight === 0) {
    await new Promise((r) => requestAnimationFrame(r));
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  app = new Application();
  try {
    await app.init({
      width,
      height,
      backgroundColor: 0x87ceeb,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      preference: "webgl",
    });
  } catch (err) {
    app = null;
    throw new Error(
      `Failed to initialize PixiJS: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  container.appendChild(app.canvas);

  // Set up auto-resize on window resize
  const onResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    app?.renderer.resize(w, h);
  };
  window.addEventListener("resize", onResize);

  return app;
}

export function getPixiApp(): Application | null {
  return app;
}

export function destroyPixiApp(): void {
  if (app) {
    app.destroy(true);
    app = null;
  }
}
