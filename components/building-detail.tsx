"use client";

import { useMemo } from "react";
import { usePortalStore } from "@/lib/store";
import { RagBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConditionChart } from "@/components/condition-chart";
import { formatGbpFull, formatArea } from "@/lib/rag";
import { ClipboardCheck, MapPin } from "lucide-react";

interface BuildingDetailProps {
  onOpenAudit: () => void;
}

export function BuildingDetail({ onOpenAudit }: BuildingDetailProps) {
  const { buildings, selectedSectionId, auditLog } = usePortalStore();

  const selected = useMemo(() => {
    if (!selectedSectionId) return null;
    for (const b of buildings) {
      const s = b.sections.find((s) => s.id === selectedSectionId);
      if (s) return { section: s, building: b };
    }
    return null;
  }, [buildings, selectedSectionId]);

  const lastAudit = useMemo(() => {
    if (!selectedSectionId) return null;
    return auditLog.find((a) => a.sectionId === selectedSectionId) || null;
  }, [auditLog, selectedSectionId]);

  if (!selected) {
    return (
      <div className="rounded-lg border border-dashed border-[color:var(--color-border-strong)] bg-white/40 h-[560px] flex flex-col items-center justify-center text-center px-6">
        <div className="h-9 w-9 rounded-full bg-[color:var(--color-sycamore-soft)] flex items-center justify-center mb-3">
          <MapPin className="h-4 w-4 text-[color:var(--color-sycamore)]" />
        </div>
        <div className="text-[13px] font-medium text-[color:var(--color-foreground)]">
          Click a roof section on the map
        </div>
        <div className="text-[12px] text-[color:var(--color-muted)] mt-1 max-w-[220px]">
          Section details, condition history and audit logging appear here.
        </div>
      </div>
    );
  }

  const { section, building } = selected;

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white h-[560px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[color:var(--color-border)]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="text-[18px] font-medium leading-tight">{section.id}</div>
          <RagBadge rag={section.rag} />
        </div>
        <div className="text-[12px] text-[color:var(--color-muted)]">{building.name}</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-[color:var(--color-border)]">
        <StatCell label="Area" value={formatArea(section.areaSqm)} />
        <StatCell label="Forecast cost" value={formatGbpFull(section.forecastCostGbp)} />
        <StatCell label="Roof type" value={section.roofType} />
        <StatCell
          label="Life remaining"
          value={`${section.lifeRemainingYears} ${section.lifeRemainingYears === 1 ? "year" : "years"}`}
        />
      </div>

      {/* Chart */}
      <div className="px-4 py-3 border-b border-[color:var(--color-border)]">
        <div className="text-[11px] text-[color:var(--color-muted)] mb-1.5 flex items-center justify-between">
          <span>Sections in {building.code} by condition</span>
          <span className="tabular-nums">{building.sections.length} total</span>
        </div>
        <ConditionChart building={building} />
      </div>

      {/* Last audit */}
      <div className="px-4 py-3 border-b border-[color:var(--color-border)] flex-1 overflow-auto">
        <div className="text-[11px] text-[color:var(--color-muted)] mb-1.5">Most recent audit</div>
        {lastAudit ? (
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[color:var(--color-foreground)] mb-1">
              <span>{lastAudit.auditor}</span>
              <span className="text-[color:var(--color-faint)]">·</span>
              <span className="text-[color:var(--color-muted)]">
                {new Date(lastAudit.timestamp).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="text-[12px] text-[color:var(--color-muted)] leading-snug line-clamp-3">
              {lastAudit.notes}
            </div>
          </div>
        ) : (
          <div className="text-[12px] text-[color:var(--color-faint)]">No audits yet for this section.</div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 py-3">
        <Button onClick={onOpenAudit} className="w-full">
          <ClipboardCheck className="h-3.5 w-3.5" />
          Log roof audit
        </Button>
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-2.5">
      <div className="text-[10.5px] text-[color:var(--color-muted)] mb-0.5 uppercase tracking-wide">{label}</div>
      <div className="text-[13px] text-[color:var(--color-foreground)]">{value}</div>
    </div>
  );
}
