"use client";

/*
 * SycKPI — Sycamore Square's metrics catalogue (layout inspired by the Cool
 * Clean OS CoolKPI page, rebuilt in the Sycamore teal/Poppins system around
 * a building-surveying consultancy's real operations). Category filter tabs,
 * four featured metric cards, and a detailed metrics table. Illustrative data.
 */
import { useState } from "react";
import { KPIS, KPI_AREAS, type KpiArea, type Kpi, type Sentiment } from "@/lib/kpi-data";
import { TrendingUp, TrendingDown, Minus, Gauge } from "lucide-react";

type Filter = "All" | KpiArea;
const FILTERS: Filter[] = ["All", ...KPI_AREAS];

function sentimentColor(s: Sentiment) {
  if (s === "good") return "text-[color:var(--color-accent-green)]";
  if (s === "bad") return "text-[color:var(--color-rag-red)]";
  return "text-[color:var(--color-ink-muted)]";
}

function TrendBadge({ kpi, size = "sm" }: { kpi: Kpi; size?: "sm" | "lg" }) {
  const Icon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-1 font-display font-bold ${size === "lg" ? "text-[13px]" : "text-[12px]"} ${sentimentColor(kpi.sentiment)}`}>
      <Icon className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      {kpi.change}
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-white text-[9.5px] font-bold font-display"
      style={{ background: "var(--gradient-brand)" }}
    >
      {initials}
    </span>
  );
}

export function SycKPI() {
  const [filter, setFilter] = useState<Filter>("All");

  const shown = filter === "All" ? KPIS : KPIS.filter((k) => k.area === filter);
  const featured = KPIS.filter((k) => k.featured);

  return (
    <div className="space-y-5">
      {/* hero */}
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-5 py-5 sm:px-7 sm:py-6 shadow-[0_1px_3px_rgba(20,36,43,0.05),0_10px_30px_-16px_rgba(20,36,43,0.18)]">
        <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-2.5 rounded-full bg-[color:var(--color-paper)]/70 border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
          <Gauge className="h-3 w-3" />
          Metrics catalogue · Live
        </div>
        <h1 className="brand-title text-[28px] leading-none">SycKPI</h1>
        <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-3 max-w-[720px]">
          The numbers that matter to a director-led consultancy — report delivery, framework wins,
          compliance, the response promise you market on, and your team&apos;s capacity. Every metric is
          owned by a named person and refreshes as the work flows through the platform.
        </p>
      </div>

      {/* featured cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {featured.map((k) => (
          <div key={k.name} className="surface-raised rounded-2xl p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.14em] font-display font-bold text-[color:var(--color-sycamore)]">{k.area}</span>
              <span className="flex items-center gap-1.5 text-[10.5px] text-[color:var(--color-ink-muted)]">
                <Avatar initials={k.ownerInitials} />
              </span>
            </div>
            <div className="mt-2.5 font-display font-bold text-[32px] leading-none text-[color:var(--color-ink-strong)]">
              {k.value}
              {k.unit && <span className="text-[14px] font-semibold text-[color:var(--color-ink-muted)] ml-1">{k.unit}</span>}
            </div>
            <div className="text-[12.5px] font-display font-semibold text-[color:var(--color-ink-strong)] mt-1.5">{k.name}</div>
            <div className="mt-auto pt-3 flex items-center gap-4 text-[11px] text-[color:var(--color-ink-muted)]">
              <span>YTD <b className={`font-display ${sentimentColor(k.sentiment)}`}>{k.ytd}</b></span>
              <span>MTD <b className={`font-display ${sentimentColor(k.sentiment)}`}>{k.mtd}</b></span>
            </div>
          </div>
        ))}
      </div>

      {/* category filter tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-cream-edge)]/60 p-1 w-fit shadow-[inset_0_1px_2px_rgba(20,36,43,0.05)]">
        {FILTERS.map((f) => {
          const on = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={on}
              className={`rounded-full h-8 px-3.5 text-[12.5px] font-display font-semibold transition-all duration-200 ${
                on
                  ? "bg-gradient-to-b from-white to-[color:var(--color-sycamore-tint)] text-[color:var(--color-sycamore-strong)] shadow-[0_1px_3px_rgba(20,36,43,0.12),0_3px_10px_-3px_rgba(55,117,135,0.30)] ring-1 ring-[color:var(--color-sycamore)]/15"
                  : "text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink-strong)]"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* detailed metrics table */}
      <div className="surface-raised rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-[color:var(--color-sycamore-tint)]">
                {["Metric", "Area", "Definition", "Owner", "Latest", "Trend", "Updated"].map((h) => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-[0.08em] font-display font-bold text-[color:var(--color-ink-soft)] px-4 py-3 border-b border-[color:var(--color-line)] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((k) => (
                <tr key={k.name} className="hover:bg-[color:var(--color-cream-soft)] transition-colors">
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)] font-display font-semibold text-[13px] text-[color:var(--color-ink-strong)] whitespace-nowrap">{k.name}</td>
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)]">
                    <span className="text-[11px] font-display font-semibold px-2 py-0.5 rounded-full bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]">{k.area}</span>
                  </td>
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)] text-[12px] text-[color:var(--color-ink-muted)] max-w-[320px]">{k.definition}</td>
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)]">
                    <span className="inline-flex items-center gap-2 text-[12px] text-[color:var(--color-ink-soft)] whitespace-nowrap">
                      <Avatar initials={k.ownerInitials} />{k.owner}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)] font-display font-bold text-[14px] text-[color:var(--color-ink-strong)] whitespace-nowrap">
                    {k.value}{k.unit && <span className="text-[11px] font-semibold text-[color:var(--color-ink-muted)] ml-0.5">{k.unit}</span>}
                  </td>
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)] whitespace-nowrap"><TrendBadge kpi={k} /></td>
                  <td className="px-4 py-3 border-b border-[color:var(--color-line)] text-[12px] text-[color:var(--color-ink-muted)] whitespace-nowrap">{k.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-[11px] text-[color:var(--color-ink-muted)] bg-[color:var(--color-cream-soft)] border-t border-[color:var(--color-line)]">
          Showing {shown.length} of {KPIS.length} metrics · illustrative figures for demonstration.
        </div>
      </div>
    </div>
  );
}
