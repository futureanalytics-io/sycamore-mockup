"use client";

/*
 * The rich hover panel shown when the user hovers a chart segment (via a custom
 * Recharts Tooltip) or a register row. It surfaces the real survey evidence —
 * photo thumbnails + verbatim observations — for whatever was hovered, so the
 * analytics are explorable without clicking. Click opens the full modal.
 */
import {
  PRIORITY_META,
  photoForDefect,
  type Defect,
  type SurveyPhoto,
} from "@/lib/unipol-data";

function PriorityDot({ defect }: { defect: Defect }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full shrink-0"
      style={{ background: PRIORITY_META[defect.priority].fill }}
    />
  );
}

export function DefectHoverCard({
  title,
  subtitle,
  defects,
  metric,
}: {
  title: string;
  subtitle?: string;
  defects: Defect[];
  metric?: string;
}) {
  if (!defects.length) {
    return (
      <div className="rounded-xl border border-[color:var(--color-line)] bg-white shadow-[0_12px_32px_rgba(17,32,37,0.18)] px-3.5 py-3 w-[240px]">
        <div className="font-display font-semibold text-[13px] text-[color:var(--color-ink-strong)]">{title}</div>
        <div className="text-[11.5px] text-[color:var(--color-ink-muted)] mt-1">No items in current selection.</div>
      </div>
    );
  }

  // Distinct evidence thumbnails (up to 3) for the hovered group.
  const thumbs: SurveyPhoto[] = [];
  const seenSrc = new Set<string>();
  for (const d of defects) {
    const p = photoForDefect(d);
    if (!seenSrc.has(p.src)) {
      seenSrc.add(p.src);
      thumbs.push(p);
    }
    if (thumbs.length >= 3) break;
  }

  const shown = defects.slice(0, 3);
  const more = defects.length - shown.length;

  return (
    <div className="rounded-xl border border-[color:var(--color-line)] bg-white shadow-[0_12px_32px_rgba(17,32,37,0.18)] overflow-hidden w-[286px]">
      <div className="px-3.5 pt-3 pb-2 flex items-start justify-between gap-2 border-b border-[color:var(--color-line)] bg-[color:var(--color-cream-soft)]">
        <div className="min-w-0">
          <div className="font-display font-semibold text-[13px] text-[color:var(--color-ink-strong)] leading-tight truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-[10.5px] text-[color:var(--color-ink-muted)] mt-0.5 truncate">{subtitle}</div>
          )}
        </div>
        {metric && (
          <div className="font-display font-bold text-[15px] tabular-nums text-[color:var(--color-ink-strong)] shrink-0">
            {metric}
          </div>
        )}
      </div>

      {thumbs.length > 0 && (
        <div className="flex gap-1 p-2 pb-1.5">
          {thumbs.map((t) => (
            <div
              key={t.src}
              className="h-14 flex-1 rounded-md bg-cover bg-center border border-[color:var(--color-line)]"
              style={{ backgroundImage: `url(${t.src})` }}
            />
          ))}
        </div>
      )}

      <div className="px-3.5 py-2 space-y-1.5">
        {shown.map((d) => (
          <div key={d.ref} className="flex items-start gap-1.5 text-[11.5px] leading-snug">
            <span className="mt-1">
              <PriorityDot defect={d} />
            </span>
            <span className="text-[color:var(--color-ink-soft)]">
              <span className="font-semibold text-[color:var(--color-ink-strong)]">{d.ref}</span>{" "}
              <span className="text-[color:var(--color-ink-muted)]">· {d.location}</span>
              <br />
              <span className="line-clamp-2">{d.observation}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="px-3.5 pb-2.5 pt-0.5 text-[10.5px] text-[color:var(--color-ink-muted)] flex items-center justify-between">
        <span>{more > 0 ? `+${more} more item${more > 1 ? "s" : ""}` : `${defects.length} item${defects.length > 1 ? "s" : ""}`}</span>
        <span className="text-[color:var(--color-sycamore)] font-medium">Click for detail →</span>
      </div>
    </div>
  );
}
