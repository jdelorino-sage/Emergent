import { useGameStore } from "@/store/gameStore";
import { FULL_CYCLE } from "@/constants/config";

export function TimeDisplay() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const isDay = useGameStore((s) => s.isDay);

  const progress = timeOfDay / FULL_CYCLE;
  const hours = Math.floor(progress * 24) + 6; // 6am start
  const displayHour = ((hours - 1) % 12) + 1;
  const ampm = hours % 24 < 12 ? "AM" : "PM";

  return (
    <div
      style={{
        padding: "8px 16px",
        background: "rgba(0,0,0,0.6)",
        borderRadius: 4,
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 14,
        userSelect: "none",
      }}
    >
      {isDay ? "Day" : "Night"} {displayHour}:00 {ampm}
    </div>
  );
}
