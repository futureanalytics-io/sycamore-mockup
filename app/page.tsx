"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar, type AppView } from "@/components/sidebar";
import { HomePage } from "@/components/home-page";
import { SycKPI } from "@/components/syckpi";
import { SycFlow } from "@/components/sycflow";
import { SycAI } from "@/components/sycai";
import { PortalView } from "@/components/portal-view";
import { Menu, ShieldHalf, LayoutDashboard } from "lucide-react";

const VIEWS: AppView[] = ["home", "syckpi", "sycflow", "sycai"];
const TITLES: Record<AppView, string> = { home: "Home", syckpi: "SycKPI", sycflow: "SycFlow", sycai: "SycAI" };

type AppEnv = "internal" | "portal";

/* Header toggle: Sycamore (internal) vs the client portal (external). */
function EnvToggle({ env, onChange }: { env: AppEnv; onChange: (e: AppEnv) => void }) {
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
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.12em] opacity-60">{o.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function PageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialView = (searchParams.get("view") as AppView) || "home";
  const [view, setView] = useState<AppView>(VIEWS.includes(initialView) ? initialView : "home");

  const initialEnv = (searchParams.get("env") as AppEnv) || "internal";
  const [env, setEnv] = useState<AppEnv>(initialEnv === "portal" ? "portal" : "internal");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // keep ?view= and ?env= in the URL so deep-links work
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let changed = false;
    if (params.get("view") !== view) { params.set("view", view); changed = true; }
    if (params.get("env") !== env) { params.set("env", env); changed = true; }
    if (changed) router.replace(`/?${params.toString()}`, { scroll: false });
  }, [view, env, router]);

  const isPortal = env === "portal";

  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] flex">
      {/* sidebar only in the internal environment */}
      {!isPortal && (
        <Sidebar
          view={view}
          onView={setView}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* top bar: hamburger (internal) + page title + env toggle */}
        <div className="h-[60px] sm:h-[68px] sticky top-0 z-[400] flex items-center gap-3 px-4 sm:px-6 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]/85 backdrop-blur-md">
          <div className="h-[3px] w-full absolute top-0 left-0" style={{ background: "var(--gradient-brand)" }} />
          {!isPortal && (
            <button onClick={() => setMobileOpen(true)} className="lg:hidden h-9 w-9 rounded-lg hover:bg-[color:var(--color-cream)] flex items-center justify-center text-[color:var(--color-ink-soft)]" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Logo in the header only for the client portal (no sidebar there);
              the internal view carries the logo in the sidebar instead. */}
          {isPortal && (
            <>
              <Image
                src="/sycamore-logo.svg"
                alt="Sycamore Square Group"
                width={172}
                height={48}
                priority
                className="h-7 sm:h-8 w-auto"
              />
              <div className="h-6 w-px bg-[color:var(--color-line-strong)] hidden sm:block" />
            </>
          )}
          <h1 className="font-display font-bold text-[15px] sm:text-[16px] text-[color:var(--color-ink-strong)] truncate">
            {isPortal ? "Roof asset portal" : TITLES[view]}
          </h1>

          {/* In the client portal there's no sidebar, so show the client badge here */}
          {isPortal && (
            <div className="hidden lg:flex items-center gap-2.5 ml-3 bg-[color:var(--color-cream)] border border-[color:var(--color-line)] rounded-full pl-2 pr-3 py-1">
              <div className="relative h-6 w-[72px]">
                <Image src="/uob-logo.jpg" alt="University of Bradford" fill sizes="72px" className="object-contain object-left" />
              </div>
              <div className="h-4 w-px bg-[color:var(--color-line-strong)]" />
              <span className="text-[11.5px] font-medium text-[color:var(--color-ink-soft)]">Estates &amp; Facilities</span>
            </div>
          )}

          <div className="ml-auto">
            <EnvToggle env={env} onChange={setEnv} />
          </div>
        </div>

        <main className={`flex-1 ${isPortal ? "px-3 sm:px-5 lg:px-7" : "px-4 sm:px-6 lg:px-8"} py-5 sm:py-6 w-full max-w-[1500px] mx-auto`}>
          {isPortal ? (
            <PortalView />
          ) : (
            <>
              {view === "home" && <HomePage onView={setView} />}
              {view === "syckpi" && <SycKPI />}
              {view === "sycflow" && <SycFlow />}
              {view === "sycai" && <SycAI />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
