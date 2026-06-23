"use client";

/*
 * Headline KPI cards — a faithful replica of the Power BI dashboard's KPI strip
 * (Total Defects, High/Medium/Low Risk, Total Quantity, Additional Surveys,
 * Largest Work Package, Highest Risk Building). Each tile is clickable and opens
 * the relevant defect group in the modal.
 */
import type { ReactNode } from "react";
import { useUnipolStore } from "@/lib/unipol-store";
import {
  PRIORITY_META,
  type Defect,
  type UnipolKpis,
  type Priority,
} from "@/lib/unipol-data";
import { Layers, Sigma, FileSearch, PackageOpen, Building2 } from "lucide-react";

function Tile({
  label,
  value,
  caption,
  accent,
  swatch,
  icon,
  onClick,
  small,
}: {
  label: string;
  value: string;
  caption?: string;
  accent?: string;
  swatch?: string;
  icon?: ReactNode;
  onClick?: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-5 pt-5 pb-4 flex flex-col gap-2 min-w-0 text-left shadow-[var(--shadow-sm)] enabled:hover:shadow-[var(--shadow-md)] enabled:hover:-translate-y-1 transition-all duration-200 disabled:cursor-default"
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={swatch ? { background: swatch } : { backgroundImage: "var(--gradient-brand-vivid)" }}
      />
      <div className="flex items-center gap-1.5 text-[10.5px] text-[color:var(--color-ink-muted)] font-body font-semibold uppercase tracking-[0.08em]">
        {swatch && <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: swatch }} />}
        {icon && <span className="text-[color:var(--color-sycamore)] opacity-80">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      <div
        className={`font-display font-bold leading-tight tracking-[-0.02em] break-words ${
          small ? "text-[15px] mt-0.5" : "text-[30px] leading-none tabular-nums"
        }`}
        style={{ color: accent || "var(--color-ink-strong)" }}
      >
        {value}
      </div>
      {caption && <div className="text-[11px] text-[color:var(--color-ink-muted)] leading-snug">{caption}</div>}
    </button>
  );
}

export function UnipolKpis({ kpis, defects }: { kpis: UnipolKpis; defects: Defect[] }) {
  const openGroup = useUnipolStore((s) => s.openGroup);
  const byPriority = (p: Priority) => defects.filter((d) => d.priority === p);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Tile
        label="Total defects"
        value={`${kpis.totalDefects}`}
        caption="compartmentation items identified"
        icon={<Layers className="h-3 w-3" />}
        onClick={() => openGroup({ title: "All defects", subtitle: `${defects.length} items in current selection`, defects })}
      />
      <Tile
        label="High risk"
        value={`${kpis.high}`}
        caption="urgent remedial action"
        swatch={PRIORITY_META.High.fill}
        accent={PRIORITY_META.High.text}
        onClick={kpis.high ? () => openGroup({ title: "High-risk defects", defects: byPriority("High") }) : undefined}
      />
      <Tile
        label="Medium risk"
        value={`${kpis.medium}`}
        caption="scheduled remedial works"
        swatch={PRIORITY_META.Medium.fill}
        accent={PRIORITY_META.Medium.text}
        onClick={kpis.medium ? () => openGroup({ title: "Medium-risk defects", defects: byPriority("Medium") }) : undefined}
      />
      <Tile
        label="Low risk"
        value={`${kpis.low}`}
        caption="non-urgent"
        swatch={PRIORITY_META.Low.fill}
        accent={PRIORITY_META.Low.text}
        onClick={kpis.low ? () => openGroup({ title: "Low-risk defects", defects: byPriority("Low") }) : undefined}
      />
      <Tile
        label="Total quantity"
        value={`${kpis.totalQuantity}`}
        caption="units of work to remediate"
        icon={<Sigma className="h-3 w-3" />}
      />
      <Tile
        label="Additional surveys"
        value={`${kpis.additionalSurveys}`}
        caption="items flagged for further survey"
        icon={<FileSearch className="h-3 w-3" />}
        onClick={
          kpis.additionalSurveys
            ? () => openGroup({ title: "Additional surveys required", defects: defects.filter((d) => d.additionalSurvey) })
            : undefined
        }
      />
      <Tile
        label="Largest work package"
        value={kpis.largestWorkPackage}
        caption="by total quantity"
        icon={<PackageOpen className="h-3 w-3" />}
        small
      />
      <Tile
        label="Highest risk building"
        value={kpis.highestRiskBuilding}
        caption="most high-priority defects"
        icon={<Building2 className="h-3 w-3" />}
        small
      />
    </div>
  );
}
