export type RagStatus = "red" | "amber" | "green";

export type RoofType =
  | "Built-up felt"
  | "Single-ply membrane"
  | "Standing seam metal"
  | "Asphalt"
  | "Slate"
  | "Concrete tile"
  | "EPDM rubber"
  | "Green roof";

export interface RoofSection {
  id: string;
  buildingCode: string;
  sectionNumber: string;
  rag: RagStatus;
  areaSqm: number;
  forecastCostGbp: number;
  lifeRemainingYears: number;
  roofType: RoofType;
  polygon: [number, number][];
  labelPosition: [number, number];
}

export interface Building {
  code: string;
  name: string;
  sections: RoofSection[];
}

export interface AuditEntry {
  id: string;
  sectionId: string;
  buildingCode: string;
  timestamp: string;
  auditor: string;
  ragBefore: RagStatus;
  ragAfter: RagStatus;
  lifeRemainingYears: number;
  notes: string;
  area?: string;
}
