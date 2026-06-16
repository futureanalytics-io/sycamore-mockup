/*
 * SycBid — mock data + scripted draft engine for the Bidding & Opportunity
 * Engine. EVERYTHING here is illustrative: no live feeds, no API, no real
 * tender data. The records are modelled on the real UK sources a firm like
 * Sycamore Square actually bids into (Contracts Finder, Find a Tender, CCS,
 * Bloom, YORtender, NHS) and the CPV codes a building-surveying / estates
 * consultancy qualifies under — so the demo reads as credible — but the
 * content is invented for the walkthrough.
 *
 * buildDraft() / reviseDraft() are deterministic, scripted stand-ins for the
 * AI drafting + comment->regenerate loop. They tailor prose from the
 * opportunity fields and visibly fold the user's comments back into the draft.
 */

export type BidSource =
  | "Contracts Finder"
  | "Find a Tender"
  | "Crown Commercial Service"
  | "Bloom"
  | "YORtender"
  | "NHS Sourcing";

export type Sector = "Health" | "Education" | "Commercial" | "Defence" | "Residential";

export type BidStatus =
  | "New"
  | "Qualified"
  | "Drafting"
  | "In review"
  | "Approved"
  | "Submitted";

export const STATUS_ORDER: BidStatus[] = [
  "New",
  "Qualified",
  "Drafting",
  "In review",
  "Approved",
  "Submitted",
];

export interface MatchReason {
  label: string;
  /** true = a positive match signal; false = a flagged risk / gap. */
  good: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  buyer: string;
  source: BidSource;
  /** Framework / DPS the notice sits on, or "—" for an open tender. */
  framework: string;
  region: string;
  valueBand: string;
  cpv: { code: string; label: string }[];
  sectors: Sector[];
  /** Plain-English deadline label (illustrative). */
  deadline: string;
  /** 0–100 qualification score. */
  matchScore: number;
  matchReasons: MatchReason[];
  status: BidStatus;
  /** One-line summary of the requirement. */
  summary: string;
}

/* ---- the sources panel (all mocked; toggles filter the board) ---- */
export const SOURCES: { key: BidSource; note: string }[] = [
  { key: "Contracts Finder", note: "gov.uk · below-threshold + general · OCDS API" },
  { key: "Find a Tender", note: "gov.uk · above-threshold (Procurement Act 2023) · OCDS API" },
  { key: "Crown Commercial Service", note: "framework call-offs · you're a CCS supplier" },
  { key: "Bloom", note: "neutral-vendor portal · monitored ingest" },
  { key: "YORtender", note: "Yorkshire LA portal · monitored ingest" },
  { key: "NHS Sourcing", note: "NHS estates opportunities · monitored ingest" },
];

/* ---- SSG accreditations, used by the compliance section of every draft ---- */
const ACCREDITATIONS = [
  "RICS-regulated",
  "ISO 9001 / 14001 / 45001 (ISOQAR)",
  "CHAS Elite",
  "Cyber Essentials",
  "Prosure SSIP",
  "Veriforce",
  "Carbon Neutral",
];

/* ---- seed: 6 opportunities spread across the full pipeline ---- */
export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Condition Surveys & Asset Management — Multi-Academy Trust Estate",
    buyer: "Northern Star Academies Trust",
    source: "Contracts Finder",
    framework: "—",
    region: "West Yorkshire",
    valueBand: "£150k–£250k",
    cpv: [
      { code: "71315300", label: "Building surveying services" },
      { code: "71250000", label: "Architectural & surveying services" },
    ],
    sectors: ["Education"],
    deadline: "Closes in 21 days",
    matchScore: 94,
    matchReasons: [
      { label: "Education sector — your strongest record", good: true },
      { label: "Building surveying CPV (71315300)", good: true },
      { label: "West Yorkshire — on your doorstep", good: true },
      { label: "Value band fits your typical commission", good: true },
      { label: "RICS-regulated requirement", good: true },
    ],
    status: "Qualified",
    summary:
      "Cyclical condition surveys, RAG-graded backlog and a costed 5-year capital plan across 11 academy buildings.",
  },
  {
    id: "opp-2",
    title: "Six-Facet Surveys & Backlog Maintenance Assessment",
    buyer: "Harrogate & District NHS Foundation Trust",
    source: "NHS Sourcing",
    framework: "—",
    region: "North Yorkshire",
    valueBand: "£250k–£500k",
    cpv: [
      { code: "71315300", label: "Building surveying services" },
      { code: "71500000", label: "Construction-related services" },
    ],
    sectors: ["Health"],
    deadline: "Closes in 16 days",
    matchScore: 88,
    matchReasons: [
      { label: "Health sector — existing NHS-adjacent relationships", good: true },
      { label: "Six-facet surveying is core to your offer", good: true },
      { label: "North Yorkshire — within your region", good: true },
      { label: "Larger value — needs a delivery resource plan", good: false },
    ],
    status: "Drafting",
    summary:
      "NHS six-facet condition surveys across the acute estate, feeding a prioritised backlog and statutory compliance picture.",
  },
  {
    id: "opp-3",
    title: "Estates Professional Services DPS — Lot 2 Building Surveying",
    buyer: "Crown Commercial Service",
    source: "Crown Commercial Service",
    framework: "CCS — Estates Professional Services DPS",
    region: "National",
    valueBand: "Framework — call-off",
    cpv: [{ code: "71250000", label: "Architectural & surveying services" }],
    sectors: ["Commercial", "Education", "Health"],
    deadline: "DPS — open for applications",
    matchScore: 83,
    matchReasons: [
      { label: "You're already a CCS supplier", good: true },
      { label: "Multi-sector — opens public-sector call-offs", good: true },
      { label: "Building surveying CPV", good: true },
      { label: "DPS — wins are call-offs, not guaranteed volume", good: false },
    ],
    status: "Submitted",
    summary:
      "Onto the Dynamic Purchasing System for building surveying, unlocking direct call-offs from central-government bodies.",
  },
  {
    id: "opp-4",
    title: "Establishment Condition Surveys & Statutory Compliance",
    buyer: "Defence Infrastructure Organisation",
    source: "Find a Tender",
    framework: "—",
    region: "Yorkshire & Humber",
    valueBand: "£500k–£1M",
    cpv: [
      { code: "71315300", label: "Building surveying services" },
      { code: "71317000", label: "Risk / safety consultancy" },
    ],
    sectors: ["Defence"],
    deadline: "Closes in 28 days",
    matchScore: 71,
    matchReasons: [
      { label: "Defence sector — a named target market", good: true },
      { label: "Condition surveying + compliance is core", good: true },
      { label: "May require List-X / SC-cleared staff", good: false },
      { label: "Scale suggests a delivery partner / sub-consultants", good: false },
    ],
    status: "New",
    summary:
      "Condition surveys and statutory compliance assessment across a portion of the Defence Training Estate.",
  },
  {
    id: "opp-5",
    title: "Strategic Estates & Asset Management Advisory",
    buyer: "Leeds City Council",
    source: "Bloom",
    framework: "Bloom — neutral vendor",
    region: "West Yorkshire",
    valueBand: "£80k–£120k",
    cpv: [{ code: "71530000", label: "Construction consultancy services" }],
    sectors: ["Commercial", "Residential"],
    deadline: "Closes in 11 days",
    matchScore: 86,
    matchReasons: [
      { label: "You're a Bloom-registered supplier", good: true },
      { label: "Existing Leeds City Council relationship", good: true },
      { label: "Strategic estates advisory — director-led fit", good: true },
      { label: "Local — minimal mobilisation", good: true },
    ],
    status: "Approved",
    summary:
      "Strategic advice on a council asset portfolio: condition, utilisation, disposal candidates and a capital prioritisation model.",
  },
  {
    id: "opp-6",
    title: "Architectural & Principal Designer Services — Leisure Centre Refurbishment",
    buyer: "City of York Council",
    source: "YORtender",
    framework: "—",
    region: "York",
    valueBand: "£200k–£350k",
    cpv: [
      { code: "71240000", label: "Architectural, engineering & planning" },
      { code: "71247000", label: "Supervision of building work" },
    ],
    sectors: ["Commercial"],
    deadline: "Closes in 19 days",
    matchScore: 80,
    matchReasons: [
      { label: "Existing City of York Council relationship", good: true },
      { label: "Architecture + CDM Principal Designer in-house", good: true },
      { label: "York — within your region", good: true },
      { label: "Occupied refurbishment — Building Safety Act duties", good: false },
    ],
    status: "In review",
    summary:
      "Architectural design and CDM Principal Designer duties for the refurbishment of an occupied public leisure centre.",
  },
];

/* ---------------------------------------------------------------------------
 * Scripted draft engine
 * ------------------------------------------------------------------------- */

export interface DraftSection {
  key: string;
  title: string;
  body: string;
}

const primarySector = (o: Opportunity) => o.sectors[0] ?? "public-sector";

/** Build a tailored draft from the opportunity fields (scripted, no AI call). */
export function buildDraft(o: Opportunity): DraftSection[] {
  const sector = primarySector(o);
  return [
    {
      key: "summary",
      title: "Executive summary",
      body: `Sycamore Square Group is pleased to respond to ${o.buyer}'s requirement for ${o.title.toLowerCase()}. As a director-led, RICS-regulated construction consultancy operating across ${o.region}, we combine chartered building-surveying expertise with a genuine partnering attitude — 90% of correspondence answered within the hour. This response sets out how we will deliver ${o.summary.toLowerCase()}`,
    },
    {
      key: "experience",
      title: "Relevant experience",
      body: `Our ${sector.toLowerCase()}-sector record is directly relevant. On the University of Bradford campus estate we delivered roof asset-management surveys with section-level RAG grading, remaining-life forecasting and a live capital-exposure model — the same methodology this commission calls for. We hold further comparable ${sector.toLowerCase()} commissions across ${o.region}, each director-led from inception to sign-off.`,
    },
    {
      key: "methodology",
      title: "Methodology & approach",
      body: `We will mobilise a chartered surveyor as named project lead, supported by our wider building-consultancy team. Site inspection captures condition, defects and remaining life in the field; findings are RAG-graded, costed and assembled into a prioritised, costed plan. Every output is reviewed and signed off by a director before issue — your service promise, held.`,
    },
    {
      key: "value",
      title: "Social value & carbon",
      body: `Sycamore Square is a Carbon Neutral business and embeds social value in delivery: local Yorkshire supply chain, support for built-environment apprenticeships, and condition data that targets capital spend where it extends asset life and avoids waste — the most sustainable building is the one you don't have to rebuild.`,
    },
    {
      key: "compliance",
      title: "Compliance & framework fit",
      body: `We meet the standards this ${o.framework === "—" ? "tender" : "framework"} requires and hold: ${ACCREDITATIONS.join(", ")}. ${o.framework === "—" ? "We are a Crown Commercial Service, Bloom and Prosure-registered supplier." : `We are an active supplier on ${o.framework}.`} CDM 2015 and Building Safety Act duties are managed by our in-house Principal Designer capability.`,
    },
  ];
}

export interface DraftComment {
  id: string;
  sectionKey: string;
  text: string;
}

/** Assemble the visible "what we'll ask the AI to revise" prompt. */
export function buildRevisionPrompt(draft: DraftSection[], comments: DraftComment[]): string {
  if (comments.length === 0) return "";
  const lines = comments.map((c) => {
    const sec = draft.find((d) => d.key === c.sectionKey);
    return `• In "${sec?.title ?? c.sectionKey}": ${c.text}`;
  });
  return `Revise the draft, keeping it grounded in Sycamore Square's own track record, and apply these director notes:\n${lines.join(
    "\n"
  )}`;
}

/**
 * Scripted revision. Returns a new draft where any commented section is
 * visibly rewritten to reflect the comment — keyword-aware, with a sensible
 * default that folds the instruction in. Stands in for an AI regenerate call.
 */
export function reviseDraft(draft: DraftSection[], comments: DraftComment[]): DraftSection[] {
  if (comments.length === 0) return draft;
  const byKey = new Map<string, string[]>();
  comments.forEach((c) => {
    byKey.set(c.sectionKey, [...(byKey.get(c.sectionKey) ?? []), c.text]);
  });

  return draft.map((sec) => {
    const notes = byKey.get(sec.key);
    if (!notes) return sec;
    let body = sec.body;
    notes.forEach((note) => {
      const n = note.toLowerCase();
      if (n.includes("bradford")) {
        body = `Leading with our flagship reference: on the University of Bradford campus estate we delivered the exact asset-management methodology this commission requires — section-level RAG grading, remaining-life forecasting and a live capital model the client's estates team could interrogate in real time. ${body}`;
      } else if (n.includes("tighten") || n.includes("shorten") || n.includes("concise")) {
        body = body.split(".").slice(0, 2).join(".").trim() + ".";
      } else if (n.includes("chas") || n.includes("cyber") || n.includes("compliance") || n.includes("iso")) {
        body = `${body} We specifically draw attention to our CHAS Elite and Cyber Essentials certifications and full ISO 9001/14001/45001 accreditation as evidence of operational and information-security maturity.`;
      } else if (n.includes("value") || n.includes("social") || n.includes("carbon")) {
        body = `${body} To strengthen the value case: our recommendations are sequenced to defer or avoid capital spend wherever condition allows, directly reducing both cost and embodied carbon.`;
      } else {
        // generic: fold the director's instruction in explicitly
        body = `${body} [Revised per your note: ${note}]`;
      }
    });
    return { ...sec, body };
  });
}
