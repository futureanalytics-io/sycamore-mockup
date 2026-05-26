"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-[color:var(--color-border)] bg-white flex items-center px-6 gap-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <span
              className="absolute inset-0 rotate-45 border-[1.5px]"
              style={{ borderColor: "var(--color-sycamore)" }}
            />
            <span
              className="absolute inset-[5px] rotate-45"
              style={{ background: "var(--color-sycamore)" }}
            />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-medium tracking-[0.18em] text-[color:var(--color-sycamore)]">
              SYCAMORE SQUARE
            </div>
            <div className="text-[10.5px] text-[color:var(--color-muted)] -mt-0.5">
              Roof asset portal
            </div>
          </div>
        </div>
      </div>

      <div className="h-8 w-px bg-[color:var(--color-border)]" />

      <div className="flex items-center gap-3">
        <div className="relative h-9 w-[110px]">
          <Image
            src="/uob-logo.jpg"
            alt="University of Bradford"
            fill
            sizes="110px"
            priority
            className="object-contain object-left"
          />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] text-[color:var(--color-muted)]">
            Estates & Facilities
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2.5 rounded-full border border-[color:var(--color-border)] bg-white pl-1 pr-2 py-1 hover:bg-[color:var(--color-background)] transition-colors cursor-pointer">
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
          style={{ background: "var(--color-sycamore)" }}
        >
          AB
        </div>
        <span className="text-[12px] text-[color:var(--color-foreground)]">Alex Bradford</span>
        <ChevronDown className="h-3 w-3 text-[color:var(--color-muted)]" />
      </div>
    </header>
  );
}
