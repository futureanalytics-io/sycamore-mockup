"use client";

/*
 * The six Power BI slicers, rebuilt as live cross-filters: Priority, RAG,
 * Building, Work Category (chip toggles), Location (dropdown) and Quantity
 * (range slider). Every change updates the KPIs, charts and register instantly.
 * "Clear all" resets to the full dataset.
 */
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnipolStore } from "@/lib/unipol-store";
import {
  BUILDINGS,
  LOCATIONS,
  PRIORITIES,
  PRIORITY_META,
  RAGS,
  RAG_FILL,
  WORK_CATEGORIES,
  QUANTITY_MIN,
  QUANTITY_MAX,
  DEFECTS,
  applyFilters,
  filtersActive,
} from "@/lib/unipol-data";
import { SlidersHorizontal, X } from "lucide-react";

function Chip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 h-7 text-[12px] font-medium font-display transition-all ${
        active
          ? "border-transparent text-white shadow-[0_1px_3px_rgba(20,36,43,0.18)]"
          : "border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-sycamore)]/40 hover:text-[color:var(--color-ink-strong)]"
      }`}
      style={active ? { background: color || "var(--color-sycamore)" } : undefined}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ background: active ? "rgba(255,255,255,0.9)" : color }} />}
      {label}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-display font-semibold">{label}</div>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  );
}

export function UnipolSlicers() {
  const filters = useUnipolStore((s) => s.filters);
  const togglePriority = useUnipolStore((s) => s.togglePriority);
  const toggleRag = useUnipolStore((s) => s.toggleRag);
  const toggleBuilding = useUnipolStore((s) => s.toggleBuilding);
  const toggleWorkCategory = useUnipolStore((s) => s.toggleWorkCategory);
  const setLocation = useUnipolStore((s) => s.setLocation);
  const setQuantity = useUnipolStore((s) => s.setQuantity);
  const clearFilters = useUnipolStore((s) => s.clearFilters);
  const active = filtersActive(filters);
  const shown = applyFilters(DEFECTS, filters).length;

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] shadow-[var(--shadow-sm)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[12px] font-display font-semibold text-[color:var(--color-ink-strong)]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[color:var(--color-sycamore)]" />
          Slicers
          <span className="text-[11px] font-body font-normal text-[color:var(--color-ink-muted)]">
            · showing {shown} of {DEFECTS.length} defects
          </span>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!active}
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[color:var(--color-ink-muted)] enabled:hover:text-[color:var(--color-sycamore)] disabled:opacity-40 transition-colors"
        >
          <X className="h-3 w-3" /> Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <Group label="Priority">
          {PRIORITIES.map((p) => (
            <Chip key={p} label={p} color={PRIORITY_META[p].fill} active={filters.priorities.includes(p)} onClick={() => togglePriority(p)} />
          ))}
        </Group>

        <Group label="RAG">
          {RAGS.map((r) => (
            <Chip key={r} label={r} color={RAG_FILL[r]} active={filters.rags.includes(r)} onClick={() => toggleRag(r)} />
          ))}
        </Group>

        <Group label="Work category">
          {WORK_CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={filters.workCategories.includes(c)} onClick={() => toggleWorkCategory(c)} />
          ))}
        </Group>

        <Group label="Building">
          {BUILDINGS.map((b) => (
            <Chip key={b} label={b} active={filters.buildings.includes(b)} onClick={() => toggleBuilding(b)} />
          ))}
        </Group>

        <Group label="Location">
          <Select value={filters.location} onValueChange={setLocation}>
            <SelectTrigger className="h-8 w-full max-w-[220px] text-[12.5px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Group>

        <Group label={`Quantity · ${filters.quantity[0]}–${filters.quantity[1]} units`}>
          <SliderPrimitive.Root
            className="relative flex w-full max-w-[220px] touch-none select-none items-center h-5"
            min={QUANTITY_MIN}
            max={QUANTITY_MAX}
            step={1}
            value={filters.quantity}
            onValueChange={(v) => setQuantity([v[0], v[1]] as [number, number])}
            minStepsBetweenThumbs={0}
          >
            <SliderPrimitive.Track className="relative h-[5px] w-full grow overflow-hidden rounded-full bg-[color:var(--color-cream-edge)]">
              <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[color:var(--color-sycamore)] to-[color:var(--color-sycamore-strong)]" />
            </SliderPrimitive.Track>
            {filters.quantity.map((_, i) => (
              <SliderPrimitive.Thumb
                key={i}
                className="block h-4 w-4 rounded-full border-2 border-[color:var(--color-sycamore)] bg-white shadow-[0_2px_4px_rgba(17,32,37,0.15)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sycamore)]/30 hover:scale-110 transition-transform cursor-grab active:cursor-grabbing"
              />
            ))}
          </SliderPrimitive.Root>
        </Group>
      </div>
    </div>
  );
}
