import type { Building, RagStatus, RoofType } from "./types";
import { IMAGE_HEIGHT } from "./utils";

/**
 * Polygon coordinates are in Leaflet CRS.Simple space: [lat, lng] where
 * lat = IMAGE_HEIGHT - pixelY and lng = pixelX. So (0, 0) is bottom-left
 * and (IMAGE_HEIGHT, IMAGE_WIDTH) is top-right. The polygon editor lets the
 * client refine these by tracing over the campus image.
 */

function py(pixelY: number) {
  return IMAGE_HEIGHT - pixelY;
}

// Helper to make a rectangle from pixel x,y,w,h
function rect(x: number, y: number, w: number, h: number): [number, number][] {
  return [
    [py(y), x],
    [py(y), x + w],
    [py(y + h), x + w],
    [py(y + h), x],
  ];
}

function center(x: number, y: number, w: number, h: number): [number, number] {
  return [py(y + h / 2), x + w / 2];
}

interface SectionSeed {
  rag: RagStatus;
  area: number;
  cost: number;
  life: number;
  roofType: RoofType;
  pos: { x: number; y: number; w: number; h: number };
}

interface BuildingSeed {
  code: string;
  name: string;
  sections: SectionSeed[];
}

const SEED: BuildingSeed[] = [
  {
    code: "PSW",
    name: "Phoenix South West",
    sections: [
      { rag: "red", area: 220, cost: 380000, life: 3, roofType: "Built-up felt", pos: { x: 130, y: 110, w: 90, h: 60 } },
      { rag: "red", area: 195, cost: 340000, life: 2, roofType: "Built-up felt", pos: { x: 222, y: 110, w: 75, h: 60 } },
      { rag: "red", area: 180, cost: 310000, life: 4, roofType: "Asphalt", pos: { x: 130, y: 172, w: 90, h: 50 } },
      { rag: "amber", area: 160, cost: 170000, life: 8, roofType: "Single-ply membrane", pos: { x: 222, y: 172, w: 75, h: 50 } },
    ],
  },
  {
    code: "WOR",
    name: "Worsley building",
    sections: [
      { rag: "amber", area: 165, cost: 155000, life: 9, roofType: "Single-ply membrane", pos: { x: 70, y: 250, w: 70, h: 55 } },
      { rag: "amber", area: 175, cost: 165000, life: 8, roofType: "Single-ply membrane", pos: { x: 142, y: 250, w: 70, h: 55 } },
      { rag: "amber", area: 150, cost: 145000, life: 10, roofType: "Asphalt", pos: { x: 70, y: 307, w: 70, h: 50 } },
      { rag: "amber", area: 170, cost: 160000, life: 9, roofType: "Single-ply membrane", pos: { x: 142, y: 307, w: 70, h: 50 } },
      { rag: "amber", area: 155, cost: 150000, life: 11, roofType: "Asphalt", pos: { x: 70, y: 359, w: 142, h: 45 } },
    ],
  },
  {
    code: "CHC",
    name: "Chesham C block",
    sections: [
      { rag: "red", area: 175, cost: 320000, life: 3, roofType: "Built-up felt", pos: { x: 360, y: 120, w: 70, h: 55 } },
      { rag: "red", area: 165, cost: 305000, life: 2, roofType: "Built-up felt", pos: { x: 432, y: 120, w: 70, h: 55 } },
      { rag: "red", area: 190, cost: 360000, life: 3, roofType: "Asphalt", pos: { x: 360, y: 177, w: 70, h: 50 } },
      { rag: "red", area: 170, cost: 315000, life: 4, roofType: "Built-up felt", pos: { x: 432, y: 177, w: 70, h: 50 } },
      { rag: "red", area: 155, cost: 285000, life: 4, roofType: "Asphalt", pos: { x: 360, y: 229, w: 70, h: 50 } },
      { rag: "amber", area: 145, cost: 130000, life: 9, roofType: "Single-ply membrane", pos: { x: 432, y: 229, w: 70, h: 50 } },
      { rag: "amber", area: 150, cost: 140000, life: 10, roofType: "Single-ply membrane", pos: { x: 360, y: 281, w: 142, h: 42 } },
    ],
  },
  {
    code: "SCE",
    name: "Science building",
    sections: [
      { rag: "amber", area: 195, cost: 180000, life: 11, roofType: "Single-ply membrane", pos: { x: 540, y: 200, w: 90, h: 55 } },
      { rag: "amber", area: 175, cost: 160000, life: 10, roofType: "Single-ply membrane", pos: { x: 632, y: 200, w: 90, h: 55 } },
      { rag: "amber", area: 180, cost: 170000, life: 9, roofType: "Asphalt", pos: { x: 540, y: 257, w: 90, h: 50 } },
      { rag: "amber", area: 165, cost: 155000, life: 11, roofType: "Single-ply membrane", pos: { x: 632, y: 257, w: 90, h: 50 } },
      { rag: "amber", area: 200, cost: 190000, life: 8, roofType: "Asphalt", pos: { x: 540, y: 309, w: 90, h: 50 } },
      { rag: "amber", area: 185, cost: 175000, life: 10, roofType: "Single-ply membrane", pos: { x: 632, y: 309, w: 90, h: 50 } },
    ],
  },
  {
    code: "HOD",
    name: "Horton D block",
    sections: [
      { rag: "amber", area: 165, cost: 150000, life: 9, roofType: "Single-ply membrane", pos: { x: 760, y: 200, w: 85, h: 50 } },
      { rag: "amber", area: 175, cost: 160000, life: 10, roofType: "Single-ply membrane", pos: { x: 847, y: 200, w: 85, h: 50 } },
      { rag: "amber", area: 180, cost: 170000, life: 8, roofType: "Asphalt", pos: { x: 760, y: 252, w: 85, h: 50 } },
      { rag: "amber", area: 170, cost: 155000, life: 11, roofType: "Single-ply membrane", pos: { x: 847, y: 252, w: 85, h: 50 } },
      { rag: "amber", area: 160, cost: 145000, life: 12, roofType: "Single-ply membrane", pos: { x: 760, y: 304, w: 85, h: 50 } },
      { rag: "amber", area: 175, cost: 165000, life: 9, roofType: "Asphalt", pos: { x: 847, y: 304, w: 85, h: 50 } },
      { rag: "amber", area: 185, cost: 175000, life: 8, roofType: "Single-ply membrane", pos: { x: 760, y: 356, w: 85, h: 50 } },
      { rag: "amber", area: 165, cost: 150000, life: 10, roofType: "Single-ply membrane", pos: { x: 847, y: 356, w: 85, h: 50 } },
      { rag: "amber", area: 195, cost: 185000, life: 9, roofType: "Asphalt", pos: { x: 760, y: 408, w: 172, h: 45 } },
    ],
  },
  {
    code: "JBP",
    name: "JB Priestley Library",
    sections: [
      { rag: "green", area: 380, cost: 95000, life: 22, roofType: "Standing seam metal", pos: { x: 950, y: 130, w: 110, h: 60 } },
      { rag: "green", area: 395, cost: 105000, life: 23, roofType: "Standing seam metal", pos: { x: 1062, y: 130, w: 110, h: 60 } },
      { rag: "green", area: 365, cost: 88000, life: 21, roofType: "Standing seam metal", pos: { x: 950, y: 192, w: 110, h: 55 } },
      { rag: "green", area: 410, cost: 110000, life: 24, roofType: "Standing seam metal", pos: { x: 1062, y: 192, w: 110, h: 55 } },
      { rag: "green", area: 385, cost: 98000, life: 22, roofType: "Standing seam metal", pos: { x: 950, y: 249, w: 222, h: 50 } },
    ],
  },
  {
    code: "RIL",
    name: "Richmond library link",
    sections: [
      { rag: "red", area: 145, cost: 270000, life: 3, roofType: "Built-up felt", pos: { x: 250, y: 450, w: 70, h: 45 } },
      { rag: "red", area: 155, cost: 285000, life: 2, roofType: "Built-up felt", pos: { x: 322, y: 450, w: 70, h: 45 } },
      { rag: "red", area: 140, cost: 260000, life: 3, roofType: "Asphalt", pos: { x: 394, y: 450, w: 70, h: 45 } },
      { rag: "red", area: 165, cost: 305000, life: 2, roofType: "Built-up felt", pos: { x: 250, y: 497, w: 70, h: 45 } },
      { rag: "amber", area: 150, cost: 140000, life: 9, roofType: "Single-ply membrane", pos: { x: 322, y: 497, w: 70, h: 45 } },
      { rag: "amber", area: 145, cost: 135000, life: 10, roofType: "Asphalt", pos: { x: 394, y: 497, w: 70, h: 45 } },
    ],
  },
  {
    code: "ATR",
    name: "Atrium",
    sections: [
      { rag: "amber", area: 285, cost: 240000, life: 9, roofType: "EPDM rubber", pos: { x: 720, y: 480, w: 130, h: 70 } },
    ],
  },
  {
    code: "SPC",
    name: "Sports centre",
    sections: [
      { rag: "green", area: 480, cost: 135000, life: 24, roofType: "Standing seam metal", pos: { x: 1190, y: 350, w: 130, h: 60 } },
      { rag: "green", area: 460, cost: 128000, life: 23, roofType: "Standing seam metal", pos: { x: 1190, y: 412, w: 130, h: 60 } },
      { rag: "green", area: 495, cost: 142000, life: 25, roofType: "Standing seam metal", pos: { x: 1190, y: 474, w: 130, h: 55 } },
      { rag: "green", area: 470, cost: 132000, life: 22, roofType: "Standing seam metal", pos: { x: 1190, y: 531, w: 130, h: 55 } },
      { rag: "green", area: 510, cost: 148000, life: 24, roofType: "Standing seam metal", pos: { x: 1322, y: 350, w: 110, h: 60 } },
      { rag: "green", area: 485, cost: 138000, life: 23, roofType: "Standing seam metal", pos: { x: 1322, y: 412, w: 110, h: 60 } },
      { rag: "green", area: 465, cost: 130000, life: 25, roofType: "Standing seam metal", pos: { x: 1322, y: 474, w: 110, h: 55 } },
      { rag: "green", area: 500, cost: 145000, life: 24, roofType: "Standing seam metal", pos: { x: 1322, y: 531, w: 110, h: 55 } },
    ],
  },
  {
    code: "CHB",
    name: "Chesham B block",
    sections: [
      { rag: "green", area: 320, cost: 78000, life: 20, roofType: "Concrete tile", pos: { x: 360, y: 340, w: 75, h: 50 } },
      { rag: "green", area: 305, cost: 72000, life: 19, roofType: "Concrete tile", pos: { x: 437, y: 340, w: 75, h: 50 } },
      { rag: "green", area: 330, cost: 82000, life: 21, roofType: "Concrete tile", pos: { x: 360, y: 392, w: 75, h: 50 } },
      { rag: "green", area: 315, cost: 76000, life: 20, roofType: "Concrete tile", pos: { x: 437, y: 392, w: 75, h: 50 } },
    ],
  },
  {
    code: "NOR",
    name: "Norcroft centre",
    sections: [
      { rag: "green", area: 380, cost: 88000, life: 23, roofType: "Standing seam metal", pos: { x: 540, y: 110, w: 95, h: 70 } },
      { rag: "green", area: 365, cost: 84000, life: 22, roofType: "Standing seam metal", pos: { x: 637, y: 110, w: 95, h: 70 } },
    ],
  },
  {
    code: "ICT",
    name: "ICT centre",
    sections: [
      { rag: "green", area: 290, cost: 68000, life: 21, roofType: "Green roof", pos: { x: 870, y: 110, w: 90, h: 40 } },
      { rag: "green", area: 280, cost: 65000, life: 22, roofType: "Green roof", pos: { x: 870, y: 152, w: 90, h: 40 } },
    ],
  },
  {
    code: "GRH",
    name: "Great Horton Road frontage",
    sections: [
      { rag: "red", area: 145, cost: 250000, life: 3, roofType: "Slate", pos: { x: 70, y: 480, w: 90, h: 50 } },
      { rag: "amber", area: 165, cost: 150000, life: 10, roofType: "Slate", pos: { x: 70, y: 532, w: 90, h: 50 } },
      { rag: "green", area: 175, cost: 55000, life: 19, roofType: "Slate", pos: { x: 70, y: 584, w: 90, h: 50 } },
    ],
  },
];

export const seedBuildings: Building[] = SEED.map((b) => ({
  code: b.code,
  name: b.name,
  sections: b.sections.map((s, idx) => {
    const sectionNumber = String(idx + 1).padStart(2, "0");
    return {
      id: `${b.code}/${sectionNumber}`,
      buildingCode: b.code,
      sectionNumber,
      rag: s.rag,
      areaSqm: s.area,
      forecastCostGbp: s.cost,
      lifeRemainingYears: s.life,
      roofType: s.roofType,
      polygon: rect(s.pos.x, s.pos.y, s.pos.w, s.pos.h),
      labelPosition: center(s.pos.x, s.pos.y, s.pos.w, s.pos.h),
    };
  }),
}));
