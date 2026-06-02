"use client";

import dynamic from "next/dynamic";

export const CampusMapClient = dynamic(
  () => import("./campus-map").then((m) => m.CampusMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] h-[560px] flex items-center justify-center text-[12.5px] text-[color:var(--color-ink-muted)] font-display">
        Loading campus map…
      </div>
    ),
  }
);
