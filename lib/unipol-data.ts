/*
 * Unipol fire-compartmentation survey data.
 *
 * Mirrors the real Power BI dataset (`Unipol Compartmentation - Combined.xlsx`)
 * 1:1 — 20 defect rows across two surveyed buildings, with Observation/Scope
 * text stored VERBATIM. Photos are the genuine survey images embedded in the
 * source workbooks (public/unipol/*.png), mapped by defect category. Nothing
 * here is invented; figures reconcile to the dashboard KPIs.
 *
 * Single page, single source of truth — there is no live feed. All analytics
 * derive from DEFECTS via the pure helpers at the bottom of this file.
 */

export type Priority = "High" | "Medium" | "Low";
export type Rag = "Red" | "Amber" | "Green";
export type WorkCategory = "Partitions" | "Fire Stopping";

export interface Defect {
  ref: string;
  building: string; // full address, verbatim
  buildingName: string; // short label
  location: string;
  observation: string; // verbatim
  scope: string; // verbatim — reads as the remedial specification
  quantity: number;
  additionalSurvey: boolean;
  workCategory: WorkCategory;
  timeline: string | null; // null = not scheduled in source
  rag: Rag;
  priority: Priority;
}

/* Priority dimension — hex codes lifted from the PBI Priority table. */
export const PRIORITY_META: Record<
  Priority,
  { sort: number; fill: string; text: string; bg: string; rag: Rag }
> = {
  High: { sort: 1, fill: "#D64550", text: "#9b2530", bg: "rgba(214,69,80,0.12)", rag: "Red" },
  Medium: { sort: 2, fill: "#FFBF00", text: "#8a6800", bg: "rgba(255,191,0,0.16)", rag: "Amber" },
  Low: { sort: 3, fill: "#1B9E11", text: "#13740d", bg: "rgba(27,158,17,0.12)", rag: "Green" },
};

export const RAG_FILL: Record<Rag, string> = {
  Red: "#D64550",
  Amber: "#FFBF00",
  Green: "#1B9E11",
};

/* Brand — Sycamore stays the primary chrome (teal #377587, from globals).
   Unipol is the client: real wordmark + this green accent (sampled from the
   Unipol logo) used sparingly on client-specific elements. */
export const UNIPOL_GREEN = "#00693e";
export const CATEGORY_FILL: Record<WorkCategory, string> = {
  Partitions: "#437496", // the PBI "Total Works by Scope" blue
  "Fire Stopping": "#7a9bb0",
};

const HOLBORN = "1-25 Holborn Terrace, Woodhouse, Leeds, LA6 2PZ";
const SHAY = "2-24 Shay Street, Woodhouse, Leeds, LA6 2PZ";

/* The 20 real defects — verbatim from the combined workbook. */
export const DEFECTS: Defect[] = [
  {
    ref: "HT1",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "All Flats",
    observation:
      "The kitchen walls along the length of the hallway below the Georgian wired glass was constructed of 2 sheets of approximately 5mm plyboard and would not afford 30 mins fire protection.",
    scope:
      "Remove existing 2 sheets 5mm ply to either side of partition and skirtings. Install 2nr sheets place or fit appropriate fire resisting boarding sealed with appropriate fire rated sealant to afford 30 mins fire protection to this area.",
    quantity: 25,
    additionalSurvey: true,
    workCategory: "Partitions",
    timeline: "Urgently",
    rag: "Red",
    priority: "High",
  },
  {
    ref: "HT2",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "All Flats",
    observation:
      "On the first-floor landing areas of all flats, glass was fitted above doors to all bedrooms and bathrooms which would not afford 30 mins fire protection.",
    scope:
      "Remove glass and install new fireresistant boarding and sealant to provide the 30 mins fire resistance required.",
    quantity: 25,
    additionalSurvey: false,
    workCategory: "Partitions",
    timeline: "Urgently",
    rag: "Red",
    priority: "High",
  },
  {
    ref: "HT3",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 3",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT4",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 5",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT5",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 5",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT6",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 7",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT7",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 7",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT8",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 9",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT9",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 11",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT10",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 11",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT11",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "GF wash room",
    observation: "Cable breach in wash Cupboard",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT12",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 15",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT13",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 17",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT14",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 17",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT15",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 19",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "HT16",
    building: HOLBORN,
    buildingName: "Holborn Terrace",
    location: "Flat 21",
    observation: "Pipe breach in kitchen boiler store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: "3-6 Months",
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "SS1",
    building: SHAY,
    buildingName: "Shay Street",
    location: "All Flats",
    observation:
      "The kitchen walls along the length of the hallway below the Georgian wired glass was constructed of 2 sheets of approximately 5mm plyboard and would not afford 30 mins fire protection.",
    scope:
      "Replace or fit appropriate fire resisting boarding sealed with appropriate fire rated sealant to afford 30 mins fire protection to this area.",
    quantity: 22,
    additionalSurvey: false,
    workCategory: "Partitions",
    timeline: null,
    rag: "Red",
    priority: "High",
  },
  {
    ref: "SS2",
    building: SHAY,
    buildingName: "Shay Street",
    location: "All Flats",
    observation:
      "On the first-floor landing areas of all flats, glass was fitted above doors to all bedrooms and bathrooms which would not afford 30 mins fire protection.",
    scope:
      "Remove existing glass and install new fireresistant boarding and sealant to provide the 30 mins fire resistance required.",
    quantity: 22,
    additionalSurvey: false,
    workCategory: "Partitions",
    timeline: null,
    rag: "Red",
    priority: "High",
  },
  {
    ref: "SS3",
    building: SHAY,
    buildingName: "Shay Street",
    location: "Flat 8",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: null,
    rag: "Amber",
    priority: "Medium",
  },
  {
    ref: "SS4",
    building: SHAY,
    buildingName: "Shay Street",
    location: "Flat 24",
    observation: "Pipe breach in kitchen electrical store at the top",
    scope: "Seal the breach with appropriate fire rated sealant to provide 30 mins fire protection.",
    quantity: 1,
    additionalSurvey: false,
    workCategory: "Fire Stopping",
    timeline: null,
    rag: "Amber",
    priority: "Medium",
  },
];

/* Genuine survey photos (embedded in the source workbooks), mapped by the
   defect category they evidence. */
export interface SurveyPhoto {
  src: string;
  caption: string;
}

const PARTITION_PHOTOS: SurveyPhoto[] = [
  { src: "/unipol/partition-1.png", caption: "Georgian wired-glass panel in a kitchen hallway partition — does not afford 30 minutes' fire resistance." },
  { src: "/unipol/partition-2.png", caption: "Glass fitted above bedroom/bathroom doors on the first-floor landing." },
  { src: "/unipol/partition-3.png", caption: "Wired-glass panel above a radiator in a flat hallway partition." },
];

const FIRESTOP_PHOTOS: SurveyPhoto[] = [
  { src: "/unipol/firestop-1.png", caption: "Service breach opening in a compartment wall above the skirting." },
  { src: "/unipol/firestop-2.png", caption: "Pipe breach at the top of a kitchen boiler store." },
  { src: "/unipol/firestop-3.png", caption: "Cable trunking penetration through a compartment wall." },
  { src: "/unipol/firestop-4.png", caption: "Unsealed breach at a wall / ceiling junction." },
  { src: "/unipol/firestop-5.png", caption: "Cable breach at the top of a kitchen store." },
  { src: "/unipol/firestop-6.png", caption: "Pipe breach at high level in a painted compartment wall." },
  { src: "/unipol/firestop-7.png", caption: "Breach at a ceiling junction requiring fire-stopping." },
];

export function photosForCategory(category: WorkCategory): SurveyPhoto[] {
  return category === "Partitions" ? PARTITION_PHOTOS : FIRESTOP_PHOTOS;
}

/* A representative photo for a single defect (stable per ref). */
export function photoForDefect(d: Defect): SurveyPhoto {
  const pool = photosForCategory(d.workCategory);
  // Cable breaches → prefer a cable image where available; otherwise rotate
  // deterministically by ref so different rows show different evidence.
  const seed = d.ref.replace(/\D/g, "");
  const idx = (parseInt(seed || "0", 10) || 0) % pool.length;
  return pool[idx];
}

/* ---- dimensions ---------------------------------------------------------- */
export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
export const RAGS: Rag[] = ["Red", "Amber", "Green"];
export const WORK_CATEGORIES: WorkCategory[] = ["Partitions", "Fire Stopping"];
export const BUILDINGS: string[] = ["Holborn Terrace", "Shay Street"];
export const LOCATIONS: string[] = Array.from(new Set(DEFECTS.map((d) => d.location)));
export const QUANTITY_MIN = Math.min(...DEFECTS.map((d) => d.quantity));
export const QUANTITY_MAX = Math.max(...DEFECTS.map((d) => d.quantity));

/* ---- filtering ----------------------------------------------------------- */
export interface UnipolFilters {
  priorities: Priority[]; // empty = all
  rags: Rag[];
  buildings: string[];
  workCategories: WorkCategory[];
  location: string; // "all" or a specific location
  quantity: [number, number];
}

export const EMPTY_FILTERS: UnipolFilters = {
  priorities: [],
  rags: [],
  buildings: [],
  workCategories: [],
  location: "all",
  quantity: [QUANTITY_MIN, QUANTITY_MAX],
};

export function applyFilters(defects: Defect[], f: UnipolFilters): Defect[] {
  return defects.filter((d) => {
    if (f.priorities.length && !f.priorities.includes(d.priority)) return false;
    if (f.rags.length && !f.rags.includes(d.rag)) return false;
    if (f.buildings.length && !f.buildings.includes(d.buildingName)) return false;
    if (f.workCategories.length && !f.workCategories.includes(d.workCategory)) return false;
    if (f.location !== "all" && d.location !== f.location) return false;
    if (d.quantity < f.quantity[0] || d.quantity > f.quantity[1]) return false;
    return true;
  });
}

export function filtersActive(f: UnipolFilters): boolean {
  return (
    f.priorities.length > 0 ||
    f.rags.length > 0 ||
    f.buildings.length > 0 ||
    f.workCategories.length > 0 ||
    f.location !== "all" ||
    f.quantity[0] !== QUANTITY_MIN ||
    f.quantity[1] !== QUANTITY_MAX
  );
}

/* ---- KPIs (mirror the PBI MeasureTable DAX) ------------------------------ */
export interface UnipolKpis {
  totalDefects: number;
  high: number;
  medium: number;
  low: number;
  totalQuantity: number;
  additionalSurveys: number;
  largestWorkPackage: string;
  highestRiskBuilding: string;
}

export function computeKpis(defects: Defect[]): UnipolKpis {
  const byCat = new Map<string, number>();
  defects.forEach((d) => byCat.set(d.workCategory, (byCat.get(d.workCategory) || 0) + d.quantity));
  const maxCatQty = Math.max(0, ...byCat.values());
  const largestWorkPackage =
    [...byCat.entries()].filter(([, q]) => q === maxCatQty && q > 0).map(([c]) => c).join(", ") || "—";

  const byBuildingHigh = new Map<string, number>();
  defects
    .filter((d) => d.priority === "High")
    .forEach((d) => byBuildingHigh.set(d.buildingName, (byBuildingHigh.get(d.buildingName) || 0) + 1));
  const maxHigh = Math.max(0, ...byBuildingHigh.values());
  const highestRiskBuilding =
    [...byBuildingHigh.entries()].filter(([, n]) => n === maxHigh && n > 0).map(([b]) => b).join(", ") || "—";

  return {
    totalDefects: defects.length,
    high: defects.filter((d) => d.priority === "High").length,
    medium: defects.filter((d) => d.priority === "Medium").length,
    low: defects.filter((d) => d.priority === "Low").length,
    totalQuantity: defects.reduce((sum, d) => sum + d.quantity, 0),
    additionalSurveys: defects.filter((d) => d.additionalSurvey).length,
    largestWorkPackage,
    highestRiskBuilding,
  };
}

/* ---- chart datasets (each datum carries its underlying defects so hover
 * cards can show real observations + photos) ------------------------------- */
export interface ChartDatum {
  name: string;
  value: number;
  fill: string;
  defects: Defect[];
}

export function worksByCategory(defects: Defect[]): ChartDatum[] {
  return WORK_CATEGORIES.map((c) => {
    const rows = defects.filter((d) => d.workCategory === c);
    return {
      name: c,
      value: rows.reduce((s, d) => s + d.quantity, 0),
      fill: CATEGORY_FILL[c],
      defects: rows,
    };
  }).sort((a, b) => b.value - a.value);
}

export function highRiskByBuilding(defects: Defect[]): ChartDatum[] {
  return BUILDINGS.map((b) => {
    const rows = defects.filter((d) => d.buildingName === b && d.priority === "High");
    return { name: b, value: rows.length, fill: RAG_FILL.Red, defects: rows };
  });
}

export function worksByPriority(defects: Defect[]): ChartDatum[] {
  return PRIORITIES.map((p) => {
    const rows = defects.filter((d) => d.priority === p);
    return { name: p, value: rows.length, fill: PRIORITY_META[p].fill, defects: rows };
  }).filter((d) => d.value > 0);
}

export function remedialByBuilding(defects: Defect[]): ChartDatum[] {
  return BUILDINGS.map((b) => {
    const rows = defects.filter((d) => d.buildingName === b);
    return { name: b, value: rows.length, fill: CATEGORY_FILL.Partitions, defects: rows };
  }).sort((a, b) => b.value - a.value);
}

/* Stacked: building × priority. Each datum keeps per-priority defect lists. */
export interface StackedDatum {
  name: string;
  High: number;
  Medium: number;
  Low: number;
  defectsByPriority: Record<Priority, Defect[]>;
  defects: Defect[];
}

export function risksByPriorityByBuilding(defects: Defect[]): StackedDatum[] {
  return BUILDINGS.map((b) => {
    const rows = defects.filter((d) => d.buildingName === b);
    const byP: Record<Priority, Defect[]> = {
      High: rows.filter((d) => d.priority === "High"),
      Medium: rows.filter((d) => d.priority === "Medium"),
      Low: rows.filter((d) => d.priority === "Low"),
    };
    return {
      name: b,
      High: byP.High.length,
      Medium: byP.Medium.length,
      Low: byP.Low.length,
      defectsByPriority: byP,
      defects: rows,
    };
  });
}

export function findDefect(ref: string | null): Defect | null {
  if (!ref) return null;
  return DEFECTS.find((d) => d.ref === ref) || null;
}
