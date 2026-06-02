"use client";

import { create } from "zustand";
import type { AuditEntry, Building, RagStatus, RoofSection, RoofType } from "./types";
import { seedBuildings } from "./buildings-seed";
import { seedAudits } from "./audits-seed";

interface SubmitAuditPayload {
  sectionId: string;
  ragAfter: RagStatus;
  lifeRemainingYears: number;
  notes: string;
  area: string;
  auditor?: string;
}

interface UpdateSectionPayload {
  sectionId: string;
  patch: {
    rag?: RagStatus;
    areaSqm?: number;
    forecastCostGbp?: number;
    lifeRemainingYears?: number;
    roofType?: RoofType;
    buildingName?: string;
  };
  changeNote?: string;
  auditor?: string;
}

interface PortalState {
  buildings: Building[];
  auditLog: AuditEntry[];
  selectedSectionId: string | null;
  editMode: boolean;

  selectSection: (id: string | null) => void;
  toggleEditMode: () => void;
  submitAudit: (payload: SubmitAuditPayload) => AuditEntry;
  updateSection: (payload: UpdateSectionPayload) => AuditEntry | null;
  updatePolygon: (sectionId: string, polygon: [number, number][]) => void;
  addPolygon: (buildingCode: string, sectionId: string, polygon: [number, number][]) => void;
  exportSeed: () => string;
  resetSeed: () => void;
  replaceBuildings: (buildings: Building[]) => void;
}

function findSection(
  buildings: Building[],
  sectionId: string
): { section: RoofSection; building: Building } | null {
  for (const b of buildings) {
    const s = b.sections.find((s) => s.id === sectionId);
    if (s) return { section: s, building: b };
  }
  return null;
}

function centroid(polygon: [number, number][]): [number, number] {
  const n = polygon.length || 1;
  const sum = polygon.reduce(
    (acc, [y, x]) => [acc[0] + y, acc[1] + x],
    [0, 0] as [number, number]
  );
  return [sum[0] / n, sum[1] / n];
}

export const usePortalStore = create<PortalState>((set, get) => ({
  buildings: seedBuildings,
  auditLog: seedAudits,
  selectedSectionId: null,
  editMode: false,

  selectSection: (id) => set({ selectedSectionId: id }),
  toggleEditMode: () => set((s) => ({ editMode: !s.editMode })),

  submitAudit: ({ sectionId, ragAfter, lifeRemainingYears, notes, area, auditor }) => {
    const state = get();
    const found = findSection(state.buildings, sectionId);
    if (!found) throw new Error(`Section ${sectionId} not found`);
    const ragBefore = found.section.rag;

    const entry: AuditEntry = {
      id: `a-${Date.now()}`,
      sectionId,
      buildingCode: found.building.code,
      timestamp: new Date().toISOString(),
      auditor: auditor || "Demo User",
      ragBefore,
      ragAfter,
      lifeRemainingYears,
      notes,
      area,
    };

    set({
      buildings: state.buildings.map((b) =>
        b.code !== found.building.code
          ? b
          : {
              ...b,
              sections: b.sections.map((s) =>
                s.id !== sectionId
                  ? s
                  : { ...s, rag: ragAfter, lifeRemainingYears }
              ),
            }
      ),
      auditLog: [entry, ...state.auditLog],
    });

    return entry;
  },

  updateSection: ({ sectionId, patch, changeNote, auditor }) => {
    const state = get();
    const found = findSection(state.buildings, sectionId);
    if (!found) return null;
    const { section, building } = found;

    const changes: string[] = [];
    if (patch.rag && patch.rag !== section.rag)
      changes.push(`RAG ${section.rag} → ${patch.rag}`);
    if (typeof patch.areaSqm === "number" && patch.areaSqm !== section.areaSqm)
      changes.push(`area ${section.areaSqm}m² → ${patch.areaSqm}m²`);
    if (
      typeof patch.forecastCostGbp === "number" &&
      patch.forecastCostGbp !== section.forecastCostGbp
    )
      changes.push(
        `forecast £${section.forecastCostGbp.toLocaleString()} → £${patch.forecastCostGbp.toLocaleString()}`
      );
    if (
      typeof patch.lifeRemainingYears === "number" &&
      patch.lifeRemainingYears !== section.lifeRemainingYears
    )
      changes.push(`life ${section.lifeRemainingYears}y → ${patch.lifeRemainingYears}y`);
    if (patch.roofType && patch.roofType !== section.roofType)
      changes.push(`type ${section.roofType} → ${patch.roofType}`);
    if (patch.buildingName && patch.buildingName !== building.name)
      changes.push(`building renamed → ${patch.buildingName}`);

    if (changes.length === 0 && !changeNote) return null;

    const auditEntry: AuditEntry =
      patch.rag && patch.rag !== section.rag
        ? {
            id: `a-${Date.now()}`,
            sectionId,
            buildingCode: building.code,
            timestamp: new Date().toISOString(),
            auditor: auditor || "Demo User",
            ragBefore: section.rag,
            ragAfter: patch.rag,
            lifeRemainingYears:
              patch.lifeRemainingYears ?? section.lifeRemainingYears,
            notes:
              changeNote ||
              `Master data update — ${changes.join("; ")}.`,
            area: "Master data update",
          }
        : {
            id: `a-${Date.now()}`,
            sectionId,
            buildingCode: building.code,
            timestamp: new Date().toISOString(),
            auditor: auditor || "Demo User",
            ragBefore: section.rag,
            ragAfter: section.rag,
            lifeRemainingYears:
              patch.lifeRemainingYears ?? section.lifeRemainingYears,
            notes:
              changeNote ||
              `Master data update — ${changes.join("; ")}.`,
            area: "Master data update",
          };

    set({
      buildings: state.buildings.map((b) => {
        if (b.code !== building.code) return b;
        return {
          ...b,
          name: patch.buildingName ?? b.name,
          sections: b.sections.map((s) =>
            s.id !== sectionId
              ? s
              : {
                  ...s,
                  rag: patch.rag ?? s.rag,
                  areaSqm: patch.areaSqm ?? s.areaSqm,
                  forecastCostGbp: patch.forecastCostGbp ?? s.forecastCostGbp,
                  lifeRemainingYears:
                    patch.lifeRemainingYears ?? s.lifeRemainingYears,
                  roofType: patch.roofType ?? s.roofType,
                }
          ),
        };
      }),
      auditLog: [auditEntry, ...state.auditLog],
    });

    return auditEntry;
  },

  updatePolygon: (sectionId, polygon) => {
    set((state) => ({
      buildings: state.buildings.map((b) => ({
        ...b,
        sections: b.sections.map((s) =>
          s.id !== sectionId
            ? s
            : { ...s, polygon, labelPosition: centroid(polygon) }
        ),
      })),
    }));
  },

  addPolygon: (buildingCode, sectionId, polygon) => {
    set((state) => {
      const existingBuilding = state.buildings.find((b) => b.code === buildingCode);
      const sectionNumber = sectionId.split("/")[1] || String(Date.now()).slice(-3);

      const newSection: RoofSection = {
        id: sectionId,
        buildingCode,
        sectionNumber,
        rag: "amber",
        areaSqm: 150,
        forecastCostGbp: 100000,
        lifeRemainingYears: 10,
        roofType: "Single-ply membrane",
        polygon,
        labelPosition: centroid(polygon),
      };

      if (existingBuilding) {
        return {
          buildings: state.buildings.map((b) =>
            b.code !== buildingCode ? b : { ...b, sections: [...b.sections, newSection] }
          ),
        };
      }

      return {
        buildings: [
          ...state.buildings,
          { code: buildingCode, name: buildingCode, sections: [newSection] },
        ],
      };
    });
  },

  exportSeed: () => {
    const state = get();
    return JSON.stringify(state.buildings, null, 2);
  },

  resetSeed: () => {
    set({
      buildings: seedBuildings,
      auditLog: seedAudits,
      selectedSectionId: null,
      editMode: false,
    });
  },

  replaceBuildings: (buildings) => set({ buildings }),
}));

// Derived selectors
export const selectAllSections = (state: PortalState): RoofSection[] =>
  state.buildings.flatMap((b) => b.sections);

export const selectKpis = (state: PortalState) => {
  const sections = selectAllSections(state);
  const totalCost = sections.reduce((sum, s) => sum + s.forecastCostGbp, 0);
  const tenYear = sections.reduce(
    (sum, s) => sum + (s.lifeRemainingYears <= 10 ? s.forecastCostGbp : 0),
    0
  );
  const byRag = (rag: RagStatus) =>
    sections.filter((s) => s.rag === rag).reduce((sum, s) => sum + s.areaSqm, 0);
  const issues = sections.filter((s) => s.rag !== "green").length;
  return {
    totalCost,
    tenYearPlan: tenYear,
    redArea: byRag("red"),
    amberArea: byRag("amber"),
    greenArea: byRag("green"),
    sectionsWithIssues: issues,
    sectionsTotal: sections.length,
  };
};

export function findSectionById(buildings: Building[], id: string | null): RoofSection | null {
  if (!id) return null;
  for (const b of buildings) {
    const s = b.sections.find((s) => s.id === id);
    if (s) return s;
  }
  return null;
}

export function findBuildingByCode(buildings: Building[], code: string): Building | null {
  return buildings.find((b) => b.code === code) || null;
}
