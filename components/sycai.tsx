"use client";

/*
 * SycAI — Sycamore's AI assistant (demo). Scripted, self-contained: a chat UI
 * with example conversations, sourced answers, and suggested follow-ups.
 * Clicking a suggestion (or typing) reveals a pre-written, Sycamore-relevant
 * answer. No live model, no internet, no keys. Sells outcomes, no tooling named.
 */
import { useRef, useState } from "react";
import {
  Sparkles, Send, Plus, FileText, ShieldCheck, MessageSquare,
  CheckSquare, CornerDownRight, Quote,
} from "lucide-react";

interface Source { label: string }
interface TableData { head: string[]; rows: string[][] }
interface Answer {
  intro: string;
  table?: TableData;
  bullets?: string[];
  outro?: string;
  sources: Source[];
}
interface Canned {
  q: string;
  a: Answer;
  follow: string[]; // suggested follow-up questions (keys into ANSWERS or free text)
}

/* scripted answer library — keyed by question text */
const ANSWERS: Record<string, Answer> = {
  "Which sites have open category-1 defects?": {
    intro: "Across the education estate this year, 7 category-1 defects were recorded — 3 remain open. Here are the open items, newest first:",
    table: {
      head: ["Site", "Defect", "Logged", "Owner"],
      rows: [
        ["Block C — Leeds", "Boiler beyond economic life", "12 May", "M. Whitley"],
        ["Block C — Leeds", "Rotten window units (×2)", "12 May", "M. Whitley"],
        ["Annexe — site 2", "Failed parapet flashing", "28 Apr", "C. Beddis"],
      ],
    },
    outro: "All three are on the next capital-works review. Want me to draft the client note?",
    sources: [{ label: "Block C condition survey" }, { label: "Annexe inspection" }, { label: "Estate register" }],
  },
  "Draft a board update for the Bradford roofing project.": {
    intro: "Here's a short progress note for Friday's trust board, drawn from this week's project record:",
    bullets: [
      "Roofing works ~60% complete; a two-day weather delay this week was absorbed without affecting the programme.",
      "Replacement windows confirmed for delivery Monday.",
      "Variation VO-07 (additional flashing) priced and with the client for sign-off.",
      "Next site meeting Thursday 10:00. No health & safety incidents this period.",
    ],
    outro: "Every line is pulled from the project log — nothing invented. Shall I open it in Project Comms for a final check before sending?",
    sources: [{ label: "Bradford roofing — project log" }, { label: "VO-07 variation" }],
  },
  "What's outstanding on the Lot 2 framework bid?": {
    intro: "The Lot 2 framework response is assembled and compliant, with one item still needing your input:",
    table: {
      head: ["Question", "Status"],
      rows: [
        ["Q3.1 Relevant experience", "Drafted from past wins"],
        ["Q3.4 Quality management (ISO)", "Evidence attached"],
        ["Q4.2 Fire compartmentation / BSA", "Drafted"],
        ["Q5.1 Social value & carbon", "Needs a fresh project example"],
      ],
    },
    outro: "Once Q5.1 is finalised it's ready to submit. Want me to suggest a recent project for the social-value answer?",
    sources: [{ label: "Answer library" }, { label: "ISO 9001/14001/45001 evidence" }, { label: "Carbon-neutral statement" }],
  },
  "Are we compliant on the education block refurbishment?": {
    intro: "I checked the pre-construction information pack against CDM 2015, the Building Safety Act and RICS standards. Three gaps to resolve before sign-off:",
    bullets: [
      "No fire strategy section — occupied works engage Building Safety Act duties.",
      "Asbestos register dated 2019 — confirm a current refurbishment/demolition survey before intrusive works.",
      "Principal Contractor not yet named — required where more than one contractor is involved.",
    ],
    outro: "Principal Designer is appointed and recorded (CDM duty met). Your Principal Designer decides how to resolve each gap.",
    sources: [{ label: "Education block — PCI pack" }, { label: "CDM 2015" }, { label: "Building Safety Act 2022" }],
  },
};

const INITIAL: Canned = {
  q: "Which sites have open category-1 defects?",
  a: ANSWERS["Which sites have open category-1 defects?"],
  follow: [
    "Draft a board update for the Bradford roofing project.",
    "What's outstanding on the Lot 2 framework bid?",
    "Are we compliant on the education block refurbishment?",
  ],
};

const FOLLOW_FOR: Record<string, string[]> = {
  "Draft a board update for the Bradford roofing project.": [
    "What's outstanding on the Lot 2 framework bid?",
    "Which sites have open category-1 defects?",
  ],
  "What's outstanding on the Lot 2 framework bid?": [
    "Are we compliant on the education block refurbishment?",
    "Draft a board update for the Bradford roofing project.",
  ],
  "Are we compliant on the education block refurbishment?": [
    "Which sites have open category-1 defects?",
    "What's outstanding on the Lot 2 framework bid?",
  ],
};

const FALLBACK: Answer = {
  intro: "Here's what I found across your projects, documents and surveys. (This is an illustrative demo answer — in your live platform every figure links back to its source.)",
  bullets: [
    "I draw only on Sycamore's own data — projects, reports, bids and surveys.",
    "Every answer is sourced; you click through to the original record.",
    "A director still interprets and decides — I surface, you sign.",
  ],
  sources: [{ label: "Portfolio index" }],
};

interface Turn { q: string; a: Answer; follow: string[] }

export function SycAI() {
  const [turns, setTurns] = useState<Turn[]>([{ q: INITIAL.q, a: INITIAL.a, follow: INITIAL.follow }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = (qRaw: string) => {
    const q = qRaw.trim();
    if (!q) return;
    const a = ANSWERS[q] ?? FALLBACK;
    const follow = FOLLOW_FOR[q] ?? INITIAL.follow;
    setTurns((t) => [...t, { q, a, follow }]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const newChat = () => {
    setTurns([{ q: INITIAL.q, a: INITIAL.a, follow: INITIAL.follow }]);
    setInput("");
  };

  const lastFollow = turns[turns.length - 1]?.follow ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-4 h-[calc(100vh-150px)] min-h-[520px]">
      {/* chat history */}
      <div className="hidden lg:flex flex-col surface-raised rounded-2xl overflow-hidden">
        <button onClick={newChat} className="m-3 inline-flex items-center justify-center gap-2 rounded-full h-9 text-[13px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform">
          <Plus className="h-4 w-4" /> New chat
        </button>
        <div className="px-3 pb-3 overflow-y-auto text-[12.5px]">
          {[
            { when: "Today", items: ["Open category-1 defects", "Bradford board update"] },
            { when: "Last 7 days", items: ["Lot 2 bid status", "CDM gap check — education block", "Dilapidations — Park Place"] },
            { when: "Older", items: ["Estate carbon summary", "Party wall notices Q1"] },
          ].map((g) => (
            <div key={g.when} className="mb-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-ink-faint)] font-display font-bold px-2 mb-1">{g.when}</div>
              {g.items.map((it, i) => (
                <div key={i} className="truncate rounded-lg px-2 py-1.5 text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-cream-edge)] cursor-pointer">{it}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* chat main */}
      <div className="flex flex-col surface-raised rounded-2xl overflow-hidden min-h-0">
        {/* header */}
        <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 border-b border-[color:var(--color-line)]">
          <span className="h-8 w-8 rounded-lg bg-[color:var(--color-eggplant-soft)] flex items-center justify-center text-[color:var(--color-eggplant)]"><Sparkles className="h-4 w-4" /></span>
          <div>
            <div className="font-display font-bold text-[14px] text-[color:var(--color-ink-strong)] leading-tight">SycAI</div>
            <div className="text-[11px] text-[color:var(--color-ink-muted)]">Ask anything across your projects, reports &amp; surveys</div>
          </div>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 min-h-0">
          {turns.map((t, i) => (
            <div key={i} className="space-y-3">
              {/* user question */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[color:var(--color-sycamore)] text-white px-3.5 py-2.5 text-[13px]">{t.q}</div>
              </div>
              {/* answer */}
              <div className="flex gap-2.5">
                <span className="h-7 w-7 shrink-0 rounded-lg bg-[color:var(--color-eggplant-soft)] flex items-center justify-center text-[color:var(--color-eggplant)] mt-0.5"><Sparkles className="h-3.5 w-3.5" /></span>
                <div className="flex-1 rounded-2xl rounded-tl-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper)] p-3.5">
                  <p className="text-[13px] text-[color:var(--color-ink)]">{t.a.intro}</p>
                  {t.a.table && (
                    <table className="w-full border-collapse my-2.5">
                      <thead><tr>{t.a.table.head.map((h, j) => (
                        <th key={j} className="text-left text-[11.5px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-sycamore-tint)] px-2 py-1.5 border-b border-[color:var(--color-line)]">{h}</th>
                      ))}</tr></thead>
                      <tbody>{t.a.table.rows.map((r, ri) => (
                        <tr key={ri}>{r.map((c, ci) => (
                          <td key={ci} className="text-[12px] px-2 py-1.5 border-b border-[color:var(--color-line)]">{c}</td>
                        ))}</tr>
                      ))}</tbody>
                    </table>
                  )}
                  {t.a.bullets && (
                    <ul className="my-2 space-y-1">
                      {t.a.bullets.map((b, bi) => (
                        <li key={bi} className="text-[12.5px] text-[color:var(--color-ink-soft)] flex gap-2"><span className="text-[color:var(--color-sycamore)]">•</span>{b}</li>
                      ))}
                    </ul>
                  )}
                  {t.a.outro && <p className="text-[13px] text-[color:var(--color-ink)] mt-2">{t.a.outro}</p>}
                  {/* sources */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-dashed border-[color:var(--color-line)]">
                    <span className="text-[10.5px] uppercase tracking-[0.1em] font-display font-bold text-[color:var(--color-ink-faint)]">Sources</span>
                    {t.a.sources.map((s, si) => (
                      <span key={si} className="text-[11px] text-[color:var(--color-sycamore-strong)] bg-[color:var(--color-sycamore-soft)] rounded-md px-2 py-0.5 font-medium">{s.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* suggested follow-ups for the latest answer */}
          {lastFollow.length > 0 && (
            <div className="pl-9 flex flex-wrap gap-2">
              {lastFollow.map((f, i) => (
                <button key={i} onClick={() => ask(f)} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--color-ink-soft)] border border-[color:var(--color-line)] bg-[color:var(--color-paper)] rounded-full px-3 py-1.5 hover:border-[color:var(--color-eggplant)]/40 hover:text-[color:var(--color-eggplant)] transition-colors">
                  <CornerDownRight className="h-3 w-3 text-[color:var(--color-ink-faint)]" />{f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* input */}
        <div className="border-t border-[color:var(--color-line)] p-3 sm:p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input); }}
            className="flex items-center gap-2 rounded-full border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] pl-4 pr-1.5 py-1.5 focus-within:border-[color:var(--color-sycamore)]/50 transition-colors"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SycAI about your projects, bids, compliance…"
              className="flex-1 bg-transparent outline-none text-[13px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-faint)]"
            />
            <button type="submit" className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-[image:var(--gradient-brand)] shrink-0 hover:-translate-y-px transition-transform" aria-label="Send">
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <p className="text-[10.5px] text-[color:var(--color-ink-faint)] mt-2 px-1 flex items-center gap-1.5">
            <Quote className="h-3 w-3" /> Illustrative demo · SycAI draws only on Sycamore&apos;s own data and always cites sources; a person reviews before anything is sent.
          </p>
        </div>
      </div>
    </div>
  );
}
