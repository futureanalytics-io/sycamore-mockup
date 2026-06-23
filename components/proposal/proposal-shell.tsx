"use client";

/*
 * ProposalShell — the outer FutureAnalytics × Sycamore Square proposal app.
 * A left sidebar of proposal sections (the demo is one of them, pushing the
 * live OS mockup), a co-branded header, a reading-progress bar, and a mobile
 * drawer. Section state syncs to ?section= so any section is deep-linkable.
 */
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Target,
  Boxes,
  MonitorPlay,
  Repeat,
  CreditCard,
  CalendarCheck,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const FA_SITE = "https://www.futureanalytics.io";
import { CoBrand } from "@/components/proposal/brand";
import {
  OverviewSection,
  OpportunitySection,
  ProposeSection,
  DemoSection,
  MethodologySection,
  SecuritySection,
  PricingSection,
  NextSection,
  type SectionId,
} from "@/components/proposal/sections";

const NAV: { id: SectionId; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", sub: "The proposal at a glance", icon: FileText },
  { id: "opportunity", label: "The opportunity", sub: "Why now", icon: Target },
  { id: "propose", label: "What we propose", sub: "FutureOS + three pillars", icon: Boxes },
  { id: "demo", label: "Live demo", sub: "Drive the product", icon: MonitorPlay },
  { id: "method", label: "How we work", sub: "Our agile delivery", icon: Repeat },
  { id: "security", label: "Security", sub: "Data protection", icon: ShieldCheck },
  { id: "pricing", label: "Pricing", sub: "Simple & rolling", icon: CreditCard },
  { id: "next", label: "Next step", sub: "Book the walkthrough", icon: CalendarCheck },
];

const IDS = NAV.map((n) => n.id);

function ShellInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = (searchParams.get("section") as SectionId) || "overview";
  const [section, setSection] = useState<SectionId>(IDS.includes(initial) ? initial : "overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("section") !== section) {
      params.set("section", section);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [section, router]);

  const go = (id: SectionId) => {
    setSection(id);
    setMobileOpen(false);
  };

  const idx = IDS.indexOf(section);
  const progress = ((idx + 1) / IDS.length) * 100;

  return (
    <div className="fa-theme min-h-screen bg-[color:var(--color-cream)] flex">
      {/* mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[600] bg-[color:var(--color-navy)]/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      )}

      {/* sidebar */}
      <aside
        className={[
          "z-[700] shrink-0 flex flex-col w-[270px]",
          "bg-[color:var(--color-paper)] border-r border-[color:var(--color-line)]",
          "transition-transform duration-200 ease-out",
          "lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0",
          "fixed top-0 left-0 h-screen",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(120% 60% at 0% 0%, rgba(55,117,135,0.05) 0%, rgba(55,117,135,0) 45%), var(--color-paper)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "var(--gradient-brand)" }} />

        {/* co-brand */}
        <div className="relative px-4 py-4 shrink-0 border-b border-[color:var(--color-line)] mt-[3px] flex items-center">
          <div className="scale-[0.92] origin-left">
            <CoBrand compact />
          </div>
          <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden h-8 w-8 rounded-lg hover:bg-[color:var(--color-cream)] flex items-center justify-center text-[color:var(--color-ink-muted)]" aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-1 text-[10px] uppercase tracking-[0.18em] font-display font-bold text-[color:var(--color-ink-faint)]">
          Proposal
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto py-1 px-3 flex flex-col gap-1">
          {NAV.map((item, i) => {
            const Icon = item.icon;
            const on = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={on ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-3 rounded-xl px-3 h-[50px] transition-all duration-150 text-left",
                  on ? "bg-[color:var(--color-sycamore-soft)] shadow-[inset_0_0_0_1px_rgba(55,117,135,0.2)]" : "hover:bg-[color:var(--color-cream)]",
                ].join(" ")}
              >
                {on && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full" style={{ background: "var(--gradient-brand)" }} />}
                <span className={`text-[10px] font-display font-bold w-4 shrink-0 ${on ? "text-[color:var(--color-sycamore)]" : "text-[color:var(--color-ink-faint)]"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className={`h-[18px] w-[18px] shrink-0 ${on ? "text-[color:var(--color-sycamore)]" : "text-[color:var(--color-ink-muted)]"}`} />
                <span className="leading-tight min-w-0">
                  <span className={`block font-display font-semibold text-[13.5px] ${on ? "text-[color:var(--color-sycamore-strong)]" : "text-[color:var(--color-ink-strong)]"}`}>
                    {item.label}
                  </span>
                  <span className={`block text-[10.5px] ${on ? "text-[color:var(--color-sycamore)]" : "text-[color:var(--color-ink-muted)]"}`}>{item.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="p-3 shrink-0 border-t border-[color:var(--color-line)]">
          <button
            onClick={() => go("next")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full h-10 text-[13px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
          >
            <CalendarCheck className="h-4 w-4" /> Book the walkthrough
          </button>
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* header + progress */}
        <div className="sticky top-0 z-[400] bg-[color:var(--color-paper)]/85 backdrop-blur-md border-b border-[color:var(--color-line)]">
          <div className="h-[60px] sm:h-[64px] flex items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden h-9 w-9 rounded-lg hover:bg-[color:var(--color-cream)] flex items-center justify-center text-[color:var(--color-ink-soft)]" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden scale-90 origin-left">
              <CoBrand compact />
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-ink-muted)]">
              <span className="font-display font-semibold text-[color:var(--color-ink-strong)]">FutureOS proposal</span>
              <ChevronRight className="h-3.5 w-3.5 text-[color:var(--color-ink-faint)]" />
              <span className="font-display font-semibold text-[color:var(--color-sycamore-strong)]">{NAV[idx].label}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <a
                href={FA_SITE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full h-8 px-3.5 text-[12.5px] font-display font-semibold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">futureanalytics.io</span>
                <span className="sm:hidden">Our site</span>
              </a>
              <span className="hidden md:inline text-[11.5px] font-display font-semibold text-[color:var(--color-ink-muted)]">
                {idx + 1} / {IDS.length}
              </span>
            </div>
          </div>
          <div className="h-[3px] w-full bg-[color:var(--color-cream-edge)]">
            <div className="h-full transition-[width] duration-300" style={{ width: `${progress}%`, background: "var(--gradient-brand)" }} />
          </div>
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-9 w-full max-w-[1180px] mx-auto">
          {section === "overview" && <OverviewSection go={go} />}
          {section === "opportunity" && <OpportunitySection go={go} />}
          {section === "propose" && <ProposeSection go={go} />}
          {section === "demo" && <DemoSection />}
          {section === "method" && <MethodologySection />}
          {section === "security" && <SecuritySection />}
          {section === "pricing" && <PricingSection go={go} />}
          {section === "next" && <NextSection />}

          {/* prev / next footer nav */}
          <div className="mt-10 pt-5 border-t border-[color:var(--color-line)] flex items-center justify-between gap-3">
            <button
              onClick={() => idx > 0 && go(IDS[idx - 1])}
              disabled={idx === 0}
              className="inline-flex items-center gap-2 rounded-full px-4 h-10 text-[13px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] hover:border-[color:var(--color-sycamore)]/40 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4 rotate-180" /> {idx > 0 ? NAV[idx - 1].label : "Start"}
            </button>
            <button
              onClick={() => idx < IDS.length - 1 && go(IDS[idx + 1])}
              disabled={idx === IDS.length - 1}
              className="inline-flex items-center gap-2 rounded-full px-4 h-10 text-[13px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform disabled:opacity-40 disabled:pointer-events-none"
            >
              {idx < IDS.length - 1 ? NAV[idx + 1].label : "End"} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export function ProposalShell() {
  return (
    <Suspense fallback={null}>
      <ShellInner />
    </Suspense>
  );
}
