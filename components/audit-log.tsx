"use client";

import { useMemo, useState } from "react";
import { usePortalStore } from "@/lib/store";
import { RagBadge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
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
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium">
            {compact ? "Recent audits" : "Audit log"}
          </span>
          <span className="text-[11px] text-[color:var(--color-muted)]">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        {!compact && (
          <div className="flex items-center gap-2">
            <div className="w-[180px]">
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
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10.5px] uppercase tracking-wide text-[color:var(--color-muted)] bg-[color:var(--color-background)]/60">
              <th className="text-left font-medium px-4 py-2">Timestamp</th>
              <th className="text-left font-medium px-2 py-2">Section</th>
              <th className="text-left font-medium px-2 py-2">Auditor</th>
              <th className="text-left font-medium px-2 py-2">Status</th>
              <th className="text-left font-medium px-2 py-2">Life</th>
              <th className="text-left font-medium px-2 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center px-4 py-8 text-[color:var(--color-faint)]">
                  No audits match the current filter.
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr
                key={a.id}
                className="border-t border-[color:var(--color-border)] hover:bg-[color:var(--color-background)]/40 cursor-pointer transition-colors"
                onClick={() => selectSection(a.sectionId)}
              >
                <td className="px-4 py-2.5 whitespace-nowrap text-[color:var(--color-muted)]">
                  {new Date(a.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-2 py-2.5 font-medium">{a.sectionId}</td>
                <td className="px-2 py-2.5 text-[color:var(--color-muted)]">{a.auditor}</td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <RagBadge rag={a.ragBefore} size="sm" />
                    <ArrowRight className="h-3 w-3 text-[color:var(--color-faint)]" />
                    <RagBadge rag={a.ragAfter} size="sm" />
                  </div>
                </td>
                <td className="px-2 py-2.5 tabular-nums">{a.lifeRemainingYears} yrs</td>
                <td className="px-2 py-2.5 text-[color:var(--color-muted)] max-w-[300px]">
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
