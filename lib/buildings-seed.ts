import type { Building, RagStatus, RoofType } from "./types";
import { IMAGE_HEIGHT } from "./utils";

/**
 * Polygon coordinates are in Leaflet CRS.Simple space: [lat, lng] where
 * lat = IMAGE_HEIGHT - pixelY and lng = pixelX. So (0, 0) is bottom-left
 * and (IMAGE_HEIGHT, IMAGE_WIDTH) is top-right. The polygon editor lets the
 * client refine these by tracing over the campus image.
 *
 * Pixel coordinates below are measured against public/campus-map.jpg
 * (2480 × 2237), cropped from the University of Bradford Roof PPM drawing.
 * Each building declares the real footprint box it occupies on that drawing;
 * its sections are tiled into a grid that fills the footprint, so every
 * polygon sits over the actual building rather than a placeholder rectangle.
 */

function py(pixelY: number) {
  return IMAGE_HEIGHT - pixelY;
}

// Rectangle (in pixel space) → polygon in CRS.Simple coords.
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

// Explicit pixel polygon ([x, y] points) → CRS.Simple coords ([lat, lng]).
function polyToCrs(pts: [number, number][]): [number, number][] {
  return pts.map(([x, y]) => [py(y), x]);
}

// Centroid of a pixel polygon → CRS.Simple coords, for the label position.
function polyCenter(pts: [number, number][]): [number, number] {
  const n = pts.length;
  const sx = pts.reduce((a, [x]) => a + x, 0) / n;
  const sy = pts.reduce((a, [, y]) => a + y, 0) / n;
  return [py(sy), sx];
}

interface SectionSeed {
  rag: RagStatus;
  area: number;
  cost: number;
  life: number;
  roofType: RoofType;
}

/**
 * Explicit section outlines, traced onto the real buildings in
 * public/campus-map.jpg, keyed by section id ("CODE/NN"). Points are in IMAGE
 * PIXEL space (clockwise). When a section has an entry here it is drawn as this
 * exact polygon — supporting angled / L-shaped / irregular footprints — instead
 * of a grid-tiled rectangle. Sections without an entry fall back to grid tiling.
 */
const SECTION_POLYS: Record<string, [number, number][]> = {
  "PSW/01": [[332,668],[400,668],[400,800],[332,800]],
  "PSW/02": [[108,802],[330,802],[330,838],[108,838]],
  "PSW/03": [[238,632],[322,632],[322,660],[238,660]],
  "PSW/04": [[108,628],[238,628],[238,660],[330,660],[330,800],[108,800]],

  "SCE/01": [[830,520],[1000,540],[1000,700],[900,700],[870,600],[830,600]],
  "SCE/02": [[740,600],[838,600],[860,700],[760,720]],
  "SCE/03": [[840,600],[960,610],[975,720],[905,760],[855,720]],
  "SCE/04": [[898,762],[980,766],[980,792],[898,790]],
  "SCE/05": [[975,640],[1000,640],[1000,720],[975,720]],
  "SCE/06": [[745,725],[878,720],[880,838],[748,840]],

  "JBP/01": [[905,818],[1000,825],[1010,945],[920,940]],
  "JBP/02": [[1002,828],[1080,835],[1078,888],[1008,882]],
  "JBP/03": [[1008,888],[1078,890],[1080,945],[1012,945]],
  "JBP/04": [[920,945],[1010,950],[1022,1085],[934,1080]],
  "JBP/05": [[934,1082],[1022,1086],[1024,1128],[938,1124]],

  "CHC/01": [[1095,1128],[1185,1132],[1212,1405],[1122,1402]],
  "CHC/02": [[1112,1228],[1158,1228],[1158,1282],[1112,1282]],
  "CHC/03": [[1055,1118],[1098,1118],[1098,1162],[1055,1162]],
  "CHC/04": [[1122,1410],[1248,1414],[1245,1454],[1119,1450]],
  "CHC/05": [[1202,1284],[1242,1286],[1252,1412],[1212,1408]],
  "CHC/06": [[1205,1178],[1242,1180],[1240,1282],[1202,1280]],
  "CHC/07": [[1245,1150],[1435,1158],[1432,1292],[1242,1284]],

  "HOD/01": [[1560,1410],[1665,1410],[1672,1700],[1568,1700]],
  "HOD/02": [[1605,1408],[1668,1410],[1666,1448],[1603,1446]],
  "HOD/03": [[1668,1408],[1728,1410],[1726,1450],[1666,1448]],
  "HOD/04": [[1655,1368],[1728,1370],[1726,1408],[1653,1406]],
  "HOD/05": [[1558,1368],[1628,1370],[1626,1408],[1556,1406]],
  "HOD/06": [[1558,1240],[1645,1245],[1645,1300],[1558,1298]],
  "HOD/07": [[1635,1300],[1725,1305],[1722,1362],[1632,1360]],
  "HOD/08": [[1538,1302],[1622,1305],[1620,1362],[1536,1360]],
  "HOD/09": [[1410,1280],[1490,1285],[1490,1400],[1410,1395]],

  "CHB/01": [[1238,1572],[1372,1572],[1372,1698],[1238,1698]],
  "CHB/02": [[1376,1578],[1500,1580],[1500,1698],[1376,1698]],
  "CHB/03": [[1248,1462],[1305,1462],[1303,1552],[1248,1550]],
  "CHB/04": [[1305,1455],[1432,1462],[1430,1558],[1303,1552]],

  "SPC/01": [[945,1500],[1065,1505],[1065,1625],[945,1622]],
  "SPC/02": [[808,1432],[945,1438],[945,1530],[808,1528]],
  "SPC/03": [[1000,1625],[1110,1628],[1110,1702],[1000,1700]],
  "SPC/04": [[918,1640],[998,1642],[998,1702],[918,1700]],
  "SPC/05": [[748,1452],[806,1456],[806,1560],[748,1556]],
  "SPC/06": [[800,1532],[945,1534],[945,1645],[800,1642]],
  "SPC/07": [[748,1562],[806,1564],[806,1682],[748,1678]],
  "SPC/08": [[652,1530],[744,1532],[744,1645],[652,1642]],

  "NOR/01": [[1905,820],[2098,825],[2096,940],[1905,936]],
  "NOR/02": [[2108,825],[2212,828],[2210,940],[2106,936]],

  "ICT/01": [[2256,892],[2456,898],[2454,950],[2254,946]],
  "ICT/02": [[2288,822],[2442,830],[2438,892],[2284,886]],

  "WOR/01": [[2150,1135],[2270,1138],[2270,1285],[2150,1282]],
  "WOR/02": [[2272,1138],[2400,1140],[2400,1285],[2272,1285]],
  "WOR/03": [[2150,1290],[2270,1292],[2270,1360],[2150,1358]],
  "WOR/04": [[2272,1290],[2400,1292],[2400,1360],[2272,1360]],
  "WOR/05": [[2330,1392],[2440,1394],[2440,1430],[2330,1428]],

  "RIL/01": [[2188,1382],[2335,1386],[2335,1448],[2188,1444]],
  "RIL/02": [[2188,1448],[2335,1450],[2335,1512],[2188,1510]],
  "RIL/03": [[2188,1512],[2335,1514],[2335,1576],[2188,1574]],
  "RIL/04": [[2160,1622],[2270,1624],[2270,1700],[2160,1698]],
  "RIL/05": [[2272,1620],[2360,1622],[2360,1700],[2272,1698]],
  "RIL/06": [[2335,1512],[2400,1514],[2400,1576],[2335,1574]],

  "ATR/01": [[1980,1392],[2185,1396],[2160,1620],[2010,1622],[1965,1500]],

  "GRH/01": [[1990,1625],[2155,1628],[2120,1785],[2010,1788]],
  "GRH/02": [[2010,1790],[2120,1788],[2110,1855],[2025,1858]],
  "GRH/03": [[1990,1625],[2050,1626],[2050,1690],[1990,1688]],
};

interface BuildingSeed {
  code: string;
  name: string;
  /** Real footprint box on the campus drawing, in image pixels. */
  footprint: { x: number; y: number; w: number; h: number };
  /** Grid the sections tile into. cols * rows should be >= sections.length. */
  grid: { cols: number; rows: number };
  /** Small inset (px) between tiled sections so borders read clearly. */
  gap?: number;
  sections: SectionSeed[];
}

const SEED: BuildingSeed[] = [
  {
    code: "PSW",
    name: "Phoenix South West",
    footprint: { x: 110, y: 650, w: 222, h: 245 },
    grid: { cols: 2, rows: 2 },
    sections: [
      { rag: "red", area: 220, cost: 380000, life: 3, roofType: "Built-up felt" },
      { rag: "red", area: 195, cost: 340000, life: 2, roofType: "Built-up felt" },
      { rag: "red", area: 180, cost: 310000, life: 4, roofType: "Asphalt" },
      { rag: "amber", area: 160, cost: 170000, life: 8, roofType: "Single-ply membrane" },
    ],
  },
  {
    code: "WOR",
    name: "Worsley building",
    footprint: { x: 2195, y: 1145, w: 150, h: 285 },
    grid: { cols: 2, rows: 3 },
    sections: [
      { rag: "amber", area: 165, cost: 155000, life: 9, roofType: "Single-ply membrane" },
      { rag: "amber", area: 175, cost: 165000, life: 8, roofType: "Single-ply membrane" },
      { rag: "amber", area: 150, cost: 145000, life: 10, roofType: "Asphalt" },
      { rag: "amber", area: 170, cost: 160000, life: 9, roofType: "Single-ply membrane" },
      { rag: "amber", area: 155, cost: 150000, life: 11, roofType: "Asphalt" },
    ],
  },
  {
    code: "CHC",
    name: "Chesham C block",
    footprint: { x: 1095, y: 1130, w: 135, h: 300 },
    grid: { cols: 2, rows: 4 },
    sections: [
      { rag: "red", area: 175, cost: 320000, life: 3, roofType: "Built-up felt" },
      { rag: "red", area: 165, cost: 305000, life: 2, roofType: "Built-up felt" },
      { rag: "red", area: 190, cost: 360000, life: 3, roofType: "Asphalt" },
      { rag: "red", area: 170, cost: 315000, life: 4, roofType: "Built-up felt" },
      { rag: "red", area: 155, cost: 285000, life: 4, roofType: "Asphalt" },
      { rag: "amber", area: 145, cost: 130000, life: 9, roofType: "Single-ply membrane" },
      { rag: "amber", area: 150, cost: 140000, life: 10, roofType: "Single-ply membrane" },
    ],
  },
  {
    code: "SCE",
    name: "Science building",
    footprint: { x: 775, y: 560, w: 150, h: 205 },
    grid: { cols: 2, rows: 3 },
    sections: [
      { rag: "amber", area: 195, cost: 180000, life: 11, roofType: "Single-ply membrane" },
      { rag: "amber", area: 175, cost: 160000, life: 10, roofType: "Single-ply membrane" },
      { rag: "amber", area: 180, cost: 170000, life: 9, roofType: "Asphalt" },
      { rag: "amber", area: 165, cost: 155000, life: 11, roofType: "Single-ply membrane" },
      { rag: "amber", area: 200, cost: 190000, life: 8, roofType: "Asphalt" },
      { rag: "amber", area: 185, cost: 175000, life: 10, roofType: "Single-ply membrane" },
    ],
  },
  {
    code: "HOD",
    name: "Horton D block",
    footprint: { x: 1300, y: 1275, w: 210, h: 295 },
    grid: { cols: 2, rows: 5 },
    sections: [
      { rag: "amber", area: 165, cost: 150000, life: 9, roofType: "Single-ply membrane" },
      { rag: "amber", area: 175, cost: 160000, life: 10, roofType: "Single-ply membrane" },
      { rag: "amber", area: 180, cost: 170000, life: 8, roofType: "Asphalt" },
      { rag: "amber", area: 170, cost: 155000, life: 11, roofType: "Single-ply membrane" },
      { rag: "amber", area: 160, cost: 145000, life: 12, roofType: "Single-ply membrane" },
      { rag: "amber", area: 175, cost: 165000, life: 9, roofType: "Asphalt" },
      { rag: "amber", area: 185, cost: 175000, life: 8, roofType: "Single-ply membrane" },
      { rag: "amber", area: 165, cost: 150000, life: 10, roofType: "Single-ply membrane" },
      { rag: "amber", area: 195, cost: 185000, life: 9, roofType: "Asphalt" },
    ],
  },
  {
    code: "JBP",
    name: "JB Priestley Library",
    footprint: { x: 818, y: 815, w: 168, h: 270 },
    grid: { cols: 1, rows: 5 },
    sections: [
      { rag: "green", area: 380, cost: 95000, life: 22, roofType: "Standing seam metal" },
      { rag: "green", area: 395, cost: 105000, life: 23, roofType: "Standing seam metal" },
      { rag: "green", area: 365, cost: 88000, life: 21, roofType: "Standing seam metal" },
      { rag: "green", area: 410, cost: 110000, life: 24, roofType: "Standing seam metal" },
      { rag: "green", area: 385, cost: 98000, life: 22, roofType: "Standing seam metal" },
    ],
  },
  {
    code: "RIL",
    name: "Richmond library link",
    footprint: { x: 2055, y: 1460, w: 170, h: 215 },
    grid: { cols: 3, rows: 2 },
    sections: [
      { rag: "red", area: 145, cost: 270000, life: 3, roofType: "Built-up felt" },
      { rag: "red", area: 155, cost: 285000, life: 2, roofType: "Built-up felt" },
      { rag: "red", area: 140, cost: 260000, life: 3, roofType: "Asphalt" },
      { rag: "red", area: 165, cost: 305000, life: 2, roofType: "Built-up felt" },
      { rag: "amber", area: 150, cost: 140000, life: 9, roofType: "Single-ply membrane" },
      { rag: "amber", area: 145, cost: 135000, life: 10, roofType: "Asphalt" },
    ],
  },
  {
    code: "ATR",
    name: "Atrium",
    footprint: { x: 1965, y: 1465, w: 130, h: 210 },
    grid: { cols: 1, rows: 1 },
    sections: [
      { rag: "amber", area: 285, cost: 240000, life: 9, roofType: "EPDM rubber" },
    ],
  },
  {
    code: "SPC",
    name: "Sports centre",
    footprint: { x: 700, y: 1400, w: 350, h: 350 },
    grid: { cols: 3, rows: 3 },
    sections: [
      { rag: "green", area: 480, cost: 135000, life: 24, roofType: "Standing seam metal" },
      { rag: "green", area: 460, cost: 128000, life: 23, roofType: "Standing seam metal" },
      { rag: "green", area: 495, cost: 142000, life: 25, roofType: "Standing seam metal" },
      { rag: "green", area: 470, cost: 132000, life: 22, roofType: "Standing seam metal" },
      { rag: "green", area: 510, cost: 148000, life: 24, roofType: "Standing seam metal" },
      { rag: "green", area: 485, cost: 138000, life: 23, roofType: "Standing seam metal" },
      { rag: "green", area: 465, cost: 130000, life: 25, roofType: "Standing seam metal" },
      { rag: "green", area: 500, cost: 145000, life: 24, roofType: "Standing seam metal" },
    ],
  },
  {
    code: "CHB",
    name: "Chesham B block",
    footprint: { x: 1600, y: 1590, w: 205, h: 175 },
    grid: { cols: 2, rows: 2 },
    sections: [
      { rag: "green", area: 320, cost: 78000, life: 20, roofType: "Concrete tile" },
      { rag: "green", area: 305, cost: 72000, life: 19, roofType: "Concrete tile" },
      { rag: "green", area: 330, cost: 82000, life: 21, roofType: "Concrete tile" },
      { rag: "green", area: 315, cost: 76000, life: 20, roofType: "Concrete tile" },
    ],
  },
  {
    code: "NOR",
    name: "Norcroft centre",
    footprint: { x: 1940, y: 835, w: 215, h: 105 },
    grid: { cols: 2, rows: 1 },
    sections: [
      { rag: "green", area: 380, cost: 88000, life: 23, roofType: "Standing seam metal" },
      { rag: "green", area: 365, cost: 84000, life: 22, roofType: "Standing seam metal" },
    ],
  },
  {
    code: "ICT",
    name: "ICT centre",
    footprint: { x: 2190, y: 800, w: 135, h: 165 },
    grid: { cols: 1, rows: 2 },
    sections: [
      { rag: "green", area: 290, cost: 68000, life: 21, roofType: "Green roof" },
      { rag: "green", area: 280, cost: 65000, life: 22, roofType: "Green roof" },
    ],
  },
  {
    code: "GRH",
    name: "Great Horton Road frontage",
    footprint: { x: 1980, y: 1715, w: 120, h: 140 },
    grid: { cols: 1, rows: 3 },
    sections: [
      { rag: "red", area: 145, cost: 250000, life: 3, roofType: "Slate" },
      { rag: "amber", area: 165, cost: 150000, life: 10, roofType: "Slate" },
      { rag: "green", area: 175, cost: 55000, life: 19, roofType: "Slate" },
    ],
  },
];

/**
 * Tile a building's sections into its footprint grid (row-major: fill the top
 * row left→right, then the next row). Returns the pixel box for section index.
 */
function tile(
  footprint: { x: number; y: number; w: number; h: number },
  grid: { cols: number; rows: number },
  index: number,
  gap: number
): { x: number; y: number; w: number; h: number } {
  const cellW = footprint.w / grid.cols;
  const cellH = footprint.h / grid.rows;
  const col = index % grid.cols;
  const row = Math.floor(index / grid.cols);
  return {
    x: footprint.x + col * cellW + gap / 2,
    y: footprint.y + row * cellH + gap / 2,
    w: cellW - gap,
    h: cellH - gap,
  };
}

export const seedBuildings: Building[] = SEED.map((b) => {
  const gap = b.gap ?? 8;
  return {
    code: b.code,
    name: b.name,
    sections: b.sections.map((s, idx) => {
      const sectionNumber = String(idx + 1).padStart(2, "0");
      const id = `${b.code}/${sectionNumber}`;
      // Prefer an explicit traced outline; otherwise fall back to grid tiling.
      const traced = SECTION_POLYS[id];
      const box = tile(b.footprint, b.grid, idx, gap);
      const polygon = traced ? polyToCrs(traced) : rect(box.x, box.y, box.w, box.h);
      const labelPosition = traced
        ? polyCenter(traced)
        : center(box.x, box.y, box.w, box.h);
      return {
        id,
        buildingCode: b.code,
        sectionNumber,
        rag: s.rag,
        areaSqm: s.area,
        forecastCostGbp: s.cost,
        lifeRemainingYears: s.life,
        roofType: s.roofType,
        polygon,
        labelPosition,
        photos: [],
      };
    }),
  };
});
