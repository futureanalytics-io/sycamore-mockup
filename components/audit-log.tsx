"use client";

import { useMemo, useState } from "react";
import { usePortalStore } from "@/lib/store";
import { RagBadge } from "@/components/ui/badge";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RagStatus } from "@/lib/types";

interface AuditLogProps {
  compact?: boolean;
  limit?: number;
}

export function AuditLog({ compact = false, limit }: AuditLogProps) {
  const { auditLog, buildings, selectSection } = usePortalStore();
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [filterRag, setFilterRag] = useState<string>("all");

  const buildingOptions = useMemo(
    () => [...buildings].sort((a, b) => a.code.localeCompare(b.code)),
    [buildings]
  );

  const filtered = useMemo(() => {
    let list = auditLog;
    if (filterBuilding !== "all") list = list.filter((a) => a.buildingCode === filterBuilding);
    if (filterRag !== "all") list = list.filter((a) => a.ragAfter === (filterRag as RagStatus));
    if (limit) list = list.slice(0, limit);
    return list;
  }, [auditLog, filterBuilding, filterRag, limit]);

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-[color:var(--color-line)] bg-[color:var(--color-cream-soft)]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[color:var(--color-sycamore-soft)] flex items-center justify-center">
            <ClipboardCheck className="h-3.5 w-3.5 text-[color:var(--color-sycamore)]" />
          </div>
          <div>
            <div className="font-display font-semibold text-[13.5px] text-[color:var(--color-ink-strong)]">
              {compact ? "Recent audits" : "Audit log"}
            </div>
            <div className="text-[11px] text-[color:var(--color-ink-muted)]">
              {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            </div>
          </div>
        </div>
        {!compact && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none sm:w-[200px]">
              <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All buildings</SelectItem>
                  {buildingOptions.map((b) => (
                    <SelectItem key={b.code} value={b.code}>
                      {b.code} — {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[110px] sm:w-[140px] shrink-0">
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
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-[12.5px]">
          <thead>
            <tr className="text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] bg-[color:var(--color-cream-soft)]/40 font-display font-semibold">
              <th className="text-left font-semibold px-5 py-2.5">Date</th>
              <th className="text-left font-semibold px-2 py-2.5">Section</th>
              <th className="text-left font-semibold px-2 py-2.5">Auditor</th>
              <th className="text-left font-semibold px-2 py-2.5">Transition</th>
              <th className="text-left font-semibold px-2 py-2.5">Life</th>
              <th className="text-left font-semibold px-2 py-2.5">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center px-4 py-10 text-[color:var(--color-ink-faint)] text-[12px]">
                  No audits match the current filter.
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr
                key={a.id}
                className="border-t border-[color:var(--color-line)] hover:bg-[color:var(--color-cream)] cursor-pointer transition-colors"
                onClick={() => selectSection(a.sectionId)}
              >
                <td className="px-5 py-2.5 whitespace-nowrap text-[color:var(--color-ink-soft)]">
                  {new Date(a.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-2 py-2.5 font-display font-semibold text-[color:var(--color-sycamore)]">
                  {a.sectionId}
                </td>
                <td className="px-2 py-2.5 text-[color:var(--color-ink-soft)]">{a.auditor}</td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <RagBadge rag={a.ragBefore} size="sm" />
                    <ArrowRight className="h-3 w-3 text-[color:var(--color-ink-faint)]" />
                    <RagBadge rag={a.ragAfter} size="sm" />
                  </div>
                </td>
                <td className="px-2 py-2.5 tabular-nums text-[color:var(--color-ink-soft)]">
                  {a.lifeRemainingYears} yrs
                </td>
                <td className="px-2 py-2.5 text-[color:var(--color-ink-muted)] max-w-[360px]">
                  <div className="truncate">{a.notes}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
