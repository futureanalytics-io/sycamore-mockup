"use client";

import { create } from "zustand";
import {
  EMPTY_FILTERS,
  QUANTITY_MIN,
  QUANTITY_MAX,
  type Defect,
  type Priority,
  type Rag,
  type UnipolFilters,
  type WorkCategory,
} from "./unipol-data";

/* The modal can show a single defect or a group (e.g. all "High" defects, or
   everything in one building) — whatever the user hovered/clicked. */
export interface DefectGroup {
  title: string;
  subtitle?: string;
  defects: Defect[];
}

interface UnipolState {
  filters: UnipolFilters;
  group: DefectGroup | null;

  togglePriority: (p: Priority) => void;
  toggleRag: (r: Rag) => void;
  toggleBuilding: (b: string) => void;
  toggleWorkCategory: (c: WorkCategory) => void;
  setLocation: (l: string) => void;
  setQuantity: (range: [number, number]) => void;
  clearFilters: () => void;

  openGroup: (group: DefectGroup) => void;
  closeGroup: () => void;
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export const useUnipolStore = create<UnipolState>((set) => ({
  filters: { ...EMPTY_FILTERS, quantity: [QUANTITY_MIN, QUANTITY_MAX] },
  group: null,

  togglePriority: (p) =>
    set((s) => ({ filters: { ...s.filters, priorities: toggle(s.filters.priorities, p) } })),
  toggleRag: (r) => set((s) => ({ filters: { ...s.filters, rags: toggle(s.filters.rags, r) } })),
  toggleBuilding: (b) =>
    set((s) => ({ filters: { ...s.filters, buildings: toggle(s.filters.buildings, b) } })),
  toggleWorkCategory: (c) =>
    set((s) => ({ filters: { ...s.filters, workCategories: toggle(s.filters.workCategories, c) } })),
  setLocation: (l) => set((s) => ({ filters: { ...s.filters, location: l } })),
  setQuantity: (range) => set((s) => ({ filters: { ...s.filters, quantity: range } })),
  clearFilters: () => set({ filters: { ...EMPTY_FILTERS, quantity: [QUANTITY_MIN, QUANTITY_MAX] } }),

  openGroup: (group) => set({ group }),
  closeGroup: () => set({ group: null }),
}));
