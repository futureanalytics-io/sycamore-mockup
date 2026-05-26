"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RAG_COLORS } from "@/lib/rag";
import type { RagStatus } from "@/lib/types";

interface RagBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  rag: RagStatus;
  size?: "sm" | "md";
}

export function RagBadge({ rag, size = "md", className, ...props }: RagBadgeProps) {
  const c = RAG_COLORS[rag];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "text-[10.5px] px-1.5 py-0.5" : "text-[11.5px] px-2 py-0.5",
        className
      )}
      style={{ background: c.bg, color: c.text }}
      {...props}
    >
      <span
        className="rounded-full"
        style={{
          backgroundColor: c.fill,
          width: size === "sm" ? 6 : 7,
          height: size === "sm" ? 6 : 7,
        }}
      />
      {c.label}
    </span>
  );
}

export function PlainBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[color:var(--color-background)] px-2 py-0.5 text-[11px] text-[color:var(--color-muted)] border border-[color:var(--color-border)]",
        className
      )}
      {...props}
    />
  );
}
