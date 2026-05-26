"use client";

import dynamic from "next/dynamic";

export const CampusMapClient = dynamic(
  () => import("./campus-map").then((m) => m.CampusMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white h-[560px] flex items-center justify-center text-[12px] text-[color:var(--color-muted)]">
        Loading campus map…
      </div>
    ),
  }
);
