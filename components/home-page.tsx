"use client";

/*
 * HomePage — the Sycamore Square OS landing view. Simple, on-theme command
 * centre: a greeting, a few headline figures, and cards that route into
 * SycFlow / SycAI. Illustrative content only — no pricing/ROI, no tooling named.
 */
import type { AppView } from "@/components/sidebar";
import { Workflow, Sparkles, ArrowRight, FileText, ShieldCheck, CheckSquare } from "lucide-react";

export function HomePage({ onView }: { onView: (v: AppView) => void }) {
  return (
    <div className="space-y-6">
      {/* greeting hero */}
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_1px_3px_rgba(20,36,43,0.05),0_10px_30px_-16px_rgba(20,36,43,0.18)]">
        <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-2.5 rounded-full bg-[color:var(--color-paper)]/70 border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-sycamore-bright)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--color-sycamore-bright)]" />
          </span>
          Your platform · Live
        </div>
        <h1 className="brand-title text-[30px] sm:text-[34px] leading-[1.05]">Good morning, Debbie</h1>
        <p className="text-[14px] text-[color:var(--color-ink-soft)] mt-3 max-w-[680px]">
          Welcome to <b className="font-display text-[color:var(--color-ink-strong)]">Sycamore Square OS</b> — your
          team&apos;s command centre. The platform takes the drudgery out of report production, bids and
          compliance, so your qualified people spend their time on judgement. You own it outright.
        </p>
      </div>

      {/* headline figures (illustrative) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { v: "12", l: "Reports in progress", s: "across 5 live commissions" },
          { v: "3", l: "Bids open", s: "framework deadlines this month" },
          { v: "7", l: "Compliance checks", s: "2 gaps awaiting a decision" },
          { v: "1 hr", l: "Avg. response time", s: "your service promise, held" },
        ].map((k, i) => (
          <div key={i} className="surface-raised rounded-xl p-4">
            <div className="font-display font-bold text-[26px] text-[color:var(--color-sycamore-strong)] leading-none">{k.v}</div>
            <div className="text-[12.5px] font-display font-semibold text-[color:var(--color-ink-strong)] mt-1.5">{k.l}</div>
            <div className="text-[11px] text-[color:var(--color-ink-muted)] mt-0.5">{k.s}</div>
          </div>
        ))}
      </div>

      {/* module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onView("sycflow")}
          className="group text-left surface-raised rounded-2xl p-5 sm:p-6 hover:border-[color:var(--color-sycamore)]/40 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-11 w-11 rounded-xl bg-[color:var(--color-sycamore-soft)] flex items-center justify-center text-[color:var(--color-sycamore)]">
              <Workflow className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[18px] font-bold text-[color:var(--color-ink-strong)] leading-tight">SycFlow</h2>
              <p className="text-[12px] text-[color:var(--color-ink-muted)]">Agents, business flow &amp; the client portal</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-[color:var(--color-ink-faint)] group-hover:text-[color:var(--color-sycamore)] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[13px] text-[color:var(--color-ink-soft)]">
            See each agent turn your team&apos;s real inputs into sign-off-ready work, map where every agent
            sits across your business, and open the live client portal.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {[
              { i: FileText, t: "Survey-to-Report" },
              { i: CheckSquare, t: "Tender / Bid" },
              { i: ShieldCheck, t: "Compliance" },
            ].map((c, i) => {
              const Icon = c.i;
              return (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11.5px] font-display font-semibold px-2.5 py-1 rounded-full bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]">
                  <Icon className="h-3 w-3" />{c.t}
                </span>
              );
            })}
            <span className="inline-flex items-center text-[11.5px] font-display font-semibold px-2.5 py-1 rounded-full bg-[color:var(--color-cream-edge)] text-[color:var(--color-ink-muted)]">+3 more</span>
          </div>
        </button>

        <button
          onClick={() => onView("sycai")}
          className="group text-left surface-raised rounded-2xl p-5 sm:p-6 hover:border-[color:var(--color-sycamore)]/40 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-11 w-11 rounded-xl bg-[color:var(--color-eggplant-soft)] flex items-center justify-center text-[color:var(--color-eggplant)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[18px] font-bold text-[color:var(--color-ink-strong)] leading-tight">SycAI</h2>
              <p className="text-[12px] text-[color:var(--color-ink-muted)]">Ask plain-language questions across your work</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-[color:var(--color-ink-faint)] group-hover:text-[color:var(--color-eggplant)] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[13px] text-[color:var(--color-ink-soft)]">
            Your assistant across every project, report and survey. Ask things like
            <i> &ldquo;which sites have open category-1 defects?&rdquo;</i> and get a sourced answer in seconds.
          </p>
          <div className="mt-3.5 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-cream-soft)] px-3 py-2 text-[12px] text-[color:var(--color-ink-muted)]">
            &ldquo;Draft a board update for the Bradford roofing project.&rdquo;
          </div>
        </button>
      </div>

      {/* suggested priorities */}
      <div className="surface-raised rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)] mb-3">Today&apos;s suggested priorities</h3>
        <ul className="flex flex-col gap-2.5">
          {[
            { t: "Review 2 compliance gaps on the education block PCI pack", v: "sycflow" as AppView, tag: "Compliance" },
            { t: "Finalise Q5.1 (social value) on the Lot 2 framework bid", v: "sycflow" as AppView, tag: "Tender / Bid" },
            { t: "Send the trust-board progress update for the health refurb", v: "sycflow" as AppView, tag: "Project Comms" },
            { t: "Ask SycAI for this week's open category-1 defects across the estate", v: "sycai" as AppView, tag: "SycAI" },
          ].map((p, i) => (
            <li key={i}>
              <button
                onClick={() => onView(p.v)}
                className="group w-full text-left flex items-center gap-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-3.5 py-3 hover:border-[color:var(--color-sycamore)]/40 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-sycamore-bright)] shrink-0" />
                <span className="text-[13px] text-[color:var(--color-ink)]">{p.t}</span>
                <span className="ml-auto text-[10.5px] font-display font-semibold uppercase tracking-[0.1em] text-[color:var(--color-ink-muted)] bg-[color:var(--color-cream-edge)] rounded-full px-2 py-0.5 shrink-0">{p.tag}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[color:var(--color-ink-faint)] group-hover:text-[color:var(--color-sycamore)] shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
