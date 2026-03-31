import { useRef, useEffect, useState } from "react";
import { HUD } from "@/ui/HUD";
import { initGame, cleanupGame } from "@/Game";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms / 1000}s`)),
      ms,
    );
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || initialized.current) return;
    initialized.current = true;

    withTimeout(initGame(el, setStatus), 15000, "Game initialization")
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: 18,
            gap: 12,
            zIndex: 20,
          }}
        >
          <div>Loading EMERGENT...</div>
          <div style={{ fontSize: 12, color: "#888" }}>{status}</div>
        </div>
      ) : (
        <HUD />
      )}
    </div>
  );
}
