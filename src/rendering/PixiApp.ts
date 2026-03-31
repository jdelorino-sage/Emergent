import { Application } from "pixi.js";

let app: Application | null = null;

export async function createPixiApp(
  container: HTMLElement,
): Promise<Application> {
  if (app) return app;

  app = new Application();
  await app.init({
    resizeTo: container,
    backgroundColor: 0x87ceeb,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  container.appendChild(app.canvas);
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
