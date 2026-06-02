"use client";

import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePortalStore, selectAllSections } from "@/lib/store";
import { RagBadge } from "@/components/ui/badge";
import { formatGbpFull, formatArea } from "@/lib/rag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search, Building2 } from "lucide-react";
import type { RagStatus } from "@/lib/types";

type SortKey = "id" | "areaSqm" | "forecastCostGbp" | "lifeRemainingYears";

export function AssetsTable() {
  const sections = usePortalStore(useShallow(selectAllSections));
  const buildings = usePortalStore((s) => s.buildings);
  const selectSection = usePortalStore((s) => s.selectSection);

  const [search, setSearch] = useState("");
  const [filterRag, setFilterRag] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const buildingNameByCode = useMemo(
    () => Object.fromEntries(buildings.map((b) => [b.code, b.name])),
    [buildings]
  );

  const rows = useMemo(() => {
    let list = sections.slice();
    if (filterRag !== "all") list = list.filter((s) => s.rag === (filterRag as RagStatus));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          (buildingNameByCode[s.buildingCode] || "").toLowerCase().includes(q) ||
          s.roofType.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else cmp = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [sections, search, filterRag, sortKey, sortDir, buildingNameByCode]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[color:var(--color-line)] bg-[color:var(--color-cream-soft)]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[color:var(--color-eggplant-soft)] flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-[color:var(--color-eggplant)]" />
          </div>
          <div>
            <div className="font-display font-semibold text-[13.5px] text-[color:var(--color-ink-strong)]">
              Roof asset register
            </div>
            <div className="text-[11px] text-[color:var(--color-ink-muted)]">
              {rows.length} of {sections.length} sections
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[color:var(--color-ink-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search section, building, roof type…"
            className="h-9 w-[280px] pl-9 pr-3 rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] text-[12.5px] text-[color:var(--color-ink-strong)] placeholder:text-[color:var(--color-ink-faint)] focus:outline-none focus:border-[color:var(--color-sycamore)]/50 focus:ring-2 focus:ring-[color:var(--color-sycamore)]/15 transition-colors"
          />
        </div>
        <div className="w-[150px]">
          <Select value={filterRag} onValueChange={setFilterRag}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All RAG</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="amber">Amber</SelectItem>
              <SelectItem value="green">Green</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] bg-[color:var(--color-cream-soft)]/40 font-display font-semibold">
              <Th onClick={() => toggleSort("id")} active={sortKey === "id"}>
                Section
              </Th>
              <th className="text-left font-semibold px-2 py-2.5">Building</th>
              <th className="text-left font-semibold px-2 py-2.5">Roof type</th>
              <Th onClick={() => toggleSort("areaSqm")} active={sortKey === "areaSqm"}>
                Area
              </Th>
              <Th
                onClick={() => toggleSort("forecastCostGbp")}
                active={sortKey === "forecastCostGbp"}
              >
                Forecast cost
              </Th>
              <th className="text-left font-semibold px-2 py-2.5">RAG</th>
              <Th
                onClick={() => toggleSort("lifeRemainingYears")}
                active={sortKey === "lifeRemainingYears"}
              >
                Life
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.id}
                className="border-t border-[color:var(--color-line)] hover:bg-[color:var(--color-cream)] cursor-pointer transition-colors"
                onClick={() => selectSection(s.id)}
              >
                <td className="px-5 py-2.5 font-display font-semibold text-[color:var(--color-sycamore)]">
                  {s.id}
                </td>
                <td className="px-2 py-2.5 text-[color:var(--color-ink-soft)]">
                  {buildingNameByCode[s.buildingCode] || s.buildingCode}
                </td>
                <td className="px-2 py-2.5 text-[color:var(--color-ink-soft)]">{s.roofType}</td>
                <td className="px-2 py-2.5 tabular-nums text-[color:var(--color-ink-strong)]">
                  {formatArea(s.areaSqm)}
                </td>
                <td className="px-2 py-2.5 tabular-nums text-[color:var(--color-ink-strong)]">
                  {formatGbpFull(s.forecastCostGbp)}
                </td>
                <td className="px-2 py-2.5">
                  <RagBadge rag={s.rag} size="sm" />
                </td>
                <td className="px-2 py-2.5 tabular-nums text-[color:var(--color-ink-soft)]">
                  {s.lifeRemainingYears} yrs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <th
      onClick={onClick}
      className={`text-left font-semibold px-5 py-2.5 cursor-pointer select-none ${
        active ? "text-[color:var(--color-sycamore)]" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-2.5 w-2.5 opacity-60" />
      </span>
    </th>
  );
}
