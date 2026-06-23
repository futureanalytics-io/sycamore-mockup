"use client";

/*
 * Remedial plan — the verbatim Scope text presented as a works specification,
 * sequenced by the survey's own Timeline urgency (Urgently → 3–6 months →
 * unscheduled). The single "additional survey required" item is flagged. This
 * turns the survey output into an actionable, prioritised programme.
 */
import { useUnipolStore } from "@/lib/unipol-store";
import { PRIORITY_META, type Defect, type Priority } from "@/lib/unipol-data";
import { AlertTriangle, Clock, FileSearch, ArrowRight } from "lucide-react";

const BUCKETS: { key: string; label: string; match: (d: Defect) => boolean; tone: string; icon: React.ReactNode }[] = [
  { key: "urgent", label: "Urgently", match: (d) => d.timeline === "Urgently", tone: "#D64550", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { key: "3-6", label: "3–6 Months", match: (d) => d.timeline === "3-6 Months", tone: "#FFBF00", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "none", label: "Not yet scheduled", match: (d) => !d.timeline, tone: "#7a9bb0", icon: <Clock className="h-3.5 w-3.5" /> },
];

const PRIORITY_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

function SpecRow({ defect }: { defect: Defect }) {
  const openGroup = useUnipolStore((s) => s.openGroup);
  const m = PRIORITY_META[defect.priority];
  return (
    <button
      type="button"
      onClick={() => openGroup({ title: `${defect.ref} · ${defect.buildingName}`, subtitle: defect.location, defects: [defect] })}
      className="w-full text-left rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] p-3.5 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <span className="font-display font-semibold text-[12.5px] text-[color:var(--color-ink-strong)]">{defect.ref}</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium font-display"
          style={{ background: m.bg, color: m.text }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.fill }} />
          {defect.priority}
        </span>
        <span className="text-[11px] text-[color:var(--color-ink-muted)]">{defect.buildingName} · {defect.location}</span>
        <span className="text-[11px] text-[color:var(--color-ink-muted)] ml-auto tabular-nums">Qty {defect.quantity}</span>
        {defect.additionalSurvey && (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium" style={{ background: "rgba(214,69,80,0.1)", color: "#9b2530" }}>
            <FileSearch className="h-3 w-3" /> Survey
          </span>
        )}
      </div>
      <p className="text-[12.5px] leading-relaxed text-[color:var(--color-ink-soft)]">{defect.scope}</p>
      <div className="mt-1.5 text-[11px] font-medium text-[color:var(--color-sycamore)] opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
        Open detail <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  );
}

export function UnipolRemedial({ defects }: { defects: Defect[] }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">Remedial programme</div>
        <h2 className="brand-title text-[22px] leading-none">Scope of works, by urgency</h2>
        <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-2 max-w-[660px]">
          Each item is the surveyor&apos;s remedial specification, sequenced by the assessed timeline. Click any item for the full detail and evidence.
        </p>
      </div>

      {BUCKETS.map((bucket) => {
        const rows = defects
          .filter(bucket.match)
          .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        if (!rows.length) return null;
        const qty = rows.reduce((s, d) => s + d.quantity, 0);
        return (
          <div key={bucket.key}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 h-7 text-[12px] font-display font-semibold text-white" style={{ background: bucket.tone }}>
                {bucket.icon}
                {bucket.label}
              </span>
              <span className="text-[11.5px] text-[color:var(--color-ink-muted)]">
                {rows.length} item{rows.length > 1 ? "s" : ""} · {qty} unit{qty > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
              {rows.map((d) => <SpecRow key={d.ref} defect={d} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
