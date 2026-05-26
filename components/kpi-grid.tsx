"use client";

import { useShallow } from "zustand/react/shallow";
import { usePortalStore, selectKpis } from "@/lib/store";
import { formatGbp, formatArea } from "@/lib/rag";
import { PoundSterling, CalendarClock, AlertTriangle } from "lucide-react";

interface KpiTileProps {
  label: string;
  value: string;
  accent?: string;
  swatch?: string;
  icon?: React.ReactNode;
}

function KpiTile({ label, value, accent, swatch, icon }: KpiTileProps) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-3 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-muted)]">
        {swatch && (
          <span
            className="inline-block h-2 w-2 rounded-sm"
            style={{ backgroundColor: swatch }}
          />
        )}
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div
        className="text-[22px] font-medium leading-none tabular-nums"
        style={{ color: accent || "var(--color-foreground)" }}
      >
        {value}
      </div>
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
        icon={<PoundSterling className="h-3 w-3" />}
      />
      <KpiTile
        label="10-year plan"
        value={formatGbp(kpis.tenYearPlan)}
        icon={<CalendarClock className="h-3 w-3" />}
      />
      <KpiTile
        label="Red area"
        value={formatArea(kpis.redArea)}
        swatch="#E24B4A"
        accent="#A32D2D"
      />
      <KpiTile
        label="Amber area"
        value={formatArea(kpis.amberArea)}
        swatch="#EF9F27"
        accent="#9A5E0F"
      />
      <KpiTile
        label="Green area"
        value={formatArea(kpis.greenArea)}
        swatch="#97C459"
        accent="#3B6D11"
      />
      <KpiTile
        label="Sections with issues"
        value={String(kpis.sectionsWithIssues)}
        icon={<AlertTriangle className="h-3 w-3" />}
      />
    </div>
  );
}
