import { useRef, useEffect } from "react";
import { HUD } from "@/ui/HUD";
import { initGame, cleanupGame } from "@/Game";

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || initialized.current) return;
    initialized.current = true;

    initGame(el);

    return () => {
      cleanupGame();
      initialized.current = false;
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <HUD />
    </div>
  );
}
