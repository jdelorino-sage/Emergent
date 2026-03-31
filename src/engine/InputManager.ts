export class InputManager {
  private keys = new Set<string>();
  private mouseX = 0;
  private mouseY = 0;
  private mouseDown = false;
  private rightMouseDown = false;
  private target: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    target.addEventListener("mousemove", this.onMouseMove);
    target.addEventListener("mousedown", this.onMouseDown);
    target.addEventListener("mouseup", this.onMouseUp);
    target.addEventListener("contextmenu", this.onContextMenu);
  }

  isKeyDown(key: string): boolean {
    return this.keys.has(key);
  }

  getMousePos(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  isMouseDown(): boolean {
    return this.mouseDown;
  }

  isRightMouseDown(): boolean {
    return this.rightMouseDown;
  }

  destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.target.removeEventListener("mousemove", this.onMouseMove);
    this.target.removeEventListener("mousedown", this.onMouseDown);
    this.target.removeEventListener("mouseup", this.onMouseUp);
    this.target.removeEventListener("contextmenu", this.onContextMenu);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.key);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.key);
  };

  private onMouseMove = (e: MouseEvent): void => {
    const rect = this.target.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (e.button === 0) this.mouseDown = true;
    if (e.button === 2) this.rightMouseDown = true;
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.mouseDown = false;
    if (e.button === 2) this.rightMouseDown = false;
  };

  private onContextMenu = (e: Event): void => {
    e.preventDefault();
  };
}
