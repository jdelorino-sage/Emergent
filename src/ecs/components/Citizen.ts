export const CITIZEN = "citizen";

/** Simplified Phase 1 citizen with 3 traits */
export interface Citizen {
  name: string;
  traits: {
    bravery: number; // 1-100
    diligence: number; // 1-100
    curiosity: number; // 1-100
  };
  currentTask: "idle" | "gather" | "build";
}
