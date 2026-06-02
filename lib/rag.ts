import type { PathOptions } from "leaflet";
import type { RagStatus } from "./types";

export const RAG_COLORS: Record<RagStatus, { fill: string; stroke: string; label: string; bg: string; text: string }> = {
  red: {
    fill: "#E25E44",
    stroke: "#A73A25",
    label: "Red",
    bg: "rgba(226, 94, 68, 0.15)",
    text: "#A73A25",
  },
  amber: {
    fill: "#DEB71B",
    stroke: "#9C7D09",
    label: "Amber",
    bg: "rgba(222, 183, 27, 0.18)",
    text: "#7B6204",
  },
  green: {
    fill: "#76A160",
    stroke: "#426D30",
    label: "Green",
    bg: "rgba(118, 161, 96, 0.18)",
    text: "#426D30",
  },
};

export function ragPathOptions(rag: RagStatus, selected = false, hovered = false): PathOptions {
  const c = RAG_COLORS[rag];
  return {
    color: c.stroke,
    weight: selected ? 3 : hovered ? 2.2 : 1.5,
    fillColor: c.fill,
    fillOpacity: selected ? 0.85 : hovered ? 0.78 : 0.62,
    opacity: 1,
  };
}

export function ragLabel(rag: RagStatus): string {
  return RAG_COLORS[rag].label;
}

export function formatGbp(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
  return `£${n.toFixed(0)}`;
}

export function formatGbpFull(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatArea(n: number): string {
  return `${new Intl.NumberFormat("en-GB").format(Math.round(n))} m²`;
}
