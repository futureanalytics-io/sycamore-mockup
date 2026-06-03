"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-[500] border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[color:var(--color-paper)]/75 shadow-[0_4px_18px_-12px_rgba(20,36,43,0.30)]">
      {/* thin brand gradient hairline */}
      <div className="h-[3px] w-full" style={{ background: "var(--gradient-brand)" }} />
      <div className="h-[68px] flex items-center px-7 gap-7">
        {/* Sycamore Square real logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/sycamore-logo.svg"
            alt="Sycamore Square Group"
            width={172}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Subtle product label */}
        <div className="hidden md:flex items-center gap-3">
          <div className="h-7 w-px bg-[color:var(--color-line-strong)]" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[14.5px] font-bold text-[color:var(--color-ink-strong)] tracking-tight">
              Roof asset portal
            </span>
            <span className="text-[11.5px] text-[color:var(--color-ink-muted)] font-body">
              Capital condition platform
            </span>
          </div>
        </div>

        {/* Client badge */}
        <div className="hidden lg:flex items-center gap-2.5 ml-auto bg-[color:var(--color-cream)] border border-[color:var(--color-line)] rounded-full pl-2 pr-3 py-1">
          <div className="relative h-7 w-[80px]">
            <Image
              src="/uob-logo.jpg"
              alt="University of Bradford"
              fill
              sizes="80px"
              className="object-contain object-left"
            />
          </div>
          <div className="h-4 w-px bg-[color:var(--color-line-strong)]" />
          <span className="text-[11.5px] font-medium text-[color:var(--color-ink-soft)]">
            Estates &amp; Facilities
          </span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:ml-3">
          <button className="h-9 w-9 rounded-full hover:bg-[color:var(--color-cream)] text-[color:var(--color-ink-muted)] flex items-center justify-center transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="h-9 w-9 rounded-full hover:bg-[color:var(--color-cream)] text-[color:var(--color-ink-muted)] flex items-center justify-center transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-red)]" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-[color:var(--color-cream)] cursor-pointer transition-colors">
            <div className="leading-tight text-right hidden md:block">
              <div className="text-[12.5px] font-medium text-[color:var(--color-ink-strong)]">
                Alex Bradford
              </div>
              <div className="text-[11px] text-[color:var(--color-ink-muted)]">Senior surveyor</div>
            </div>
            <div
              className="h-8 w-8 rounded-full text-white flex items-center justify-center text-[11px] font-bold font-display shadow-[0_2px_8px_-2px_rgba(47,125,146,0.6)]"
              style={{ background: "var(--gradient-brand)" }}
            >
              AB
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[color:var(--color-ink-muted)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
