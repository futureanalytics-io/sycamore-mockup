"use client";

import { useMemo } from "react";
import { usePortalStore } from "@/lib/store";
import { RagBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConditionChart } from "@/components/condition-chart";
import { formatGbpFull, formatArea, RAG_COLORS } from "@/lib/rag";
import { ClipboardCheck, MapPin, Pencil, ArrowRight, History, Camera } from "lucide-react";

interface BuildingDetailProps {
  onOpenEditor: (mode: "audit" | "edit") => void;
}

export function BuildingDetail({ onOpenEditor }: BuildingDetailProps) {
  const { buildings, selectedSectionId, auditLog, selectSection } = usePortalStore();

  const selected = useMemo(() => {
    if (!selectedSectionId) return null;
    for (const b of buildings) {
      const s = b.sections.find((s) => s.id === selectedSectionId);
      if (s) return { section: s, building: b };
    }
    return null;
  }, [buildings, selectedSectionId]);

  const sectionAudits = useMemo(() => {
    if (!selectedSectionId) return [];
    return auditLog.filter((a) => a.sectionId === selectedSectionId).slice(0, 4);
  }, [auditLog, selectedSectionId]);

  if (!selected) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-cream-soft)]/60 h-full min-h-[260px] xl:min-h-[560px] flex flex-col items-center justify-center text-center px-6 py-8 sm:px-8 sm:py-10">
        <div className="h-12 w-12 rounded-full bg-[color:var(--color-sycamore-soft)] flex items-center justify-center mb-4">
          <MapPin className="h-5 w-5 text-[color:var(--color-sycamore)]" />
        </div>
        <div className="font-display text-[15px] font-semibold text-[color:var(--color-ink-strong)]">
          Select a roof section
        </div>
        <div className="text-[13px] text-[color:var(--color-ink-muted)] mt-1.5 max-w-[260px]">
          Click any section on the campus map. Inspect condition, edit master
          data, or log a new audit from the field.
        </div>
        <div className="mt-6 flex items-center gap-2 text-[11px] text-[color:var(--color-ink-muted)]">
          <span className="inline-block w-8 border-t border-[color:var(--color-line-strong)]" />
          <span>Tip</span>
          <span className="inline-block w-8 border-t border-[color:var(--color-line-strong)]" />
        </div>
        <div className="text-[11.5px] text-[color:var(--color-ink-soft)] mt-2 max-w-[240px]">
          Hover a section to preview area, cost and RAG without opening it.
        </div>
      </div>
    );
  }

  const { section, building } = selected;
  const rag = RAG_COLORS[section.rag];

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] h-full min-h-[560px] flex flex-col overflow-hidden shadow-[0_1px_2px_rgba(17,32,37,0.04)]">
      {/* Coloured top band */}
      <div className="h-1.5 w-full" style={{ background: rag.fill }} />

      {/* Header */}
      <div className="px-5 pt-4 pb-4 border-b border-[color:var(--color-line)]">
        <div className="text-[11px] uppercase tracking-[0.16em] font-display font-semibold text-[color:var(--color-sycamore)] mb-1">
          {building.code} · {building.name}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="font-display text-[26px] font-semibold leading-none text-[color:var(--color-ink-strong)]">
            {section.id}
          </div>
          <RagBadge rag={section.rag} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-[color:var(--color-line)]">
        <StatCell label="Roof area" value={formatArea(section.areaSqm)} />
        <StatCell label="Forecast cost" value={formatGbpFull(section.forecastCostGbp)} />
        <StatCell label="Roof type" value={section.roofType} />
        <StatCell
          label="Life remaining"
          value={`${section.lifeRemainingYears} ${section.lifeRemainingYears === 1 ? "year" : "years"}`}
        />
      </div>

      {/* Chart */}
      <div className="px-5 py-4 border-b border-[color:var(--color-line)]">
        <div className="text-[11px] uppercase tracking-[0.16em] font-display font-semibold text-[color:var(--color-ink-muted)] mb-2 flex items-center justify-between">
          <span>Sections in {building.code} by RAG</span>
          <span className="tabular-nums normal-case tracking-normal font-body text-[color:var(--color-ink-faint)]">
            {building.sections.length} total
          </span>
        </div>
        <ConditionChart building={building} />
      </div>

      {/* Audit history */}
      <div className="px-5 py-4 border-b border-[color:var(--color-line)] flex-1 overflow-auto min-h-0">
        <div className="text-[11px] uppercase tracking-[0.16em] font-display font-semibold text-[color:var(--color-ink-muted)] mb-2.5 flex items-center gap-1.5">
          <History className="h-3 w-3" /> Audit history
        </div>
        {sectionAudits.length === 0 ? (
          <div className="text-[12.5px] text-[color:var(--color-ink-faint)]">No audits recorded yet for this section.</div>
        ) : (
          <div className="space-y-3">
            {sectionAudits.map((a) => (
              <div
                key={a.id}
                className="flex gap-3 items-start cursor-pointer hover:bg-[color:var(--color-cream)] rounded-lg p-2 -mx-2 transition-colors"
                onClick={() => selectSection(a.sectionId)}
              >
                <div className="flex flex-col items-center gap-1 mt-0.5 shrink-0">
                  <RagBadge rag={a.ragBefore} size="sm" />
                  <ArrowRight className="h-2.5 w-2.5 text-[color:var(--color-ink-faint)]" />
                  <RagBadge rag={a.ragAfter} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11.5px]">
                    <span className="font-medium text-[color:var(--color-ink-strong)]">{a.auditor}</span>
                    <span className="text-[color:var(--color-ink-faint)]">
                      {new Date(a.timestamp).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-[12px] text-[color:var(--color-ink-soft)] leading-snug line-clamp-2 mt-0.5">
                    {a.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Site photos */}
      {section.photos.length > 0 && (
        <div className="px-5 py-4 border-b border-[color:var(--color-line)]">
          <div className="text-[11px] uppercase tracking-[0.16em] font-display font-semibold text-[color:var(--color-ink-muted)] mb-2.5 flex items-center gap-1.5">
            <Camera className="h-3 w-3" /> Site photos
            <span className="ml-auto tabular-nums normal-case tracking-normal font-body text-[color:var(--color-ink-faint)]">
              {section.photos.length}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {section.photos.map((p) => (
              <div
                key={p.id}
                className="h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-cream)]"
                title={`${p.caption} — ${p.auditor}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.dataUrl} alt={p.caption} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="px-5 py-4 flex gap-2">
        <Button onClick={() => onOpenEditor("edit")} variant="outline" className="flex-1">
          <Pencil className="h-3.5 w-3.5" /> Edit details
        </Button>
        <Button onClick={() => onOpenEditor("audit")} className="flex-1">
          <ClipboardCheck className="h-3.5 w-3.5" /> Log audit
        </Button>
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[color:var(--color-paper)] px-5 py-3">
      <div className="text-[10px] text-[color:var(--color-ink-muted)] mb-1 uppercase tracking-[0.12em] font-display font-semibold">
        {label}
      </div>
      <div className="text-[13.5px] text-[color:var(--color-ink-strong)] font-medium">{value}</div>
    </div>
  );
}
