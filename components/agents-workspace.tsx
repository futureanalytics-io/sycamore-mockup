"use client";

/*
 * AgentsWorkspace — Sycamore's INTERNAL environment (the upstream half of the
 * capture -> draft -> portal story). Native React rebuild of the standalone
 * agent demo, in the portal's teal/Poppins design system.
 *
 * Pick an agent, review the real-world inputs, run it (scripted processing
 * pass), see a house-styled draft, and hand off to a director for sign-off.
 * A collapsible business-flow panel maps each agent to a Sycamore workflow lane
 * and tracks the selected agent. "Augment, not automate": every agent ends at
 * human sign-off.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AGENTS,
  AGENT_ORDER,
  type AgentKey,
  type InputCard,
} from "@/lib/agents-data";
import { AgentResult } from "@/components/agent-results";
import {
  FileText,
  ClipboardCheck,
  CheckSquare,
  ShieldCheck,
  MessageSquare,
  Search,
  Camera,
  Mic,
  FolderOpen,
  Play,
  ArrowRight,
  Check,
  ChevronDown,
  Workflow,
  ShieldHalf,
  LayoutDashboard,
  Presentation,
  Lightbulb,
  MousePointerClick,
  Target,
  HelpCircle,
  AlertTriangle,
  Lock,
  Clock,
  UserCheck,
} from "lucide-react";

/* The "Demo guide" holds the presenter's private talking points. It is shown
   only when running locally (npm run dev); in a production build (e.g. the
   Vercel deploy clients see) NODE_ENV is "production", so the guide button and
   panel are compiled out entirely. Keep notes for you, never for the client. */
const SHOW_DEMO_GUIDE = process.env.NODE_ENV === "development";

const AGENT_ICON: Record<AgentKey, React.ComponentType<{ className?: string }>> = {
  survey: FileText,
  condition: ClipboardCheck,
  tender: CheckSquare,
  compliance: ShieldCheck,
  comms: MessageSquare,
  portfolio: Search,
};

/* ---------- single business flow: linear stages, agents pinned ----------
   One picture of when/where each agent is used across Sycamore's work.
   Each stage names the agents that act there; Portfolio Q&A spans the whole
   flow as the knowledge layer. The stage(s) holding the selected agent are
   highlighted so the chart stays live while demoing. */
interface FlowStage {
  id: string;
  label: string;
  caption: string;
  agents: AgentKey[];
  /** Rough effort at this stage: was (manual) → now (with the platform). Illustrative. */
  was: string;
  now: string;
  /** Where the human stays essential — the "human in the loop" note for this stage. */
  human: string;
}
const FLOW_STAGES: FlowStage[] = [
  { id: "win", label: "Win the work", caption: "Bids & framework tenders", agents: ["tender"],
    was: "~2–3 days / bid", now: "~half a day", human: "Directors set strategy & approve" },
  { id: "survey", label: "Site & survey", caption: "Inspect, capture, scan", agents: ["survey", "condition"],
    was: "unchanged", now: "unchanged", human: "Your surveyor's expert eye on site" },
  { id: "draft", label: "Draft & score", caption: "Reports drafted, defects graded", agents: ["survey", "condition"],
    was: "~4–6 hrs / report", now: "~20–30 min", human: "Surveyor confirms grades & findings" },
  { id: "assure", label: "Check & communicate", caption: "Compliance checked, stakeholders updated", agents: ["compliance", "comms"],
    was: "~1–2 hrs / doc", now: "~minutes", human: "Principal Designer & PM decide" },
  { id: "signoff", label: "Director sign-off", caption: "Reviewed & approved by your team", agents: [],
    was: "the decision", now: "stays human", human: "Your director reviews & signs — always" },
];

/** Render a pain string with **segments** highlighted in red. The leading
 *  "Pain: " prefix in the data becomes a standout red "Pain point" tag. */
function Pain({ text }: { text: string }) {
  const body = text.replace(/^Pain:\s*/i, "");
  const parts = body.split(/\*\*(.*?)\*\*/g);
  return (
    <div className="mt-2 flex items-start gap-2 max-w-[80ch] rounded-lg border border-[color:var(--color-rag-red)]/25 bg-[color:var(--color-rag-red)]/[0.06] px-2.5 py-1.5">
      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-[0.1em] text-white bg-[color:var(--color-rag-red)] rounded-full px-2 py-0.5 mt-px">
        <AlertTriangle className="h-3 w-3" />
        Pain point
      </span>
      <p className="text-[12.5px] text-[color:var(--color-ink-soft)] leading-snug">
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <b key={i} className="text-[color:var(--color-rag-red-stroke)] font-display font-bold">
              {p}
            </b>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </p>
    </div>
  );
}

function InputCardView({ c }: { c: InputCard }) {
  const head = (icon: React.ReactNode) => (
    <div className="flex items-center gap-2 text-[13px] font-display font-semibold mb-2 text-[color:var(--color-ink-strong)]">
      {icon}
      <span>{c.ih}</span>
      <span className="ml-auto text-[11px] font-body font-normal text-[color:var(--color-ink-muted)]">{c.meta}</span>
    </div>
  );
  const wrap = "border border-[color:var(--color-line)] rounded-xl bg-[color:var(--color-paper)] p-3.5 mb-3";

  if (c.type === "photos") {
    return (
      <div className={wrap}>
        {head(<Camera className="h-4 w-4 text-[color:var(--color-eggplant)]" />)}
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: c.n }).map((_, i) => (
            <div
              key={i}
              className="w-[54px] h-[40px] rounded-md border border-[color:var(--color-line)] bg-gradient-to-br from-[color:var(--color-sycamore-soft)] to-[color:var(--color-sycamore-tint)] flex items-center justify-center text-[color:var(--color-sycamore)]"
            >
              <Camera className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (c.type === "qline") {
    return (
      <div className={wrap}>
        {head(<Mic className="h-4 w-4 text-[color:var(--color-eggplant)]" />)}
        <div className="text-[14px] italic text-[color:var(--color-ink)]">{c.body}</div>
      </div>
    );
  }
  const icon =
    c.type === "folder" ? (
      <FolderOpen className="h-4 w-4 text-[color:var(--color-eggplant)]" />
    ) : (
      <FileText className="h-4 w-4 text-[color:var(--color-eggplant)]" />
    );
  return (
    <div className={wrap}>
      {head(icon)}
      <pre className="m-0 font-mono text-[12px] leading-[1.55] text-[color:var(--color-ink-soft)] whitespace-pre-wrap bg-[color:var(--color-sycamore-tint)] rounded-lg p-2.5">
        {c.body}
      </pre>
    </div>
  );
}

type Phase = "idle" | "processing" | "done";

export function AgentsWorkspace() {
  const [current, setCurrent] = useState<AgentKey>("survey");
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [signedMsg, setSignedMsg] = useState<string | null>(null);
  const [flowOpen, setFlowOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const a = AGENTS[current];

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setActiveStep(-1);
    setSignedMsg(null);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const select = (k: AgentKey) => {
    setCurrent(k);
    reset();
  };

  const run = () => {
    clearTimers();
    setSignedMsg(null);
    setPhase("processing");
    let delay = 350;
    a.proc.forEach((_, i) => {
      timers.current.push(setTimeout(() => setActiveStep(i), delay));
      delay += 900;
    });
    timers.current.push(
      setTimeout(() => {
        setPhase("done");
        setActiveStep(a.proc.length);
        timers.current.push(
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60)
        );
      }, delay + 150)
    );
  };

  return (
    <div className="space-y-4">
      {/* Intro hero — internal voice */}
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-4 py-5 sm:px-7 sm:py-6 shadow-[0_1px_3px_rgba(20,36,43,0.05),0_10px_30px_-16px_rgba(20,36,43,0.18)]">
        <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-2.5 rounded-full bg-[color:var(--color-paper)]/70 border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
          <ShieldHalf className="h-3 w-3" />
          Sycamore Square OS · Internal
        </div>
        <h1 className="brand-title text-[28px] leading-none">See each agent augment their work</h1>
        <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-3 max-w-[760px]">
          This is your team&apos;s side of the platform. Pick an agent, review the inputs your team already
          produces, then run it to watch the draft build. Every agent ends with one of your qualified
          people reviewing and signing — the finished work then flows into your clients&apos; portal.
          It saves your experts time on the drudgery; it never removes the human judgement and expertise
          that is the essence of your work.
        </p>

        <button
          onClick={() => setFlowOpen((o) => !o)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)] border border-[color:var(--color-sycamore)]/20 px-4 py-2 text-[13px] font-display font-bold transition-colors hover:bg-[color:var(--color-sycamore-tint)]"
          aria-expanded={flowOpen}
        >
          <Workflow className="h-4 w-4" />
          {flowOpen ? "Hide business flow" : "Show how this fits your business"}
          <ChevronDown className={`h-4 w-4 transition-transform ${flowOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Business-flow panel — one flowchart, agents pinned to stages */}
      {flowOpen && (
        <div className="surface-raised rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-[17px] font-bold text-[color:var(--color-ink-strong)]">
            Your business flow — where each agent is used
          </h3>
          <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-1 mb-3 max-w-[78ch]">
            One picture of how the agents sit across your work — from winning the job to issuing into
            the client portal. Each stage shows the agents that act there, a rough sense of the time
            it gives back, and where your people stay in the loop. Click an agent to demo it.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4 text-[11px] text-[color:var(--color-ink-muted)]">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3 text-[color:var(--color-ink-faint)]" /> rough time, before → after <span className="opacity-70">(illustrative)</span></span>
            <span className="inline-flex items-center gap-1.5"><UserCheck className="h-3 w-3 text-[color:var(--color-eggplant)]" /> where your people stay in control</span>
          </div>

          {/* the flow: horizontal on desktop, stacked on mobile */}
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0">
            {FLOW_STAGES.map((stage, si) => {
              const hot = stage.agents.includes(current);
              const isSignoff = stage.id === "signoff";
              return (
                <div key={stage.id} className="flex flex-col lg:flex-row lg:items-stretch lg:flex-1">
                  <div
                    className={`flex-1 rounded-xl border p-3.5 transition-all ${
                      hot
                        ? "border-[color:var(--color-sycamore)] bg-gradient-to-b from-[color:var(--color-sycamore-tint)] to-[color:var(--color-paper)] shadow-[var(--shadow-sm)]"
                        : isSignoff
                          ? "border-[color:var(--color-rag-red)]/25 bg-[color:var(--color-rag-red)]/5"
                          : "border-[color:var(--color-line)] bg-[color:var(--color-paper)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-display text-[10px] font-bold ${isSignoff ? "text-[color:var(--color-rag-red-stroke)]" : "text-[color:var(--color-ink-faint)]"}`}>
                        {String(si + 1).padStart(2, "0")}
                      </span>
                      <b className="font-display text-[13.5px] text-[color:var(--color-ink-strong)] leading-tight">{stage.label}</b>
                    </div>
                    <p className="text-[11.5px] text-[color:var(--color-ink-muted)] mb-2.5">{stage.caption}</p>

                    {isSignoff ? (
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-display font-semibold px-2.5 py-1 rounded-full bg-[color:var(--color-rag-red)]/12 text-[color:var(--color-rag-red-stroke)]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Your director signs
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {stage.agents.map((ak) => {
                          const Icon = AGENT_ICON[ak];
                          const on = ak === current;
                          return (
                            <button
                              key={ak}
                              onClick={() => select(ak)}
                              className={`inline-flex items-center gap-1.5 text-[11.5px] font-display font-semibold px-2.5 py-1 rounded-full border transition-all ${
                                on
                                  ? "bg-[image:var(--gradient-brand)] text-white border-transparent shadow-[var(--shadow-brand)]"
                                  : "bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)] border-transparent hover:bg-[color:var(--color-sycamore-tint)]"
                              }`}
                            >
                              <Icon className="h-3 w-3" />
                              {AGENTS[ak].label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* rough effort: was → now (illustrative, time only — no pricing) */}
                    <div className="mt-2.5 pt-2.5 border-t border-dashed border-[color:var(--color-line)] flex items-center gap-1.5 text-[10.5px]">
                      <Clock className="h-3 w-3 shrink-0 text-[color:var(--color-ink-faint)]" />
                      <span className="text-[color:var(--color-ink-muted)] line-through">{stage.was}</span>
                      <ArrowRight className="h-2.5 w-2.5 shrink-0 text-[color:var(--color-ink-faint)]" />
                      <span className="font-display font-bold text-[color:var(--color-sycamore-strong)]">{stage.now}</span>
                    </div>
                    {/* human in the loop */}
                    <div className="mt-1.5 flex items-start gap-1.5 text-[10.5px] text-[color:var(--color-eggplant)]">
                      <UserCheck className="h-3 w-3 shrink-0 mt-px" />
                      <span className="font-medium">{stage.human}</span>
                    </div>
                  </div>

                  {/* connector arrow between stages */}
                  {si < FLOW_STAGES.length - 1 && (
                    <div className="flex items-center justify-center text-[color:var(--color-ink-faint)] lg:px-1 py-1 lg:py-0">
                      <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* final arrow into the client portal */}
            <div className="flex items-center justify-center text-[color:var(--color-ink-faint)] lg:px-1 py-1 lg:py-0">
              <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
            </div>
            <div className="lg:flex-[0.8] rounded-xl border border-[color:var(--color-sycamore)]/40 bg-gradient-to-b from-white to-[color:var(--color-sycamore-tint)] p-3.5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="h-4 w-4 text-[color:var(--color-sycamore)]" />
                <b className="font-display text-[13.5px] text-[color:var(--color-sycamore-strong)] leading-tight">Client portal</b>
              </div>
              <p className="text-[11.5px] text-[color:var(--color-ink-muted)]">Finished work flows to your client — owned by you</p>
            </div>
          </div>

          {/* Portfolio Q&A spanning layer */}
          <div className="mt-2.5 rounded-xl border border-dashed border-[color:var(--color-eggplant)]/35 bg-[color:var(--color-eggplant-soft)]/50 px-3.5 py-2.5 flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => select("portfolio")}
              className={`inline-flex items-center gap-1.5 text-[11.5px] font-display font-semibold px-2.5 py-1 rounded-full border transition-all ${
                current === "portfolio"
                  ? "bg-[color:var(--color-eggplant)] text-white border-transparent"
                  : "bg-[color:var(--color-paper)] text-[color:var(--color-eggplant)] border-[color:var(--color-eggplant)]/30 hover:bg-[color:var(--color-eggplant-soft)]"
              }`}
            >
              <Search className="h-3 w-3" />
              Portfolio Q&amp;A
            </button>
            <span className="text-[12px] text-[color:var(--color-ink-soft)]">
              Sits underneath the whole flow — ask plain-language questions across everything captured at every stage.
            </span>
          </div>

          <p className="mt-3 text-[11.5px] text-[color:var(--color-ink-muted)]">
            Highlighted stage follows the agent you&apos;re demoing. An illustrative map of how Sycamore already works.
          </p>
        </div>
      )}

      {/* Agent switcher chips */}
      <div className="flex flex-wrap gap-2">
        {AGENT_ORDER.map((k) => {
          const Icon = AGENT_ICON[k];
          const on = k === current;
          return (
            <button
              key={k}
              onClick={() => select(k)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 rounded-full px-4 h-9 text-[13px] font-display font-semibold border transition-all ${
                on
                  ? "bg-[image:var(--gradient-brand)] text-white border-transparent shadow-[var(--shadow-brand)]"
                  : "bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] border-[color:var(--color-line)] hover:border-[color:var(--color-sycamore)]/40 hover:text-[color:var(--color-sycamore)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {AGENTS[k].label}
            </button>
          );
        })}
      </div>

      {/* Workbench */}
      <div className="surface-raised rounded-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-start gap-3.5 px-5 sm:px-6 py-4 border-b border-[color:var(--color-line)]">
          <span className="w-[42px] h-[42px] shrink-0 rounded-xl bg-[color:var(--color-sycamore-soft)] flex items-center justify-center text-[color:var(--color-sycamore)]">
            {(() => {
              const Icon = AGENT_ICON[current];
              return <Icon className="h-5 w-5" />;
            })()}
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[19px] font-bold text-[color:var(--color-ink-strong)]">{a.title}</h2>
            <Pain text={a.pain} />
          </div>
          {SHOW_DEMO_GUIDE && (
            <button
              onClick={() => setGuideOpen((o) => !o)}
              aria-expanded={guideOpen}
              className={`ml-auto shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[12px] font-display font-bold border transition-colors ${
                guideOpen
                  ? "bg-[color:var(--color-eggplant)] text-white border-transparent"
                  : "bg-[color:var(--color-eggplant-soft)] text-[color:var(--color-eggplant)] border-[color:var(--color-eggplant)]/25 hover:bg-[color:var(--color-eggplant-soft)]/70"
              }`}
            >
              <Presentation className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Demo guide</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${guideOpen ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Demo guide — presenter talking points, DEV-ONLY (compiled out in production) */}
        {SHOW_DEMO_GUIDE && guideOpen && (
          <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-eggplant-soft)]/35 px-5 sm:px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-[0.16em] font-display font-bold text-[color:var(--color-eggplant)] bg-[color:var(--color-paper)] border border-[color:var(--color-eggplant)]/25 rounded-full px-2.5 py-1">
                For you — not on the client&apos;s screen
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* hook */}
              <div className="flex gap-2.5">
                <Lightbulb className="h-[18px] w-[18px] shrink-0 mt-0.5 text-[color:var(--color-eggplant)]" />
                <div>
                  <h5 className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-eggplant)] mb-1">Open with</h5>
                  <p className="text-[13px] text-[color:var(--color-ink)] italic">&ldquo;{a.guide.hook}&rdquo;</p>
                </div>
              </div>
              {/* land */}
              <div className="flex gap-2.5">
                <Target className="h-[18px] w-[18px] shrink-0 mt-0.5 text-[color:var(--color-eggplant)]" />
                <div>
                  <h5 className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-eggplant)] mb-1">The line that lands it</h5>
                  <p className="text-[13px] text-[color:var(--color-ink)]">{a.guide.land}</p>
                </div>
              </div>
              {/* point at */}
              <div className="flex gap-2.5">
                <MousePointerClick className="h-[18px] w-[18px] shrink-0 mt-0.5 text-[color:var(--color-eggplant)]" />
                <div>
                  <h5 className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-eggplant)] mb-1">As you run it, point at</h5>
                  <ol className="list-decimal pl-4 space-y-1">
                    {a.guide.pointAt.map((p, i) => (
                      <li key={i} className="text-[12.5px] text-[color:var(--color-ink-soft)]">{p}</li>
                    ))}
                  </ol>
                </div>
              </div>
              {/* question + answer */}
              <div className="flex gap-2.5">
                <HelpCircle className="h-[18px] w-[18px] shrink-0 mt-0.5 text-[color:var(--color-eggplant)]" />
                <div>
                  <h5 className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-eggplant)] mb-1">If they ask</h5>
                  <p className="text-[12.5px] text-[color:var(--color-ink-strong)] font-display font-semibold mb-0.5">{a.guide.question}</p>
                  <p className="text-[12.5px] text-[color:var(--color-ink-soft)]">{a.guide.answer}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* INPUT column */}
          <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[color:var(--color-line)] bg-gradient-to-b from-[color:var(--color-cream-soft)] to-[color:var(--color-paper)]">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-sycamore)]">{a.inLabel}</h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold text-[color:var(--color-ink-muted)] bg-[color:var(--color-cream-edge)] border border-[color:var(--color-line)] rounded-full px-2 py-0.5">
                <Lock className="h-2.5 w-2.5" />
                Inputs · sample, read-only
              </span>
            </div>
            <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mb-3.5">{a.inSub}</p>
            {a.inputs.map((c, i) => (
              <InputCardView key={i} c={c} />
            ))}
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <button
                onClick={run}
                disabled={phase === "processing"}
                className="inline-flex items-center gap-2 rounded-full px-5 h-10 text-[14px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] transition-all hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
              >
                <Play className="h-4 w-4" />
                {a.runLabel}
              </button>
              {phase === "done" && (
                <button
                  onClick={reset}
                  className="inline-flex items-center rounded-full px-4 h-10 text-[13px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] hover:border-[color:var(--color-sycamore)]/40"
                >
                  Reset
                </button>
              )}
              <span className="text-[11.5px] text-[color:var(--color-ink-muted)]">Illustrative — a scripted walkthrough of your workflow.</span>
            </div>
          </div>

          {/* OUTPUT column */}
          <div className="p-5 sm:p-6">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-sycamore)] mb-0.5">What comes out</h4>
            <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mb-3.5">A house-styled draft, ready for review — not a finished document sent on its own.</p>

            {phase === "idle" && (
              <div className="text-[13.5px] text-[color:var(--color-ink-muted)] border border-dashed border-[color:var(--color-line-strong)] rounded-xl py-8 px-5 text-center bg-[color:var(--color-cream-soft)]">
                <FileText className="h-8 w-8 text-[color:var(--color-ink-faint)] mx-auto mb-2.5" />
                Press <b className="font-display text-[color:var(--color-ink-soft)]">{a.runLabel}</b> to see the draft appear here.
              </div>
            )}

            {phase === "processing" && (
              <div className="flex flex-col gap-2.5 py-2">
                {a.proc.map((p, i) => {
                  const done = i < activeStep;
                  const active = i === activeStep;
                  return (
                    <div key={i} className={`flex items-center gap-3 text-[13.5px] transition-opacity ${done ? "text-[color:var(--color-sycamore-strong)]" : active ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-faint)]"}`}>
                      <span className={`w-[22px] h-[22px] shrink-0 rounded-full border-2 flex items-center justify-center ${done ? "bg-[color:var(--color-sycamore)] border-[color:var(--color-sycamore)]" : active ? "border-[color:var(--color-sycamore)]" : "border-[color:var(--color-line-strong)]"}`}>
                        {done ? <Check className="h-3 w-3 text-white" /> : active ? <span className="w-2 h-2 rounded-full bg-[color:var(--color-sycamore)] animate-pulse" /> : null}
                      </span>
                      {p}
                    </div>
                  );
                })}
              </div>
            )}

            {phase === "done" && (
              <div ref={resultRef} className="animate-[fadeIn_0.4s_ease]">
                <div className="rounded-xl border border-[color:var(--color-line)] overflow-hidden shadow-[var(--shadow-sm)]">
                  <div className="bg-[color:var(--color-navy)] text-white px-4 py-2.5 flex items-center gap-2.5 text-[12.5px]">
                    <Check className="h-3.5 w-3.5" />
                    <span>{a.docKind}</span>
                    <span className="ml-auto bg-white/15 rounded-full px-2.5 py-0.5 text-[11px] font-display font-semibold">DRAFT</span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <AgentResult agent={current} />
                  </div>
                </div>

                {/* sign-off — augment, not automate */}
                <div className="mt-3.5 rounded-xl border border-[color:var(--color-rag-red)]/25 bg-[color:var(--color-rag-red)]/5 p-3.5 flex gap-3 items-start">
                  <span className="w-[34px] h-[34px] shrink-0 rounded-lg bg-[color:var(--color-rag-red)]/12 flex items-center justify-center text-[color:var(--color-rag-red-stroke)]">
                    <ShieldCheck className="h-[18px] w-[18px]" />
                  </span>
                  <div className="flex-1">
                    <h5 className="font-display text-[13px] font-bold text-[color:var(--color-rag-red-stroke)]">Director review &amp; sign-off</h5>
                    <p className="text-[12.5px] text-[color:var(--color-ink-soft)] mt-0.5">{a.qa}</p>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => setSignedMsg(a.signed)}
                        className="rounded-full px-3.5 py-1.5 text-[12px] font-display font-semibold text-white bg-[image:var(--gradient-brand)] hover:-translate-y-px transition-transform"
                      >
                        Approve &amp; issue
                      </button>
                      <button
                        onClick={() => setSignedMsg("Opened for editing — your changes feed back into the house standard.")}
                        className="rounded-full px-3.5 py-1.5 text-[12px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] hover:border-[color:var(--color-sycamore)]/40"
                      >
                        Edit first
                      </button>
                    </div>
                    {signedMsg && (
                      <div className="flex items-center gap-1.5 mt-2.5 text-[12.5px] font-display font-semibold text-[color:var(--color-sycamore-strong)]">
                        <Check className="h-[15px] w-[15px] text-[color:var(--color-sycamore)]" />
                        {signedMsg}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* outcome strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { t: "Capacity without headcount", d: "The drudgery between input and sign-off is removed, so your existing experts take on more commissions without the backlog." },
          { t: "Consistency, every time", d: "Every report, bid and check follows your house standard — directors review polished output instead of reworking it." },
          { t: "You stay in control", d: "Nothing goes out unchecked. Every agent hands a draft to your qualified people — augment, not automate." },
        ].map((o, i) => (
          <div key={i} className="surface-raised rounded-xl p-5">
            <h3 className="font-display text-[14.5px] font-bold text-[color:var(--color-ink-strong)] mb-1.5">{o.t}</h3>
            <p className="text-[12.5px] text-[color:var(--color-ink-soft)]">{o.d}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
