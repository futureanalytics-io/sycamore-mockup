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
import { ArrowUpDown, Search } from "lucide-react";
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
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[color:var(--color-border)]">
        <span className="text-[13px] font-medium mr-2">All sections</span>
        <span className="text-[11px] text-[color:var(--color-muted)]">{rows.length} of {sections.length}</span>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[color:var(--color-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search section, building, roof type…"
            className="h-8 w-[260px] pl-7 pr-2 rounded-md border border-[color:var(--color-border-strong)] bg-white text-[12px] text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-sycamore)]/40"
          />
        </div>
        <div className="w-[140px]">
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
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10.5px] uppercase tracking-wide text-[color:var(--color-muted)] bg-[color:var(--color-background)]/60">
              <Th onClick={() => toggleSort("id")} active={sortKey === "id"}>
                Section
              </Th>
              <th className="text-left font-medium px-2 py-2">Building</th>
              <th className="text-left font-medium px-2 py-2">Roof type</th>
              <Th onClick={() => toggleSort("areaSqm")} active={sortKey === "areaSqm"}>
                Area
              </Th>
              <Th
                onClick={() => toggleSort("forecastCostGbp")}
                active={sortKey === "forecastCostGbp"}
              >
                Forecast cost
              </Th>
              <th className="text-left font-medium px-2 py-2">RAG</th>
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
                className="border-t border-[color:var(--color-border)] hover:bg-[color:var(--color-background)]/40 cursor-pointer transition-colors"
                onClick={() => selectSection(s.id)}
              >
                <td className="px-4 py-2 font-medium">{s.id}</td>
                <td className="px-2 py-2 text-[color:var(--color-muted)]">
                  {buildingNameByCode[s.buildingCode] || s.buildingCode}
                </td>
                <td className="px-2 py-2 text-[color:var(--color-muted)]">{s.roofType}</td>
                <td className="px-2 py-2 tabular-nums">{formatArea(s.areaSqm)}</td>
                <td className="px-2 py-2 tabular-nums">{formatGbpFull(s.forecastCostGbp)}</td>
                <td className="px-2 py-2">
                  <RagBadge rag={s.rag} size="sm" />
                </td>
                <td className="px-2 py-2 tabular-nums">{s.lifeRemainingYears} yrs</td>
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
      className={`text-left font-medium px-2 py-2 cursor-pointer select-none ${
        active ? "text-[color:var(--color-foreground)]" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-2.5 w-2.5 opacity-60" />
      </span>
    </th>
  );
}
