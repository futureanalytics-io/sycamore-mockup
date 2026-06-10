"use client";

/*
 * Sidebar — Sycamore Square OS app navigation. Light, minimalist and on-brand
 * to match sycamoresquaregroup.co.uk: white surface, charcoal text, the real
 * brand teal (#377587) on the active item. Collapsible via an edge handle;
 * slide-in drawer on mobile.
 *
 * Because the surface is light, text uses the normal ink tokens and works WITH
 * the global `.font-display` colour rule (no inline-colour hacks needed).
 *
 * Nav: Home · SycFlow · SycAI.
 */
import Image from "next/image";
import { Home, Gauge, Workflow, Sparkles, ChevronLeft, ChevronDown, X } from "lucide-react";

export type AppView = "home" | "syckpi" | "sycflow" | "sycai";

const NAV: { key: AppView; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "home", label: "Home", sub: "Command centre", icon: Home },
  { key: "syckpi", label: "SycKPI", sub: "Metrics catalogue", icon: Gauge },
  { key: "sycflow", label: "SycFlow", sub: "Agents & workflow", icon: Workflow },
  { key: "sycai", label: "SycAI", sub: "Ask your data", icon: Sparkles },
];

export function Sidebar({
  view,
  onView,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: {
  view: AppView;
  onView: (v: AppView) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const go = (v: AppView) => {
    onView(v);
    onCloseMobile();
  };

  return (
    <>
      {/* mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[600] bg-[color:var(--color-navy)]/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={[
          "z-[700] shrink-0 flex flex-col relative",
          "bg-[color:var(--color-paper)] border-r border-[color:var(--color-line)]",
          "transition-[width,transform] duration-200 ease-out",
          collapsed ? "lg:w-[78px]" : "lg:w-[252px]",
          "lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0",
          "fixed top-0 left-0 h-screen w-[252px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        style={{
          // very soft teal wash so the white panel has a hint of brand + depth
          background:
            "radial-gradient(120% 60% at 0% 0%, rgba(55,117,135,0.05) 0%, rgba(55,117,135,0) 45%), var(--color-paper)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* brand gradient hairline along the top */}
        <div className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "var(--gradient-brand)" }} />

        {/* brand — the real Sycamore Square logo, centered (icon-only when collapsed) */}
        <div className="relative h-[60px] sm:h-[68px] flex items-center justify-center px-4 shrink-0 border-b border-[color:var(--color-line)] mt-[3px]">
          {collapsed ? (
            <Image src="/sycamore-mark.svg" alt="Sycamore Square Group" width={48} height={50} className="h-8 w-auto" priority />
          ) : (
            <Image src="/sycamore-logo.svg" alt="Sycamore Square Group" width={172} height={48} className="h-8 w-auto" priority />
          )}
          <button
            onClick={onCloseMobile}
            className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden h-8 w-8 rounded-lg hover:bg-[color:var(--color-cream)] flex items-center justify-center text-[color:var(--color-ink-muted)]"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* section label */}
        {!collapsed && (
          <div className="px-5 pt-4 pb-1 text-[10px] uppercase tracking-[0.18em] font-display font-bold text-[color:var(--color-ink-faint)]">
            Workspace
          </div>
        )}

        {/* nav */}
        <nav className="flex-1 overflow-y-auto py-1 px-3 flex flex-col gap-1.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                aria-current={on ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={[
                  "group relative flex items-center gap-3 rounded-xl px-3 h-[46px] transition-all duration-150",
                  collapsed ? "justify-center" : "",
                  on
                    ? "bg-[color:var(--color-sycamore-soft)] shadow-[inset_0_0_0_1px_rgba(55,117,135,0.2)]"
                    : "hover:bg-[color:var(--color-cream)]",
                ].join(" ")}
              >
                {/* active accent bar */}
                {on && (
                  <span
                    className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full"
                    style={{ background: "var(--gradient-brand)" }}
                  />
                )}
                <Icon className={`h-[19px] w-[19px] shrink-0 ${on ? "text-[color:var(--color-sycamore)]" : "text-[color:var(--color-ink-muted)]"}`} />
                {!collapsed && (
                  <span className="leading-tight text-left min-w-0">
                    <span className={`block font-display font-semibold text-[13.5px] ${on ? "text-[color:var(--color-sycamore-strong)]" : "text-[color:var(--color-ink-strong)]"}`}>
                      {item.label}
                    </span>
                    <span className={`block text-[10.5px] ${on ? "text-[color:var(--color-sycamore)]" : "text-[color:var(--color-ink-muted)]"}`}>
                      {item.sub}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* user chip */}
        <div className="p-3 shrink-0 border-t border-[color:var(--color-line)]">
          <div className={`flex items-center gap-2.5 rounded-xl px-2 py-2 cursor-pointer transition-colors hover:bg-[color:var(--color-cream)] ${collapsed ? "justify-center" : ""}`}>
            <div
              className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold font-display"
              style={{ background: "var(--gradient-brand)", color: "#fff", boxShadow: "0 3px 12px -3px rgba(55,117,135,0.6)" }}
            >
              DL
            </div>
            {!collapsed && (
              <>
                <div className="leading-tight min-w-0">
                  <div className="text-[12.5px] font-medium truncate text-[color:var(--color-ink-strong)]">Debbie Lewis</div>
                  <div className="text-[10.5px] text-[color:var(--color-ink-muted)]">Group Director</div>
                </div>
                <ChevronDown className="ml-auto h-3.5 w-3.5 text-[color:var(--color-ink-faint)]" />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Collapse handle — floats on the sidebar's right edge (desktop only). */}
      <div className="hidden lg:block sticky top-0 h-screen w-0 z-[750] pointer-events-none">
        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
          style={{
            background: "var(--gradient-brand)",
            color: "#fff",
            boxShadow: "0 2px 10px -2px rgba(55,117,135,0.7), 0 0 0 3px var(--color-cream)",
          }}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </>
  );
}
