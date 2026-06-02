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
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-5 py-4 flex flex-col gap-2 min-w-0 hover:shadow-[0_4px_18px_rgba(17,32,37,0.07)] transition-shadow">
      <div className="flex items-center gap-2 text-[11.5px] text-[color:var(--color-ink-muted)] font-display font-semibold uppercase tracking-[0.12em]">
        {swatch && (
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm shadow-inner"
            style={{ backgroundColor: swatch }}
          />
        )}
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div
        className="font-display text-[28px] font-semibold leading-none tabular-nums"
        style={{ color: accent || "var(--color-ink-strong)" }}
      >
        {value}
      </div>
      {caption && (
        <div className="text-[11.5px] text-[color:var(--color-ink-muted)] flex items-center gap-1.5">
          {typeof spark === "number" && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10.5px] font-medium"
              style={{
                background: spark >= 0 ? "rgba(118,161,96,0.14)" : "rgba(226,94,68,0.14)",
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
