"use client";

/*
 * Evidence gallery — the genuine survey photographs grouped by the defect type
 * they document. Clicking a photo opens the matching defects in the modal.
 */
import Image from "next/image";
import { useUnipolStore } from "@/lib/unipol-store";
import { photosForCategory, WORK_CATEGORIES, type Defect, type WorkCategory } from "@/lib/unipol-data";

function CategoryBlock({ category, defects }: { category: WorkCategory; defects: Defect[] }) {
  const openGroup = useUnipolStore((s) => s.openGroup);
  const photos = photosForCategory(category);
  const rows = defects.filter((d) => d.workCategory === category);
  if (!rows.length) return null;

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h3 className="font-display font-semibold text-[15px] text-[color:var(--color-ink-strong)]">{category}</h3>
          <p className="text-[12px] text-[color:var(--color-ink-muted)]">{rows.length} defect{rows.length > 1 ? "s" : ""} in current selection</p>
        </div>
        <button
          type="button"
          onClick={() => openGroup({ title: `${category} defects`, defects: rows })}
          className="text-[11.5px] font-medium text-[color:var(--color-sycamore)] hover:underline"
        >
          View all {rows.length} →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p) => (
          <button
            key={p.src}
            type="button"
            onClick={() => openGroup({ title: `${category} defects`, defects: rows })}
            className="group text-left rounded-xl overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-paper)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all"
          >
            <div className="relative aspect-[4/3] bg-[color:var(--color-cream)]">
              <Image src={p.src} alt={p.caption} fill sizes="(max-width:640px) 50vw, 240px" className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
            </div>
            <p className="text-[11px] leading-snug text-[color:var(--color-ink-muted)] px-2.5 py-2">{p.caption}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function UnipolEvidence({ defects }: { defects: Defect[] }) {
  const hasAny = defects.length > 0;
  return (
    <div className="space-y-7">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">Survey evidence</div>
        <h2 className="brand-title text-[22px] leading-none">Photographic record</h2>
        <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-2 max-w-[640px]">
          On-site photographs captured during the compartmentation survey, grouped by defect type. Click any image to open the related defects.
        </p>
      </div>
      {hasAny ? (
        WORK_CATEGORIES.map((c) => <CategoryBlock key={c} category={c} defects={defects} />)
      ) : (
        <p className="text-[12.5px] text-[color:var(--color-ink-muted)]">No evidence matches the current slicers.</p>
      )}
    </div>
  );
}
