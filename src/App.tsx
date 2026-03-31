import { useRef, useEffect, useState } from "react";
import { HUD } from "@/ui/HUD";
import { initGame, cleanupGame } from "@/Game";

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || initialized.current) return;
    initialized.current = true;

    initGame(el)
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Game init failed:", err);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

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
      {error ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff4444",
            fontFamily: "monospace",
            fontSize: 16,
            padding: 32,
            textAlign: "center",
            background: "rgba(0,0,0,0.8)",
            zIndex: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 24, marginBottom: 16 }}>Failed to start game</div>
            <div>{error}</div>
          </div>
        </div>
      ) : loading ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: 18,
            zIndex: 20,
          }}
        >
          Loading EMERGENT...
        </div>
      ) : (
        <HUD />
      )}
    </div>
  );
}
