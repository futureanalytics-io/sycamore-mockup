"use client";

/*
 * SycBid — the Bidding & Opportunity Engine (mock only, no real data/feeds).
 * Flow: scan sources -> qualify with %match -> open an opportunity ->
 * see the AI-drafted bid -> comment + regenerate -> approve -> submit.
 *
 * State is React-only (no storage). All drafting is scripted in lib/bids-data.
 */
import { useMemo, useState } from "react";
import {
  SEED_OPPORTUNITIES,
  SOURCES,
  buildDraft,
  buildRevisionPrompt,
  reviseDraft,
  type Opportunity,
  type BidSource,
  type BidStatus,
  type DraftSection,
  type DraftComment,
} from "@/lib/bids-data";
import {
  Gavel,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  MessageSquarePlus,
  ShieldCheck,
  FileText,
  Send,
  X,
  Pencil,
  Building2,
  MapPin,
  CalendarClock,
  Tag,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Database,
} from "lucide-react";

/* status -> chip styling */
const STATUS_STYLE: Record<BidStatus, string> = {
  New: "bg-[color:var(--color-cream-edge)] text-[color:var(--color-ink-muted)]",
  Qualified: "bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]",
  Drafting: "bg-[color:var(--color-eggplant-soft)] text-[color:var(--color-eggplant)]",
  "In review": "bg-[color:var(--color-accent-amber)]/15 text-[color:var(--color-rag-amber-stroke)]",
  Approved: "bg-[color:var(--color-accent-green)]/15 text-[color:var(--color-rag-green-stroke)]",
  Submitted: "bg-[color:var(--color-sycamore)] text-white",
};

function StatusChip({ s }: { s: BidStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-display font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[s]}`}>
      {s === "Submitted" && <Check className="h-3 w-3" />}
      {s}
    </span>
  );
}

/* circular match-score ring */
function MatchRing({ score, size = 44 }: { score: number; size?: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const tone =
    score >= 85 ? "var(--color-accent-green)" : score >= 75 ? "var(--color-sycamore)" : "var(--color-accent-amber)";
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-cream-edge)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <span className="absolute font-display font-bold text-[color:var(--color-ink-strong)]" style={{ fontSize: size * 0.28 }}>
        {score}
      </span>
    </span>
  );
}

export function SycBid() {
  const [opps, setOpps] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [enabledSources, setEnabledSources] = useState<Set<BidSource>>(
    new Set(SOURCES.map((s) => s.key))
  );
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = opps.find((o) => o.id === selectedId) ?? null;

  const visible = useMemo(
    () =>
      opps
        .filter((o) => enabledSources.has(o.source))
        .sort((a, b) => b.matchScore - a.matchScore),
    [opps, enabledSources]
  );

  const toggleSource = (s: BidSource) => {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1100);
  };

  const setStatus = (id: string, status: BidStatus) =>
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  if (selected) {
    return (
      <BidDetail
        opp={selected}
        onBack={() => setSelectedId(null)}
        onStatus={(s) => setStatus(selected.id, s)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* hero */}
      <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-5 py-5 sm:px-7 sm:py-6 shadow-[0_1px_3px_rgba(20,36,43,0.05),0_10px_30px_-16px_rgba(20,36,43,0.18)]">
        <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-2.5 rounded-full bg-[color:var(--color-paper)]/70 border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
          <Gavel className="h-3 w-3" />
          Bidding &amp; opportunity engine
        </div>
        <h1 className="brand-title text-[28px] leading-none">SycBid</h1>
        <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-3 max-w-[760px]">
          Every public-sector opportunity worth your time, found, scored against your sectors and frameworks,
          and drafted from your own winning answers — so your directors start a bid at 80% done and spend their
          time on the win themes that actually land it.
        </p>
      </div>

      {/* sources panel */}
      <div className="surface-raised rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-4 w-4 text-[color:var(--color-sycamore)]" />
          <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)]">Sources</h3>
          <span className="text-[10.5px] font-display font-semibold uppercase tracking-[0.1em] text-[color:var(--color-ink-muted)] bg-[color:var(--color-cream-edge)] rounded-full px-2 py-0.5">
            Mocked for the demo
          </span>
        </div>
        <p className="text-[12px] text-[color:var(--color-ink-muted)] mb-3.5 max-w-[80ch]">
          In your live platform these map to real feeds — OCDS JSON for the gov sources (Contracts Finder,
          Find a Tender), monitored ingest for portals without an open API. Toggle a source to filter the board.
        </p>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => {
            const on = enabledSources.has(s.key);
            return (
              <button
                key={s.key}
                onClick={() => toggleSource(s.key)}
                title={s.note}
                aria-pressed={on}
                className={`group inline-flex items-center gap-2 rounded-full pl-2.5 pr-3 h-8 text-[12px] font-display font-semibold border transition-all ${
                  on
                    ? "bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)] border-[color:var(--color-sycamore)]/25"
                    : "bg-[color:var(--color-paper)] text-[color:var(--color-ink-faint)] border-[color:var(--color-line)]"
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${
                    on ? "bg-[color:var(--color-sycamore)] text-white" : "border border-[color:var(--color-line-strong)]"
                  }`}
                >
                  {on && <Check className="h-2.5 w-2.5" />}
                </span>
                {s.key}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            onClick={scan}
            disabled={scanning}
            className="inline-flex items-center gap-2 rounded-full px-5 h-10 text-[14px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] transition-all hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0"
          >
            <RefreshCw className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning sources…" : scanned ? "Re-scan sources" : "Scan for opportunities"}
          </button>
          <span className="text-[12px] text-[color:var(--color-ink-muted)]">
            {scanned ? (
              <span className="inline-flex items-center gap-1.5 text-[color:var(--color-sycamore-strong)] font-display font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> {visible.length} opportunities matched your profile
              </span>
            ) : (
              "Pulls live-style notices and scores each against your sectors, CPV codes and frameworks."
            )}
          </span>
        </div>
      </div>

      {/* opportunity board */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <h3 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)]">Opportunity board</h3>
          <span className="text-[12px] text-[color:var(--color-ink-muted)]">· {visible.length} shown · sorted by match</span>
        </div>
        {visible.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className="group w-full text-left surface-raised rounded-2xl p-4 sm:p-5 hover:border-[color:var(--color-sycamore)]/40 transition-colors flex gap-4 items-start"
          >
            <MatchRing score={o.matchScore} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2 flex-wrap">
                <h4 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)] leading-tight">{o.title}</h4>
                <StatusChip s={o.status} />
              </div>
              <div className="flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-ink-soft)] mt-1">
                <Building2 className="h-3.5 w-3.5 text-[color:var(--color-ink-faint)]" />
                {o.buyer}
              </div>
              <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-1.5 line-clamp-2">{o.summary}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11.5px] text-[color:var(--color-ink-muted)]">
                <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{o.source}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{o.region}</span>
                <span className="inline-flex items-center gap-1 font-display font-semibold text-[color:var(--color-ink-soft)]">{o.valueBand}</span>
                <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{o.deadline}</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[color:var(--color-ink-faint)] group-hover:text-[color:var(--color-sycamore)] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
          </button>
        ))}
        {visible.length === 0 && (
          <div className="surface-raised rounded-2xl py-10 text-center text-[13px] text-[color:var(--color-ink-muted)]">
            No sources enabled — toggle a source above to see opportunities.
          </div>
        )}
      </div>

      <p className="text-[11px] text-[color:var(--color-ink-faint)] px-1">
        Illustrative demo · all opportunities and drafts are mocked. No live tender feeds, no data leaves the browser.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* detail + draft + comment loop                                      */
/* ------------------------------------------------------------------ */

type Stage = "detail" | "draft" | "output";

function BidDetail({
  opp,
  onBack,
  onStatus,
}: {
  opp: Opportunity;
  onBack: () => void;
  onStatus: (s: BidStatus) => void;
}) {
  const [stage, setStage] = useState<Stage>("detail");
  const [draft, setDraft] = useState<DraftSection[]>(() => buildDraft(opp));
  const [comments, setComments] = useState<DraftComment[]>([]);
  const [commentingKey, setCommentingKey] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [approved, setApproved] = useState(opp.status === "Approved" || opp.status === "Submitted");

  const revisionPrompt = buildRevisionPrompt(draft, comments);

  const openDraft = () => {
    setStage("draft");
    if (opp.status === "New" || opp.status === "Qualified") onStatus("Drafting");
  };

  const addComment = (key: string) => {
    const text = commentText.trim();
    if (!text) return;
    setComments((c) => [...c, { id: `${key}-${c.length}`, sectionKey: key, text }]);
    setCommentText("");
    setCommentingKey(null);
  };

  const removeComment = (id: string) => setComments((c) => c.filter((x) => x.id !== id));

  const regenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setDraft((d) => reviseDraft(d, comments));
      setComments([]);
      setRegenerating(false);
    }, 1000);
  };

  const editSection = (key: string, body: string) =>
    setDraft((d) => d.map((s) => (s.key === key ? { ...s, body } : s)));

  const approve = () => {
    setApproved(true);
    onStatus("Approved");
  };

  const submit = () => {
    onStatus("Submitted");
    setStage("output");
  };

  return (
    <div className="space-y-4">
      {/* back + breadcrumb */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[12.5px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] hover:border-[color:var(--color-sycamore)]/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Board
        </button>
        {/* mini stepper */}
        <div className="flex items-center gap-1.5 text-[11.5px] font-display font-semibold">
          {(["detail", "draft", "output"] as Stage[]).map((s, i) => {
            const labels = { detail: "Opportunity", draft: "Draft & review", output: "Submitted" };
            const on = stage === s;
            const done = (["detail", "draft", "output"] as Stage[]).indexOf(stage) > i;
            return (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-1 rounded-full ${
                    on
                      ? "bg-[color:var(--color-sycamore)] text-white"
                      : done
                        ? "bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]"
                        : "bg-[color:var(--color-cream-edge)] text-[color:var(--color-ink-faint)]"
                  }`}
                >
                  {labels[s]}
                </span>
                {i < 2 && <ArrowRight className="h-3 w-3 text-[color:var(--color-ink-faint)]" />}
              </span>
            );
          })}
        </div>
        <div className="ml-auto">
          <StatusChip s={opp.status} />
        </div>
      </div>

      {/* header card */}
      <div className="surface-raised rounded-2xl p-5 flex gap-4 items-start">
        <MatchRing score={opp.matchScore} size={56} />
        <div className="min-w-0">
          <h2 className="font-display text-[19px] font-bold text-[color:var(--color-ink-strong)] leading-tight">{opp.title}</h2>
          <div className="flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink-soft)] mt-1">
            <Building2 className="h-3.5 w-3.5 text-[color:var(--color-ink-faint)]" />
            {opp.buyer}
          </div>
        </div>
      </div>

      {stage === "detail" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* details */}
          <div className="surface-raised rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-sycamore)] mb-1">Requirement</h3>
              <p className="text-[13.5px] text-[color:var(--color-ink)]">{opp.summary}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Tag, l: "Source", v: opp.source },
                { icon: Layers, l: "Framework", v: opp.framework },
                { icon: MapPin, l: "Region", v: opp.region },
                { icon: Building2, l: "Value", v: opp.valueBand },
                { icon: CalendarClock, l: "Deadline", v: opp.deadline },
                { icon: Tag, l: "Sectors", v: opp.sectors.join(", ") },
              ].map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.l} className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-cream-soft)] p-3">
                    <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] font-display font-bold text-[color:var(--color-ink-faint)]">
                      <Icon className="h-3 w-3" />
                      {d.l}
                    </div>
                    <div className="text-[12.5px] font-display font-semibold text-[color:var(--color-ink-strong)] mt-1">{d.v}</div>
                  </div>
                );
              })}
            </div>
            <div>
              <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-sycamore)] mb-1.5">CPV codes</h3>
              <div className="flex flex-wrap gap-1.5">
                {opp.cpv.map((c) => (
                  <span key={c.code} className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 py-1 rounded-full bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)]">
                    <span className="font-mono">{c.code}</span> {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* match breakdown */}
          <div className="surface-raised rounded-2xl p-5">
            <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] mb-0.5">
              {opp.matchScore}% match — why
            </h3>
            <p className="text-[11.5px] text-[color:var(--color-ink-muted)] mb-3">Scored against your sectors, CPV, region, value and framework eligibility.</p>
            <ul className="space-y-2">
              {opp.matchReasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px]">
                  {r.good ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-px text-[color:var(--color-accent-green)]" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-px text-[color:var(--color-accent-amber)]" />
                  )}
                  <span className={r.good ? "text-[color:var(--color-ink-soft)]" : "text-[color:var(--color-rag-amber-stroke)]"}>{r.label}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={openDraft}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full h-10 text-[14px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
            >
              <Sparkles className="h-4 w-4" /> See AI-drafted bid
            </button>
          </div>
        </div>
      )}

      {stage === "draft" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          {/* the draft */}
          <div className="surface-raised rounded-2xl overflow-hidden">
            <div className="bg-[color:var(--color-navy)] text-white px-4 py-2.5 flex items-center gap-2.5 text-[12.5px]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-drafted response — {opp.buyer}</span>
              <span className="ml-auto bg-white/15 rounded-full px-2.5 py-0.5 text-[11px] font-display font-semibold">
                {approved ? "APPROVED" : "DRAFT"}
              </span>
            </div>
            <div className={`p-4 sm:p-5 space-y-4 ${regenerating ? "opacity-40 transition-opacity" : ""}`}>
              {draft.map((sec) => {
                const secComments = comments.filter((c) => c.sectionKey === sec.key);
                const editing = editingKey === sec.key;
                return (
                  <div key={sec.key} className="group relative rounded-xl border border-[color:var(--color-line)] p-3.5 hover:border-[color:var(--color-sycamore)]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-display text-[13px] font-bold text-[color:var(--color-sycamore-strong)] uppercase tracking-[0.06em]">{sec.title}</h4>
                      {!approved && (
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={() => setEditingKey(editing ? null : sec.key)}
                            className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-sycamore)] px-2 py-1 rounded-md hover:bg-[color:var(--color-cream)]"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setCommentingKey(commentingKey === sec.key ? null : sec.key);
                              setCommentText("");
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-[color:var(--color-eggplant)] hover:bg-[color:var(--color-eggplant-soft)] px-2 py-1 rounded-md"
                          >
                            <MessageSquarePlus className="h-3 w-3" /> Comment
                          </button>
                        </div>
                      )}
                    </div>

                    {editing ? (
                      <textarea
                        value={sec.body}
                        onChange={(e) => editSection(sec.key, e.target.value)}
                        rows={5}
                        className="w-full text-[13px] leading-relaxed text-[color:var(--color-ink)] rounded-lg border border-[color:var(--color-sycamore)]/40 bg-[color:var(--color-cream-soft)] p-2.5 outline-none resize-y"
                      />
                    ) : (
                      <p className="text-[13px] leading-relaxed text-[color:var(--color-ink)]">{sec.body}</p>
                    )}

                    {/* comment composer */}
                    {commentingKey === sec.key && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          autoFocus
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addComment(sec.key)}
                          placeholder='e.g. "lead with University of Bradford" or "tighten this"'
                          className="flex-1 text-[12.5px] rounded-full border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] px-3.5 h-9 outline-none focus:border-[color:var(--color-eggplant)]/50"
                        />
                        <button onClick={() => addComment(sec.key)} className="h-9 px-3 rounded-full text-[12.5px] font-display font-semibold text-white bg-[color:var(--color-eggplant)]">
                          Add
                        </button>
                      </div>
                    )}

                    {/* existing comments on this section */}
                    {secComments.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {secComments.map((c) => (
                          <div key={c.id} className="flex items-start gap-2 text-[12px] bg-[color:var(--color-eggplant-soft)]/60 rounded-lg px-2.5 py-1.5">
                            <MessageSquarePlus className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[color:var(--color-eggplant)]" />
                            <span className="flex-1 text-[color:var(--color-ink-soft)]">{c.text}</span>
                            <button onClick={() => removeComment(c.id)} className="text-[color:var(--color-ink-faint)] hover:text-[color:var(--color-rag-red)]">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* side rail: revision prompt + actions */}
          <div className="space-y-4 lg:sticky lg:top-4">
            {/* comment -> prompt */}
            <div className="surface-raised rounded-2xl p-5">
              <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[color:var(--color-eggplant)]" /> Revise with comments
              </h3>
              {comments.length === 0 ? (
                <p className="text-[12px] text-[color:var(--color-ink-muted)] mt-1.5">
                  Click <b className="font-display text-[color:var(--color-eggplant)]">Comment</b> on any section to leave a note.
                  Your notes compose into the instruction below — then regenerate.
                </p>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-[0.1em] font-display font-bold text-[color:var(--color-ink-faint)] mt-3 mb-1.5">
                    What we&apos;ll ask the AI
                  </p>
                  <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-[color:var(--color-ink-soft)] bg-[color:var(--color-cream-soft)] border border-[color:var(--color-line)] rounded-lg p-2.5 font-body">
                    {revisionPrompt}
                  </pre>
                  <button
                    onClick={regenerate}
                    disabled={regenerating}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full h-9 text-[13px] font-display font-bold text-white bg-[color:var(--color-eggplant)] hover:-translate-y-px transition-transform disabled:opacity-60"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
                    {regenerating ? "Regenerating…" : `Regenerate with ${comments.length} comment${comments.length > 1 ? "s" : ""}`}
                  </button>
                </>
              )}
            </div>

            {/* approve / submit */}
            <div className="surface-raised rounded-2xl p-5">
              <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-[color:var(--color-rag-red-stroke)]" /> Director sign-off
              </h3>
              <p className="text-[12px] text-[color:var(--color-ink-muted)] mb-3">
                Nothing submits on its own. A director approves the draft, then generates the final proposal.
              </p>
              {!approved ? (
                <button
                  onClick={approve}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full h-10 text-[13px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
                >
                  <Check className="h-4 w-4" /> Approve draft
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-display font-semibold text-[color:var(--color-sycamore-strong)]">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--color-accent-green)]" /> Approved — locked for editing
                  </div>
                  <button
                    onClick={submit}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full h-10 text-[13px] font-display font-bold text-white bg-[image:var(--gradient-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-px transition-transform"
                  >
                    <FileText className="h-4 w-4" /> Auto-generate proposal &amp; submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {stage === "output" && (
        <div className="space-y-4">
          <div className="surface-raised rounded-2xl p-5 flex items-center gap-3 border-l-4 border-l-[color:var(--color-accent-green)]">
            <CheckCircle2 className="h-6 w-6 text-[color:var(--color-accent-green)] shrink-0" />
            <div>
              <h3 className="font-display text-[15px] font-bold text-[color:var(--color-ink-strong)]">Proposal generated &amp; submitted</h3>
              <p className="text-[12.5px] text-[color:var(--color-ink-muted)]">
                Formatted to your house standard and packaged for the {opp.source} submission. Status moved to <b>Submitted</b>.
              </p>
            </div>
          </div>

          {/* rendered "document" */}
          <div className="surface-raised rounded-2xl overflow-hidden">
            <div className="bg-[color:var(--color-navy)] text-white px-5 py-3 flex items-center gap-2.5">
              <FileText className="h-4 w-4" />
              <span className="text-[13px] font-display font-semibold">Tender response — {opp.buyer}</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] bg-[color:var(--color-accent-green)]/30 rounded-full px-2.5 py-0.5 font-display font-semibold">
                <Check className="h-3 w-3" /> Submitted
              </span>
            </div>
            <div className="p-5 sm:p-8 max-w-[760px] mx-auto">
              <div className="text-[11px] uppercase tracking-[0.18em] font-display font-bold text-[color:var(--color-sycamore)] mb-1">Sycamore Square Group</div>
              <h2 className="font-display text-[22px] font-bold text-[color:var(--color-ink-strong)] leading-tight">{opp.title}</h2>
              <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-1 mb-5">
                Prepared for {opp.buyer} · {opp.region} · {opp.valueBand}
              </p>
              {draft.map((sec) => (
                <section key={sec.key} className="mb-5">
                  <h3 className="font-display text-[14px] font-bold text-[color:var(--color-ink-strong)] border-b border-[color:var(--color-line)] pb-1.5 mb-2">{sec.title}</h3>
                  <p className="text-[13px] leading-relaxed text-[color:var(--color-ink)]">{sec.body}</p>
                </section>
              ))}
              <div className="mt-6 pt-4 border-t border-[color:var(--color-line)] text-[11px] text-[color:var(--color-ink-faint)] flex items-center gap-1.5">
                <Send className="h-3 w-3" /> Illustrative generated document · house-styled · reviewed and approved by a director before submission.
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full px-4 h-9 text-[13px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-paper)] border border-[color:var(--color-line)] hover:border-[color:var(--color-sycamore)]/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the board
          </button>
        </div>
      )}
    </div>
  );
}
