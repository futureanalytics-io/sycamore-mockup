import type { PathOptions } from "leaflet";
import type { RagStatus } from "./types";

export const RAG_COLORS: Record<RagStatus, { fill: string; stroke: string; label: string; bg: string; text: string }> = {
  red: {
    fill: "#E24B4A",
    stroke: "#A32D2D",
    label: "Red",
    bg: "rgba(226, 75, 74, 0.12)",
    text: "#A32D2D",
  },
  amber: {
    fill: "#EF9F27",
    stroke: "#BA7517",
    label: "Amber",
    bg: "rgba(239, 159, 39, 0.14)",
    text: "#9A5E0F",
  },
  green: {
    fill: "#97C459",
    stroke: "#3B6D11",
    label: "Green",
    bg: "rgba(151, 196, 89, 0.18)",
    text: "#3B6D11",
  },
};

export function ragPathOptions(rag: RagStatus, selected = false, hovered = false): PathOptions {
  const c = RAG_COLORS[rag];
  return {
    color: c.stroke,
    weight: selected ? 3 : hovered ? 2.2 : 1.5,
    fillColor: c.fill,
    fillOpacity: selected ? 0.85 : hovered ? 0.78 : 0.65,
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
  return `${new Intl.NumberFormat("en-GB").format(Math.round(n))} m²`;
}
