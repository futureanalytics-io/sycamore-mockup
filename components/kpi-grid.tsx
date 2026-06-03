"use client";

import { useShallow } from "zustand/react/shallow";
import { usePortalStore, selectKpis } from "@/lib/store";
import { formatGbp, formatArea } from "@/lib/rag";
import { PoundSterling, CalendarClock, AlertTriangle, Sigma } from "lucide-react";

interface KpiTileProps {
  label: string;
  value: string;
  caption?: string;
  accent?: string;
  swatch?: string;
  icon?: React.ReactNode;
  spark?: number;
}

function KpiTile({ label, value, caption, accent, swatch, icon, spark }: KpiTileProps) {
  // Top accent bar: RAG swatch colour for status tiles, brand gradient otherwise.
  const barBg = swatch ?? undefined;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-5 pt-5 pb-4 flex flex-col gap-2.5 min-w-0 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-200">
      {/* faint colour wash that intensifies on hover for a livelier feel */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: barBg
            ? `radial-gradient(120% 120% at 100% 0%, ${barBg}1f 0%, transparent 60%)`
            : "radial-gradient(120% 120% at 100% 0%, rgba(31,182,214,0.10) 0%, transparent 60%)",
        }}
      />
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={barBg ? { background: barBg } : { backgroundImage: "var(--gradient-brand-vivid)" }}
      />
      <div className="flex items-center gap-1.5 text-[10.5px] text-[color:var(--color-ink-muted)] font-body font-semibold uppercase tracking-[0.08em]">
        {swatch && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: swatch }}
          />
        )}
        {icon && <span className="text-[color:var(--color-sycamore)] opacity-80">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      <div
        className="font-display text-[31px] font-bold leading-none tabular-nums tracking-[-0.03em]"
        style={{ color: accent || "var(--color-ink-strong)" }}
      >
        {value}
      </div>
      {caption && (
        <div className="text-[11px] text-[color:var(--color-ink-muted)] flex items-center gap-1.5">
          {typeof spark === "number" && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{
                background: spark >= 0 ? "rgba(118,161,96,0.12)" : "rgba(226,94,68,0.12)",
                color: spark >= 0 ? "#426D30" : "#A73A25",
              }}
            >
              {spark >= 0 ? "▲" : "▼"} {Math.abs(spark)}%
            </span>
          )}
          {caption}
        </div>
      )}
    </div>
  );
}

export function KpiGrid() {
  const kpis = usePortalStore(useShallow(selectKpis));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiTile
        label="Forecast cost"
        value={formatGbp(kpis.totalCost)}
        caption="across all roof sections"
        icon={<PoundSterling className="h-3 w-3" />}
      />
      <KpiTile
        label="10-yr capital plan"
        value={formatGbp(kpis.tenYearPlan)}
        caption="≤10 years life remaining"
        icon={<CalendarClock className="h-3 w-3" />}
      />
      <KpiTile
        label="Red area"
        value={formatArea(kpis.redArea)}
        swatch="#E25E44"
        accent="#A73A25"
        caption="Immediate action"
      />
      <KpiTile
        label="Amber area"
        value={formatArea(kpis.amberArea)}
        swatch="#DEB71B"
        accent="#7B6204"
        caption="Within plan window"
      />
      <KpiTile
        label="Green area"
        value={formatArea(kpis.greenArea)}
        swatch="#76A160"
        accent="#426D30"
        caption="Healthy lifespan"
      />
      <KpiTile
        label="Sections w/ issues"
        value={`${kpis.sectionsWithIssues}`}
        caption={`of ${kpis.sectionsTotal} total`}
        icon={<AlertTriangle className="h-3 w-3" />}
      />
    </div>
  );
}

export function HeroStats() {
  const kpis = usePortalStore(useShallow(selectKpis));
  return (
    <div className="flex items-center gap-6 text-[12px] text-[color:var(--color-ink-muted)]">
      <div className="flex items-center gap-2">
        <Sigma className="h-3.5 w-3.5" />
        <span>
          <strong className="text-[color:var(--color-ink-strong)] font-display">
            {kpis.sectionsTotal}
          </strong>{" "}
          roof sections
        </span>
      </div>
      <div>
        <strong className="text-[color:var(--color-ink-strong)] font-display">
          {formatArea(kpis.redArea + kpis.amberArea + kpis.greenArea)}
        </strong>{" "}
        total roof area
      </div>
      <div>
        <strong className="text-[color:var(--color-ink-strong)] font-display">
          {kpis.sectionsWithIssues}
        </strong>{" "}
        need attention
      </div>
    </div>
  );
}
