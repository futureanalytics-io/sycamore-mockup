"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Bell, Search, ShieldHalf, LayoutDashboard } from "lucide-react";

export type AppEnv = "internal" | "portal";

function EnvSwitch({ env, onChange }: { env: AppEnv; onChange: (e: AppEnv) => void }) {
  const opts: { key: AppEnv; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "internal", label: "Sycamore", sub: "Internal", icon: ShieldHalf },
    { key: "portal", label: "Client portal", sub: "External", icon: LayoutDashboard },
  ];
  return (
    <div className="flex items-center gap-1 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-cream-edge)]/60 p-1 shadow-[inset_0_1px_2px_rgba(20,36,43,0.05)]">
      {opts.map((o) => {
        const on = env === o.key;
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            aria-pressed={on}
            title={`${o.label} · ${o.sub}`}
            className={`inline-flex items-center gap-2 rounded-full h-8 px-3 text-[12.5px] font-display font-semibold transition-all duration-200 ${
              on
                ? "bg-gradient-to-b from-white to-[color:var(--color-sycamore-tint)] text-[color:var(--color-sycamore-strong)] shadow-[0_1px_3px_rgba(20,36,43,0.12),0_3px_10px_-3px_rgba(47,125,146,0.30)] ring-1 ring-[color:var(--color-sycamore)]/15"
                : "text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink-strong)]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{o.label}</span>
            <span className={`hidden lg:inline text-[10px] uppercase tracking-[0.12em] ${on ? "opacity-70" : "opacity-50"}`}>{o.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Header({ env, onEnvChange }: { env: AppEnv; onEnvChange: (e: AppEnv) => void }) {
  return (
    <header className="sticky top-0 z-[500] border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[color:var(--color-paper)]/75 shadow-[0_4px_18px_-12px_rgba(20,36,43,0.30)]">
      {/* thin brand gradient hairline */}
      <div className="h-[3px] w-full" style={{ background: "var(--gradient-brand)" }} />
      <div className="h-[60px] sm:h-[68px] flex items-center pl-3 pr-2.5 sm:px-7 gap-2 sm:gap-7">
        {/* Sycamore Square real logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/sycamore-logo.svg"
            alt="Sycamore Square Group"
            width={172}
            height={48}
            priority
            className="h-8 sm:h-10 w-auto"
          />
        </Link>

        {/* Subtle product label — reflects the active environment */}
        <div className="hidden md:flex items-center gap-3">
          <div className="h-7 w-px bg-[color:var(--color-line-strong)]" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[14.5px] font-bold text-[color:var(--color-ink-strong)] tracking-tight">
              {env === "internal" ? "Sycamore Square OS" : "Roof asset portal"}
            </span>
            <span className="text-[11.5px] text-[color:var(--color-ink-muted)] font-body">
              {env === "internal" ? "Your team's platform" : "Capital condition platform"}
            </span>
          </div>
        </div>

        {/* Environment switch — internal (Sycamore) vs external (client portal).
            Centered/flexible zone: takes the slack between left brand and the
            pinned right cluster, so it never shoves the user chip around. */}
        <div className="flex-1 flex justify-center min-w-0 px-2">
          <EnvSwitch env={env} onChange={onEnvChange} />
        </div>

        {/* Right cluster — ALWAYS pinned to the far-right edge.
            Client badge + actions live together here; the badge appearing
            (portal only) no longer shifts the user chip. */}
        <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
          {/* Client badge — only in the external portal */}
          <div className={`${env === "portal" ? "hidden lg:flex" : "hidden"} items-center gap-2.5 mr-1 bg-[color:var(--color-cream)] border border-[color:var(--color-line)] rounded-full pl-2 pr-3 py-1`}>
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

          <button className="h-9 w-9 rounded-full hover:bg-[color:var(--color-cream)] text-[color:var(--color-ink-muted)] flex items-center justify-center transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="h-9 w-9 rounded-full hover:bg-[color:var(--color-cream)] text-[color:var(--color-ink-muted)] flex items-center justify-center transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-red)]" />
          </button>

          {/* slim divider before the user chip, from sm up */}
          <div className="hidden sm:block h-6 w-px bg-[color:var(--color-line-strong)] mx-1" />

          <div className="flex items-center gap-2.5 ml-1 sm:ml-0 pl-1 sm:pl-2 pr-1 py-1 rounded-full hover:bg-[color:var(--color-cream)] cursor-pointer transition-colors">
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
            {/* chevron only alongside the name (md+); orphaned on mobile otherwise */}
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-[color:var(--color-ink-muted)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
