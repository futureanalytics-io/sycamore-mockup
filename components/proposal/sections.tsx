"use client";

/*
 * Proposal sections — the content that wraps the live OS demo. Co-branded
 * FutureAnalytics × Sycamore Square Group, written for the two founder-
 * directors (non-technical, construction/estates). The methodology section is
 * rewritten from our agile primer with all references to the prior external
 * client removed and reframed as an embedded internal-delivery team.
 */
import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Cloud,
  Database,
  BarChart3,
  Workflow,
  Sparkles,
  Gavel,
  LayoutDashboard,
  ShieldCheck,
  Maximize2,
  Layers,
  Clock,
  Repeat,
  GitBranch,
  HardHat,
  Boxes,
  Eye,
  Users,
  AlertTriangle,
  ListChecks,
  TriangleAlert,
  ExternalLink,
} from "lucide-react";
import { CoBrand } from "@/components/proposal/brand";

export type SectionId = "overview" | "opportunity" | "propose" | "demo" | "method" | "pricing" | "next";

type Go = (id: SectionId) => void;

/* shared section heading */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-3 rounded-full bg-[color:var(--color-paper)] border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
      {children}
    </div>
  );
}

/* ============================== OVERVIEW ============================== */
export function OverviewSection({ go }: { go: Go }) {
  return (
    <div className="space-y-6">
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-6 py-8 sm:px-10 sm:py-12 shadow-[var(--shadow-md)]">
        <SectionEyebrow>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-sycamore-bright)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--color-sycamore-bright)]" />
          </span>
          Proposal · Private &amp; confidential
        </SectionEyebrow>
        <h1 className="font-display font-extrabold text-[34px] sm:text-[46px] leading-[1.04] text-[color:var(--color-ink-strong)] max-w-[18ch]">
          A FutureOS proposal for <span className="text-gradient-brand">Sycamore Square Group</span>.
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[color:var(--color-ink-soft)] mt-5 max-w-[62ch] leading-relaxed">
          A dedicated, AI-augmented data, apps and automation team — building the internal products
          Sycamore actually runs on. Deployed in <b className="text-[color:var(--color-ink-strong)] font-display">your own cloud</b>,
          yours to own from <b className="text-[color:var(--color-ink-strong)] font-display">day one</b>. Everyone&apos;s doing AI;
          we ground yours in your data.
        </p>

        <div className="flex flex-wrap gap-3 mt-7">
          <button
            onClick={() => go("opportunity")}
            className="inline-flex items-center gap-2 rounded-full px-6 h-12 text-[15px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
          >
            Explore the proposal <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => go("next")}
            className="inline-flex items-center gap-2 rounded-full px-6 h-12 text-[15px] font-display font-bold text-[color:var(--color-ink-strong)] bg-[color:var(--color-paper)] border border-[color:var(--color-line-strong)] hover:border-[color:var(--color-sycamore)]/50 transition-colors"
          >
            <CalendarCheck className="h-4 w-4" /> Book the walkthrough
          </button>
        </div>
      </div>

      {/* promise chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Cloud, t: "Deployed in your cloud", s: "Not ours. Your tenancy, your control." },
          { icon: ShieldCheck, t: "You own the code", s: "From day one. No lock-in, ever." },
          { icon: Check, t: "No setup fee", s: "We start building, not invoicing." },
          { icon: Repeat, t: "Rolling 3-month", s: "Secures capacity; you can stop." },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.t} className="surface-raised rounded-xl p-4">
              <Icon className="h-5 w-5 text-[color:var(--color-sycamore)] mb-2" />
              <div className="font-display font-bold text-[13.5px] text-[color:var(--color-ink-strong)]">{c.t}</div>
              <div className="text-[11.5px] text-[color:var(--color-ink-muted)] mt-0.5">{c.s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== OPPORTUNITY ============================== */
export function OpportunitySection({ go }: { go: Go }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionEyebrow>The opportunity</SectionEyebrow>
        <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight text-[color:var(--color-ink-strong)] max-w-[20ch]">
          You don&apos;t have a data problem. You have a <span className="text-gradient-brand">data system</span> problem.
        </h2>
        <p className="text-[15px] text-[color:var(--color-ink-soft)] mt-4 max-w-[68ch] leading-relaxed">
          Sycamore already holds everything it needs to win more work and run more projects — it&apos;s just
          scattered. Surveys in one place, drawings in another, project records in inboxes, bid answers
          buried in old submissions, the numbers spread across spreadsheets. Nothing is connected, so your
          chartered people spend their time assembling instead of judging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="surface-raised rounded-2xl p-5 border-l-4 border-l-[color:var(--color-rag-red)]">
          <h3 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)] mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[color:var(--color-rag-red)]" /> Today
          </h3>
          <ul className="space-y-2.5 text-[13px] text-[color:var(--color-ink-soft)]">
            {[
              "Every framework bid rebuilds the same answers from scratch, under deadline.",
              "Survey findings re-keyed by hand into reports — hours per report.",
              "Drawings and approvals chased over email; no single client view.",
              "Portfolio and condition data live in PDFs and spreadsheets, never current.",
              "Growth means more hours from the same chartered people — the bottleneck is time.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-[color:var(--color-rag-red)] mt-px">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-raised rounded-2xl p-5 border-l-4 border-l-[color:var(--color-sycamore)]">
          <h3 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)] mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--color-sycamore)]" /> With FutureOS
          </h3>
          <ul className="space-y-2.5 text-[13px] text-[color:var(--color-ink-soft)]">
            {[
              "Opportunities found and scored against your sectors; bids drafted from your own wins.",
              "Survey-to-report drafting in minutes — your surveyor confirms, not retypes.",
              "One branded portal where clients see drawings, comment and approve.",
              "Estate and project numbers in one near-real-time command centre.",
              "Capacity without headcount — your experts take on more, judgement intact.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="h-4 w-4 shrink-0 mt-px text-[color:var(--color-sycamore)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="surface-raised rounded-2xl p-5 flex items-center gap-4 flex-wrap">
        <p className="text-[14px] text-[color:var(--color-ink-soft)] flex-1 min-w-[280px]">
          Your service promise — <b className="text-[color:var(--color-ink-strong)] font-display">90% of correspondence answered within the hour</b> —
          gets harder to hold as you grow. FutureOS protects it by taking the drudgery off your people.
        </p>
        <button
          onClick={() => go("propose")}
          className="inline-flex items-center gap-2 rounded-full px-5 h-11 text-[14px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
        >
          What we propose <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================== WHAT WE PROPOSE ============================== */
const STACK = [
  { icon: Database, t: "Data platform", s: "Every source connected — surveys, drawings, projects, bids, the numbers. The foundation." },
  { icon: BarChart3, t: "Custom reporting & analytics", s: "One set of numbers, near real-time. Portfolio, project health, bid win-rates." },
  { icon: Workflow, t: "Application workflows", s: "The apps the business runs on — survey-to-report, the bid engine, the client portal." },
  { icon: Sparkles, t: "AI — agents & company brain", s: "Acts on the business, grounded on the layers below. Always ends at human sign-off." },
];

const MODULES = [
  {
    icon: Gavel,
    t: "SycBid — Bidding & Opportunity Engine",
    s: "Scrape and qualify public-sector tenders against your sectors and frameworks, then AI-draft the response from your own winning answers. Directors sharpen and approve.",
    cta: "See SycBid in the demo",
  },
  {
    icon: LayoutDashboard,
    t: "Client / Project Portal",
    s: "Your branded space where clients see drawings and documents, comment and mark up, and track approvals — turning delivery into a connected, visible experience.",
    cta: "Open the live portal in the demo",
  },
  {
    icon: BarChart3,
    t: "Analytics & Reporting",
    s: "Portfolio and estate KPIs, project health, bid win-rates and asset/condition data (e.g. the Bradford campus roof work) in one near-real-time command centre.",
    cta: "See the analytics in the demo",
  },
];

export function ProposeSection({ go }: { go: Go }) {
  return (
    <div className="space-y-7">
      <div>
        <SectionEyebrow>What we propose</SectionEyebrow>
        <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight text-[color:var(--color-ink-strong)] max-w-[22ch]">
          FutureOS — Sycamore&apos;s internal operating system, built by us as your embedded team.
        </h2>
        <p className="text-[15px] text-[color:var(--color-ink-soft)] mt-4 max-w-[68ch] leading-relaxed">
          Not a product you rent and not a year-long build behind closed doors. We work as an in-house-style
          agile team, shipping the internal tools Sycamore runs on — deployed in your own cloud, and yours to
          own from day one.
        </p>
      </div>

      {/* four-layer stack */}
      <div>
        <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-sycamore)] mb-3">The four layers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STACK.map((l, i) => {
            const Icon = l.icon;
            return (
              <div key={l.t} className="surface-raised rounded-xl p-4 relative overflow-hidden">
                <span className="absolute top-3 right-3 font-display font-bold text-[26px] text-[color:var(--color-cream-edge)] leading-none">{i + 1}</span>
                <Icon className="h-6 w-6 text-[color:var(--color-sycamore)] mb-2.5" />
                <div className="font-display font-bold text-[13.5px] text-[color:var(--color-ink-strong)]">{l.t}</div>
                <div className="text-[11.5px] text-[color:var(--color-ink-muted)] mt-1 leading-snug">{l.s}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* timeline */}
      <div className="surface-raised rounded-2xl p-5">
        <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-sycamore)] mb-4">How fast</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { d: "Day 1", t: "You own it", s: "Deployed in your cloud." },
            { d: "Day 14", t: "First source live", s: "Real data flowing in." },
            { d: "Day 60", t: "Workflows + first agents", s: "In production, in use." },
            { d: "Ongoing", t: "It evolves", s: "Every fortnight, with you." },
          ].map((m, i) => (
            <div key={m.d} className="relative">
              {i < 3 && <ArrowRight className="hidden lg:block absolute -right-3 top-1.5 h-4 w-4 text-[color:var(--color-ink-faint)]" />}
              <div className="font-display font-bold text-[18px] text-[color:var(--color-sycamore-strong)]">{m.d}</div>
              <div className="font-display font-semibold text-[13px] text-[color:var(--color-ink-strong)] mt-0.5">{m.t}</div>
              <div className="text-[11.5px] text-[color:var(--color-ink-muted)]">{m.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* three modules */}
      <div>
        <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-sycamore)] mb-3">Three pillars for Sycamore</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.t} className="surface-raised rounded-2xl p-5 flex flex-col">
                <span className="h-11 w-11 rounded-xl bg-[color:var(--color-sycamore-soft)] flex items-center justify-center text-[color:var(--color-sycamore)] mb-3">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)] leading-tight">{m.t}</h4>
                <p className="text-[12.5px] text-[color:var(--color-ink-soft)] mt-2 flex-1">{m.s}</p>
                <button
                  onClick={() => go("demo")}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-display font-bold text-[color:var(--color-sycamore)] hover:gap-2.5 transition-all"
                >
                  {m.cta} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================== LIVE DEMO ============================== */
export function DemoSection() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <SectionEyebrow>Live demo</SectionEyebrow>
          <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight text-[color:var(--color-ink-strong)]">
            This isn&apos;t a slide. It&apos;s the product.
          </h2>
          <p className="text-[14px] text-[color:var(--color-ink-soft)] mt-3 max-w-[64ch] leading-relaxed">
            A working mockup of Sycamore Square OS, running right here. Switch between the internal workspace
            and the client portal, open <b className="font-display text-[color:var(--color-ink-strong)]">SycBid</b> and
            run a bid end to end. Click around — it&apos;s yours to drive. <span className="text-[color:var(--color-ink-muted)]">(Illustrative data only.)</span>
          </p>
        </div>
        <a
          href="/app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 h-11 text-[13.5px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform shrink-0"
        >
          <Maximize2 className="h-4 w-4" /> Open full screen
        </a>
      </div>

      {/* browser-chrome framed iframe */}
      <div className="rounded-2xl border border-[color:var(--color-line-strong)] overflow-hidden shadow-[var(--shadow-lg)] bg-[color:var(--color-paper)]">
        <div className="flex items-center gap-2 px-4 h-11 bg-[color:var(--color-cream-edge)] border-b border-[color:var(--color-line)]">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#e06c5e]" />
            <span className="h-3 w-3 rounded-full bg-[#e6b016]" />
            <span className="h-3 w-3 rounded-full bg-[#6fa057]" />
          </span>
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-[color:var(--color-paper)] border border-[color:var(--color-line)] px-3 h-7 text-[11.5px] text-[color:var(--color-ink-muted)] font-medium max-w-[60%] truncate">
            <ShieldCheck className="h-3 w-3 text-[color:var(--color-sycamore)]" />
            app.sycamore-square-os.co.uk
          </span>
        </div>
        <iframe
          src="/app"
          title="Sycamore Square OS — live demo"
          className="w-full h-[600px] sm:h-[680px] bg-[color:var(--color-cream)]"
        />
      </div>
      <p className="text-[11.5px] text-[color:var(--color-ink-faint)] px-1">
        Tip: the demo opens on the internal workspace. Use the toggle top-right inside the window to switch to the client portal.
      </p>
    </div>
  );
}

/* ============================== HOW WE WORK (METHODOLOGY) ============================== */
function MethodCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-raised rounded-2xl p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="h-9 w-9 rounded-xl bg-[color:var(--color-sycamore-soft)] flex items-center justify-center text-[color:var(--color-sycamore)] shrink-0">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <h3 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)] leading-tight">{title}</h3>
      </div>
      <div className="text-[13px] text-[color:var(--color-ink-soft)] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export function MethodologySection() {
  return (
    <div className="space-y-6">
      <div>
        <SectionEyebrow>How we work</SectionEyebrow>
        <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight text-[color:var(--color-ink-strong)] max-w-[22ch]">
          How we build, as your in-house team — in plain English.
        </h2>
        <p className="text-[15px] text-[color:var(--color-ink-soft)] mt-4 max-w-[68ch] leading-relaxed">
          You run construction projects; we run software projects. The two have more in common than people
          think — and a few important differences. Here&apos;s how we&apos;ll work together, and why.
        </p>
      </div>

      {/* waterfall vs agile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MethodCard icon={Clock} title="The old way fails">
          <p>
            &ldquo;Design everything, build for a year, hand over the keys, hope.&rdquo; That&apos;s like specifying
            every detail of a building before speaking to a single tenant, then disappearing for twelve months.
            The plan stays fixed; the world doesn&apos;t. Most projects built that way disappoint.
          </p>
        </MethodCard>
        <MethodCard icon={HardHat} title="The ground is invisible until you dig">
          <p>
            On a building you survey the site, dig trial pits, price a sensible contingency — the unknowns are
            bounded. Software&apos;s ground is hidden: data quirks, third-party systems, how people actually
            work. So honest estimates come as <b className="text-[color:var(--color-ink-strong)]">ranges, not fixed dates</b>.
            Anyone promising a precise multi-month date up front is bluffing or cutting corners.
          </p>
        </MethodCard>
      </div>

      {/* agile in one line */}
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] p-6 text-center">
        <Repeat className="h-6 w-6 text-[color:var(--color-sycamore)] mx-auto mb-2" />
        <p className="font-display font-bold text-[19px] sm:text-[22px] text-[color:var(--color-ink-strong)]">
          Build small. Ship often. Learn from real use. Adapt.
        </p>
        <p className="text-[13px] text-[color:var(--color-ink-muted)] mt-2">
          Not one long build with a delivery at the end — repeated fortnightly loops, each ending with working
          software in front of you. Six of them in the first three months.
        </p>
      </div>

      {/* hierarchy + user story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MethodCard icon={Layers} title="How the work is structured">
          <p>Three sizes of work, with construction analogies that fit:</p>
          <ul className="space-y-1.5">
            <li><b className="text-[color:var(--color-ink-strong)] font-display">Epic</b> — months, like a RIBA stage. <i>e.g. the Bidding &amp; Opportunity Engine.</i></li>
            <li><b className="text-[color:var(--color-ink-strong)] font-display">Feature</b> — weeks, like a trade package. <i>e.g. tender qualification &amp; match scoring.</i></li>
            <li><b className="text-[color:var(--color-ink-strong)] font-display">User story</b> — days, like a line on a bill of quantities. <i>built, demoed and ticked off in one sprint.</i></li>
          </ul>
        </MethodCard>
        <MethodCard icon={ListChecks} title="What a user story looks like">
          <p>Always in the same shape — <i>&ldquo;As a [role], I can [action], so that [benefit].&rdquo;</i></p>
          <ul className="space-y-1.5">
            <li>&ldquo;As a <b className="text-[color:var(--color-ink-strong)]">bid manager</b>, I can see only tenders that match our sectors and frameworks, so I stop wading through irrelevant notices.&rdquo;</li>
            <li>&ldquo;As a <b className="text-[color:var(--color-ink-strong)]">director</b>, I can comment on a draft bid and have it revised, so sign-off is fast.&rdquo;</li>
            <li>&ldquo;As an <b className="text-[color:var(--color-ink-strong)]">estates lead</b>, I can see portfolio condition at a glance, so I plan capital with confidence.&rdquo;</li>
          </ul>
        </MethodCard>
      </div>

      {/* backlog + sprint cycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MethodCard icon={Boxes} title="The product backlog">
          <p>
            The single, prioritised list of what we&apos;re building, in what order, and why — co-scoped with you
            and re-prioritised every fortnight. <b className="text-[color:var(--color-ink-strong)]">You set priority; we advise on cost, complexity and sequencing.</b>
            It&apos;s your variation-orders register, baked in from day one and visible at all times.
          </p>
        </MethodCard>
        <MethodCard icon={Repeat} title="The two-week sprint cycle">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-display font-semibold">
            {["Plan", "Build", "Review", "Refine"].map((s, i) => (
              <span key={s} className="inline-flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]">{s}</span>
                {i < 3 && <ArrowRight className="h-3 w-3 text-[color:var(--color-ink-faint)]" />}
                {i === 3 && <Repeat className="h-3.5 w-3.5 text-[color:var(--color-ink-faint)]" />}
              </span>
            ))}
          </div>
          <p>Plan the next stories together, we build and test, we demo working software, we re-order priorities. Like RIBA stage gates — but every fortnight.</p>
        </MethodCard>
      </div>

      {/* sprint review = site visit */}
      <MethodCard icon={Eye} title="Your fortnightly site visit">
        <p>
          The sprint review is real working software on screen — not a Gantt chart. Every two weeks you click
          around, raise concerns, change priorities and ask for variations; we plan the next sprint with you.
          It happens <b className="text-[color:var(--color-ink-strong)]">six times in three months</b>. You&apos;re never wondering what we&apos;ve been doing.
        </p>
      </MethodCard>

      {/* commit / don't commit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="surface-raised rounded-2xl p-5 border-l-4 border-l-[color:var(--color-accent-amber)]">
          <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] mb-2 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-[color:var(--color-accent-amber)]" /> Why we won&apos;t promise &ldquo;feature X by date Y&rdquo;
          </h3>
          <p className="text-[13px] text-[color:var(--color-ink-soft)] leading-relaxed">
            You wouldn&apos;t quote a fixed price for a refurb without opening up the walls. Software is the same —
            even simple features hit hidden complexity. We flag uncertainty up front rather than promise dates we&apos;ll miss.
          </p>
        </div>
        <div className="surface-raised rounded-2xl p-5 border-l-4 border-l-[color:var(--color-sycamore)]">
          <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] mb-2 flex items-center gap-2">
            <Check className="h-4 w-4 text-[color:var(--color-sycamore)]" /> What we do commit to
          </h3>
          <ul className="text-[13px] text-[color:var(--color-ink-soft)] space-y-1.5">
            <li><b className="text-[color:var(--color-ink-strong)]">Consistent flow</b> — work always moving.</li>
            <li><b className="text-[color:var(--color-ink-strong)]">Cadence</b> — a review every two weeks, no exceptions.</li>
            <li><b className="text-[color:var(--color-ink-strong)]">Working software</b> — demoed every review.</li>
            <li><b className="text-[color:var(--color-ink-strong)]">Visibility</b> — what shipped, what&apos;s next, what changed.</li>
          </ul>
        </div>
      </div>

      {/* roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MethodCard icon={Users} title="Your role — product owners">
          <p>You&apos;re the most important people in the project; we can build the product, we can&apos;t be the product mind.</p>
          <ul className="space-y-1">
            <li>· Prioritise the backlog (we advise, you decide).</li>
            <li>· Join the fortnightly reviews.</li>
            <li>· Give feedback — direct, fast, unvarnished.</li>
            <li>· Make the product calls when trade-offs hit.</li>
          </ul>
        </MethodCard>
        <MethodCard icon={GitBranch} title="Our role — delivery team">
          <ul className="space-y-1">
            <li>· Turn stories into shippable, tested software.</li>
            <li>· Raise risks early.</li>
            <li>· Offer options on trade-offs (faster vs better, narrower vs broader).</li>
            <li>· Keep flow steady — consistency beats heroics.</li>
            <li>· Stay visible — no disappearing for three months.</li>
          </ul>
        </MethodCard>
      </div>

      {/* roadmap */}
      <div className="surface-raised rounded-2xl p-5">
        <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] mb-1">A simple provisional roadmap</h3>
        <p className="text-[12px] text-[color:var(--color-ink-muted)] mb-4">Order is provisional — revisited at the end of each phase.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { p: "Phase 1", t: "Prove the bidding engine", s: "SycBid on real tenders; confirm the data is trusted." },
            { p: "Phase 2", t: "Client / drawing portal", s: "Branded space for clients to view, comment, approve." },
            { p: "Phase 3", t: "Analytics command centre", s: "Portfolio, project health and win-rates in one place." },
            { p: "Phase 4", t: "Broaden & harden", s: "Across more sectors; scale and resilience." },
          ].map((m, i) => (
            <div key={m.p} className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-cream-soft)] p-3.5 relative">
              {i < 3 && <ArrowRight className="hidden lg:block absolute -right-2.5 top-4 h-4 w-4 text-[color:var(--color-ink-faint)] z-10" />}
              <div className="font-display font-bold text-[11px] uppercase tracking-[0.1em] text-[color:var(--color-sycamore)]">{m.p}</div>
              <div className="font-display font-bold text-[13.5px] text-[color:var(--color-ink-strong)] mt-1">{m.t}</div>
              <div className="text-[11.5px] text-[color:var(--color-ink-muted)] mt-1">{m.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== PRICING ============================== */
const TIERS = [
  {
    name: "Foundation",
    price: "£3,500",
    per: "/mo",
    who: "For focused, director-led operations",
    complexity: "Lower operational complexity",
    points: ["5 standard sources", "2 calls a week", "All four core layers"],
    selected: true,
  },
  {
    name: "Scale",
    price: "£7,500",
    per: "/mo",
    who: "For multi-source estates",
    complexity: "Moderate complexity",
    points: ["10 sources incl. complex types", "Daily check-ins + founder calls", "All four core layers"],
    selected: false,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    per: "",
    who: "For complex / national estates",
    complexity: "High complexity",
    points: ["10+ sources, complex needs", "Custom cadence", "All four core layers"],
    selected: false,
  },
];

export function PricingSection({ go }: { go: Go }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionEyebrow>Pricing</SectionEyebrow>
        <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] leading-tight text-[color:var(--color-ink-strong)]">
          Simple, rolling, and yours to own.
        </h2>
        <p className="text-[14px] text-[color:var(--color-ink-soft)] mt-3 max-w-[64ch]">
          Priced by the <b className="text-[color:var(--color-ink-strong)] font-display">data scope and operational complexity</b> of
          your business — never by headcount. One monthly fee for an embedded team and the platform it builds.
          No setup fee, no lock-in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl p-6 flex flex-col relative bg-[color:var(--color-paper)] ${
              t.selected
                ? "border-2 border-[color:var(--color-sycamore)] shadow-[var(--shadow-lg)] md:-translate-y-2 ring-4 ring-[color:var(--color-sycamore)]/10"
                : "border border-[color:var(--color-line)] shadow-[var(--shadow-sm)]"
            }`}
          >
            {t.selected && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] font-display font-bold text-white bg-[image:var(--gradient-brand)] rounded-full px-3 py-1 shadow-[var(--shadow-brand)] whitespace-nowrap">
                <Check className="h-3 w-3" /> Selected for Sycamore
              </span>
            )}
            <div className="font-display font-bold text-[12px] uppercase tracking-[0.12em] text-[color:var(--color-sycamore)]">
              {t.name}
            </div>
            <div className="mt-2 flex items-end gap-1">
              <span className="font-display font-extrabold text-[34px] leading-none text-[color:var(--color-ink-strong)]">{t.price}</span>
              {t.per && <span className="text-[14px] mb-1 text-[color:var(--color-ink-muted)]">{t.per}</span>}
            </div>
            <div className="text-[12.5px] mt-1.5 text-[color:var(--color-ink-muted)]">{t.who}</div>
            <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 text-[10.5px] font-display font-semibold px-2.5 py-1 rounded-full bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]">
              {t.complexity}
            </span>
            <ul className="mt-4 space-y-2 flex-1">
              {t.points.map((p) => (
                <li key={p} className="flex gap-2 text-[13px] text-[color:var(--color-ink-soft)]">
                  <Check className="h-4 w-4 shrink-0 mt-px text-[color:var(--color-sycamore)]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-[12.5px] font-display font-semibold text-[color:var(--color-ink-soft)]">
        No setup fee · Rolling 3-month to secure capacity · You own the code from day one.
      </p>

      {/* steer — complexity-based */}
      <div className="surface-raised rounded-2xl p-5 flex items-start gap-3 border-l-4 border-l-[color:var(--color-sycamore)]">
        <Sparkles className="h-5 w-5 text-[color:var(--color-sycamore)] shrink-0 mt-0.5" />
        <p className="text-[13.5px] text-[color:var(--color-ink-soft)]">
          <b className="text-[color:var(--color-ink-strong)] font-display">Why Foundation fits Sycamore.</b> Tiers track
          operational complexity, not company size. As a director-led professional consultancy, Sycamore&apos;s
          operations are more contained than, say, a manufacturer running live production lines and supply
          chains — so a focused first build (the bidding engine and client portal, on a handful of sources) sits
          squarely in <b className="text-[color:var(--color-ink-strong)]">Foundation</b>. You step up to Scale only as more sources and
          complexity come on. We&apos;ll confirm the scope together on the call.
        </p>
      </div>

      {/* FAQ reassurances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { q: "Who owns the system?", a: "Sycamore — from day one. It's deployed in your cloud and the code is yours. No lock-in." },
          { q: "What happens after the first three months?", a: "It continues month-to-month. The rolling term just secures your team's capacity; you can stop when you choose." },
          { q: "How is this different from an AI agency?", a: "We don't drop a tool and leave. We're an embedded team building products grounded in your own data, with you every fortnight." },
          { q: "Why not just hire in-house?", a: "You get a whole team's range — data, apps, AI — from day one, with no recruitment risk and no fixed overhead." },
        ].map((f) => (
          <div key={f.q} className="surface-raised rounded-xl p-4">
            <div className="font-display font-bold text-[13.5px] text-[color:var(--color-ink-strong)]">{f.q}</div>
            <p className="text-[12.5px] text-[color:var(--color-ink-soft)] mt-1.5">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => go("next")}
          className="inline-flex items-center gap-2 rounded-full px-6 h-12 text-[15px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
        >
          Next step <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================== NEXT STEP ============================== */
export function NextSection() {
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-6">
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-6 py-10 sm:px-12 sm:py-14 text-center shadow-[var(--shadow-md)]">
        <SectionEyebrow>Next step</SectionEyebrow>
        <h2 className="font-display font-extrabold text-[30px] sm:text-[40px] leading-tight text-[color:var(--color-ink-strong)] max-w-[20ch] mx-auto">
          Let&apos;s walk through it together.
        </h2>
        <p className="text-[15px] text-[color:var(--color-ink-soft)] mt-4 max-w-[56ch] mx-auto leading-relaxed">
          A 45-minute walkthrough: we drive the demo on your real context, agree where to start, and scope the
          first sprint. No commitment beyond the conversation.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <a
            href="mailto:alexander@futureanalytics.io?subject=FutureOS%20walkthrough%20%E2%80%94%20Sycamore%20Square%20Group"
            className="inline-flex items-center gap-2 rounded-full px-7 h-12 text-[15px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
          >
            <CalendarCheck className="h-4 w-4" /> Book the walkthrough
          </a>
          <a
            href="/app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 h-12 text-[15px] font-display font-bold text-[color:var(--color-ink-strong)] bg-[color:var(--color-paper)] border border-[color:var(--color-line-strong)] hover:border-[color:var(--color-sycamore)]/50 transition-colors"
          >
            <Maximize2 className="h-4 w-4" /> Re-open the demo
          </a>
        </div>
        {!sent ? (
          <button onClick={() => setSent(true)} className="block mx-auto mt-5 text-[12.5px] text-[color:var(--color-sycamore)] font-display font-semibold hover:underline">
            Or ask us a question first →
          </button>
        ) : (
          <p className="mt-5 text-[12.5px] text-[color:var(--color-sycamore-strong)] font-display font-semibold inline-flex items-center gap-1.5 justify-center">
            <Check className="h-4 w-4" /> Reply to this link any time — alexander@futureanalytics.io
          </p>
        )}
      </div>

      {/* footer */}
      <div className="surface-raised rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <CoBrand compact />
        <div className="flex flex-col items-center sm:items-end gap-2">
          <a
            href="https://www.futureanalytics.io"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full h-9 px-4 text-[13px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
          >
            <ExternalLink className="h-4 w-4" /> Visit futureanalytics.io
          </a>
          <p className="text-[11.5px] text-[color:var(--color-ink-muted)] text-center sm:text-right">
            Prepared by FutureAnalytics for Debbie Lewis &amp; Will Roberts · Sycamore Square Group · Private &amp; confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
