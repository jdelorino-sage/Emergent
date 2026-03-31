import { ResourceBar } from "./ResourceBar";
import { TimeDisplay } from "./TimeDisplay";

export function HUD() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 12,
          pointerEvents: "auto",
        }}
      >
        <ResourceBar />
        <TimeDisplay />
      </div>

      {/* Controls hint */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          padding: "8px 12px",
          background: "rgba(0,0,0,0.5)",
          borderRadius: 4,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "monospace",
          fontSize: 12,
          userSelect: "none",
        }}
      >
        WASD / Arrows: Move &amp; Jump
      </div>
    </div>
  );
}
