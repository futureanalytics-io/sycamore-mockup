"use client";

/*
 * Defect register — every row of the survey, filtered live by the slicers.
 * Each row shows a thumbnail of its evidence + verbatim observation; clicking
 * opens the full defect modal.
 */
import { useUnipolStore } from "@/lib/unipol-store";
import { PRIORITY_META, photoForDefect, type Defect } from "@/lib/unipol-data";

function PriorityPill({ defect }: { defect: Defect }) {
  const m = PRIORITY_META[defect.priority];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium font-display whitespace-nowrap"
      style={{ background: m.bg, color: m.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.fill }} />
      {defect.priority}
    </span>
  );
}

export function DefectTable({ defects }: { defects: Defect[] }) {
  const openGroup = useUnipolStore((s) => s.openGroup);

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] overflow-hidden bg-[color:var(--color-paper)] shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[color:var(--color-cream-soft)] border-b border-[color:var(--color-line)] text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--color-ink-muted)] font-display font-semibold">
              <th className="px-3 py-2.5 w-[56px]">Ref</th>
              <th className="px-3 py-2.5">Building / location</th>
              <th className="px-3 py-2.5">Observation</th>
              <th className="px-3 py-2.5 w-[120px]">Category</th>
              <th className="px-3 py-2.5 w-[64px] text-right">Qty</th>
              <th className="px-3 py-2.5 w-[110px]">Timeline</th>
              <th className="px-3 py-2.5 w-[96px]">Priority</th>
            </tr>
          </thead>
          <tbody>
            {defects.map((d) => (
              <tr
                key={d.ref}
                onClick={() => openGroup({ title: `${d.ref} · ${d.buildingName}`, subtitle: d.location, defects: [d] })}
                className="border-b border-[color:var(--color-line)] last:border-0 hover:bg-[color:var(--color-cream)] cursor-pointer transition-colors align-top"
              >
                <td className="px-3 py-2.5 font-display font-semibold text-[12px] text-[color:var(--color-ink-strong)]">{d.ref}</td>
                <td className="px-3 py-2.5">
                  <div className="text-[12.5px] font-medium text-[color:var(--color-ink-strong)]">{d.buildingName}</div>
                  <div className="text-[11px] text-[color:var(--color-ink-muted)]">{d.location}</div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-2 items-start">
                    <span
                      className="h-9 w-12 shrink-0 rounded bg-cover bg-center border border-[color:var(--color-line)]"
                      style={{ backgroundImage: `url(${photoForDefect(d).src})` }}
                    />
                    <span className="text-[12px] leading-snug text-[color:var(--color-ink-soft)] line-clamp-2 max-w-[360px]">{d.observation}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[12px] text-[color:var(--color-ink-soft)]">{d.workCategory}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-[12.5px] font-medium text-[color:var(--color-ink-strong)]">{d.quantity}</td>
                <td className="px-3 py-2.5 text-[11.5px] text-[color:var(--color-ink-soft)]">{d.timeline ?? "Not scheduled"}</td>
                <td className="px-3 py-2.5"><PriorityPill defect={d} /></td>
              </tr>
            ))}
            {defects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-[12.5px] text-[color:var(--color-ink-muted)]">
                  No defects match the current slicers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
