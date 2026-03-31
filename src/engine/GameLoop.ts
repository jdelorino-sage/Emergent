import { MS_PER_TICK } from "@/constants/config";

export type SystemFn = (dt: number) => void;
export type RenderFn = (interpolation: number) => void;

export class GameLoop {
  private systems: SystemFn[] = [];
  private renderFn: RenderFn | null = null;
  private accumulator = 0;
  private lastTime = 0;
  private rafId = 0;
  private running = false;

  registerSystem(system: SystemFn): void {
    this.systems.push(system);
  }

  setRender(fn: RenderFn): void {
    this.renderFn = fn;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private loop = (now: number): void => {
    if (!this.running) return;

    const delta = Math.min(now - this.lastTime, 200); // cap to avoid spiral of death
    this.lastTime = now;
    this.accumulator += delta;

    while (this.accumulator >= MS_PER_TICK) {
      for (const system of this.systems) {
        system(MS_PER_TICK);
      }
      this.accumulator -= MS_PER_TICK;
    }

    const interpolation = this.accumulator / MS_PER_TICK;
    this.renderFn?.(interpolation);

    this.rafId = requestAnimationFrame(this.loop);
  };
}
