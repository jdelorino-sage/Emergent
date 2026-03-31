import { useGameStore } from "@/store/gameStore";
import { ResourceType, RESOURCE_DISPLAY } from "@/constants/resources";

export function ResourceBar() {
  const resources = useGameStore((s) => s.resources);

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "8px 16px",
        background: "rgba(0,0,0,0.6)",
        borderRadius: 4,
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 14,
        userSelect: "none",
      }}
    >
      {Object.values(ResourceType).map((type) => {
        const info = RESOURCE_DISPLAY[type];
        return (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: info.color,
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
            <span>
              {info.name}: {resources[type]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
