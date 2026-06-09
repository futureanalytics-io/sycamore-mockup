/*
 * Sycamore Square OS agent demo data — Sycamore's INTERNAL workspace.
 * (Client-facing product name is "Sycamore Square OS" — their own platform.)
 * Ported from the standalone mockup (clients/sycamore/mockup/agent-demo.html)
 * into typed data so it renders as native portal components in the teal/Poppins
 * design system. Sells outcomes, never the underlying tooling/stack; no pricing,
 * ROI, or other-client identity.
 *
 * This is the upstream half of the story: Sycamore's team runs these agents,
 * a qualified person signs off, and the finished work flows into the external
 * client portal (the rest of this app).
 */

export type AgentKey =
  | "survey"
  | "condition"
  | "tender"
  | "compliance"
  | "comms"
  | "portfolio";

export type InputCard =
  | { type: "note"; ih: string; meta: string; body: string }
  | { type: "folder"; ih: string; meta: string; body: string }
  | { type: "photos"; ih: string; meta: string; n: number }
  | { type: "qline"; ih: string; meta: string; body: string };

/** Presenter talking points — shown in the collapsible "Demo guide". */
export interface DemoGuide {
  /** One-line hook to open with — the outcome in the client's language. */
  hook: string;
  /** What to point at on screen, in order, as you run it. */
  pointAt: string[];
  /** The closing line that ties it to their specific pain. */
  land: string;
  /** A likely client question and your answer. */
  question: string;
  answer: string;
}

export interface AgentDef {
  label: string;
  title: string;
  /** Pain line; segments wrapped in ** ** render as the timber/eggplant accent. */
  pain: string;
  inLabel: string;
  inSub: string;
  runLabel: string;
  proc: string[];
  docKind: string;
  qa: string;
  signed: string;
  inputs: InputCard[];
  guide: DemoGuide;
}

export const AGENT_ORDER: AgentKey[] = [
  "survey",
  "condition",
  "tender",
  "compliance",
  "comms",
  "portfolio",
];

export const AGENTS: Record<AgentKey, AgentDef> = {
  survey: {
    label: "Survey-to-Report",
    title: "Survey-to-Report agent",
    pain: "Pain: field notes, photos and 3D scans turn into client-ready reports slowly, with constant re-keying into **your house templates**.",
    inLabel: "Field capture from the visit",
    inSub: "Exactly what your surveyor brings back today — no new admin on site.",
    runLabel: "Draft the report",
    proc: [
      "Reading field notes, photos & scan tags",
      "Mapping observations to your house sections",
      "Drafting in Sycamore format",
    ],
    docKind: "Dilapidations schedule — first draft",
    qa: "A surveyor or director reviews the draft, adjusts wording, and signs. The blank-page write-up is gone.",
    signed: "Approved — report issued to the client.",
    inputs: [
      {
        type: "note",
        ih: "Site notes — voice + typed",
        meta: "Dilapidations, Unit 4",
        body: "Terminal dilapidations inspection, ground-floor commercial unit ~210m². Roof covering felt, ponding NE corner. Two windows seized (rear elevation). Damp staining to store-room ceiling — likely failed flashing above. Electrics: consumer unit 2009, no RCD on lighting circuit. Tenant alterations (partition + kitchenette) not reinstated.",
      },
      { type: "photos", ih: "Site photos", meta: "14 tagged", n: 5 },
      {
        type: "note",
        ih: "3D scan reference",
        meta: "site scan",
        body: "Scan ref SSG-PP4-02 linked. Floor area & ceiling heights auto-measured; defect pins dropped at roof corner, rear windows, store-room ceiling.",
      },
    ],
    guide: {
      hook: "Half a survey is the write-up, not the inspection. This is where you get that half back.",
      pointAt: [
        "Point at the inputs first: \"This is exactly what your surveyor already brings back — notes, photos, a scan. Nothing new on site.\"",
        "Hit Run and let the draft build: \"In the time it takes to make a coffee, you've got a first-draft schedule in your house format.\"",
        "Scroll the draft — note the breaches table and that every item links back to the photo/scan evidence.",
        "Land on the sign-off banner: \"It stops here, at your surveyor. They tidy and sign.\"",
      ],
      land: "Your billable people stop re-keying and get back to the expert work you actually charge for.",
      question:
        "\"Will it just churn out generic reports?\"",
      answer:
        "No — it drafts in your house template and your wording, from your captured evidence, then waits for your surveyor to review and sign. It's a faster first draft, not an unchecked final.",
    },
  },
  condition: {
    label: "Condition Report",
    title: "Condition Report agent",
    pain: "Pain: estate-wide condition surveys need every element scored and defects classified **consistently** — across many concurrent commissions.",
    inLabel: "Inspection capture across the estate",
    inSub: "Element-by-element observations from the walk-round.",
    runLabel: "Score & classify",
    proc: [
      "Reading element observations",
      "Applying your condition-grade scale",
      "Classifying defects & remedial priority",
    ],
    docKind: "Condition Survey — scored schedule",
    qa: "A surveyor confirms the grades and remedy priorities, then a director signs. Classification is consistent across the whole estate.",
    signed: "Approved — schedule added to the estate report.",
    inputs: [
      {
        type: "note",
        ih: "Element observations",
        meta: "Block C, Leeds site",
        body: "Roof: localised slipped tiles, flashing lifting at parapet.\nExternal walls: spalling to brick plinth, west elevation.\nWindows: timber frames, paint failure, 2 units rotten.\nM&E: boiler 14yrs, beyond economic life.\nInternal: floor finishes serviceable; ceiling tiles stained (water ingress).",
      },
    ],
    guide: {
      hook: "Across a big estate, the hard part isn't spotting defects — it's grading them the same way every time, on every block.",
      pointAt: [
        "Point at the raw observations: \"This is one surveyor's walk-round notes.\"",
        "Run it, then point at the scored schedule: \"Every element graded to your scale, defects classified consistently — the same standard on block one and block fifty.\"",
        "Highlight the priority defects and the net-zero / retrofit line: \"It also surfaces retrofit priorities — which feeds a sustainability story your estate-owner clients increasingly have to report on.\"",
      ],
      land: "Consistency at estate scale is what makes the data trustworthy enough to sell a dashboard on top of — and it plays straight to your carbon-neutral positioning.",
      question:
        "\"How do we know the grading is right?\"",
      answer:
        "Your surveyor confirms the grades and priorities before anything is signed. The agent applies your scale consistently; your expert still has the final call on every grade.",
    },
  },
  tender: {
    label: "Tender / Bid",
    title: "Tender / Bid agent",
    pain: "Pain: repetitive **public-sector framework bids** (PQQs/ITTs) rebuild answers from scratch each round and eat director time.",
    inLabel: "The tender + your library",
    inSub: "This opportunity, matched against your proven past answers.",
    runLabel: "Assemble the response",
    proc: [
      "Reading the tender questions",
      "Matching to your best past wins",
      "Drafting + flagging gaps",
    ],
    docKind: "Framework response — assembled draft",
    qa: "Directors sharpen the win themes and approve. No more hunting through old submissions for the right answer.",
    signed: "Approved — submission packaged for the portal.",
    inputs: [
      {
        type: "note",
        ih: "Tender — selection questions",
        meta: "Public-sector framework, Lot 2",
        body: "Q3.1  Relevant experience: building surveying & CDM Principal Designer on occupied public-sector estates.\nQ3.4  Quality management & ISO accreditations.\nQ4.2  Approach to fire compartmentation / Building Safety Act duties.\nQ5.1  Social value & carbon commitments.",
      },
      {
        type: "folder",
        ih: "Your answer library",
        meta: "past wins matched",
        body: "3 strong past responses matched to Q3.1 · ISO 9001/14001/45001 evidence on file · prior BSA Principal Designer narrative · carbon-neutral statement available.",
      },
    ],
    guide: {
      hook: "Every framework bid, you rebuild the same answers from scratch under deadline. This starts you at 80% done.",
      pointAt: [
        "Point at the two inputs: \"On the left, this tender's questions. On the right, your own library of winning answers.\"",
        "Run it, then walk the assembled response: \"It's pulled your best past answers and your ISO and BSA evidence straight into the right questions.\"",
        "Crucially, point at the flagged gap (Q5.1): \"And it tells you exactly what's missing — so nothing goes in half-answered.\"",
      ],
      land: "More framework bids answered to a higher standard, without your directors losing evenings to copy-paste — that's directly more pipeline.",
      question:
        "\"Won't reused answers make our bids look generic?\"",
      answer:
        "It assembles from your own proven wins, then your directors sharpen the win themes and approve. It removes the boilerplate grind so your people spend their time on the differentiation that actually wins.",
    },
  },
  compliance: {
    label: "Compliance",
    title: "Compliance agent",
    pain: "Pain: documents must be checked against **CDM 2015, the Building Safety Act & RICS standards** — manual, exacting, and easy to miss.",
    inLabel: "The document to check",
    inSub: "Checked against the obligations that apply to this job.",
    runLabel: "Run compliance check",
    proc: [
      "Reading the document",
      "Checking against applicable standards",
      "Flagging gaps with reasons",
    ],
    docKind: "Compliance check — gap report",
    qa: "A Principal Designer reviews each flag and decides how to resolve. Problems are caught before sign-off, not after issue.",
    signed: "Approved — actions assigned, document cleared for sign-off.",
    inputs: [
      {
        type: "note",
        ih: "Document under review",
        meta: "Pre-construction info pack",
        body: "Refurbishment of occupied two-storey education block. Asbestos register attached (2019). Scope: re-roofing, window replacement, minor M&E. No fire strategy section included. Principal Designer named; Principal Contractor TBC.",
      },
    ],
    guide: {
      hook: "On regulated, public-sector work, the risk isn't the obligation you check — it's the one you forget.",
      pointAt: [
        "Point at the document: \"A pre-construction info pack — the kind your Principal Designer signs off.\"",
        "Run it, then walk the findings: \"It's checked the pack against CDM, the Building Safety Act and RICS, and flagged three real gaps — no fire strategy, a stale asbestos register, no Principal Contractor named.\"",
        "Point at the green tick: \"It also confirms what's right, so the check is auditable.\"",
        "Land on sign-off: \"Your Principal Designer decides how to resolve each one — the agent never makes the call.\"",
      ],
      land: "Gaps get caught before sign-off instead of after issue — that's the difference between a note and a liability on Building-Safety-Act work.",
      question:
        "\"Can we rely on it to be compliant?\"",
      answer:
        "It's a second pair of eyes that never gets tired or rushed — it surfaces and explains gaps. Your qualified people still make every compliance decision and sign. It reduces the chance of a miss; it doesn't replace the duty-holder.",
    },
  },
  comms: {
    label: "Project Comms",
    title: "Project Comms agent",
    pain: "Pain: high correspondence volume across multi-stakeholder projects strains a small team holding a **1-hour response promise**.",
    inLabel: "The project record",
    inSub: "A grounded draft written from the project's own information.",
    runLabel: "Draft the update",
    proc: [
      "Reading the project record",
      "Pulling the relevant facts",
      "Drafting in Sycamore's voice",
    ],
    docKind: "Stakeholder update — draft email",
    qa: "The right person glances, adjusts and sends — the 1-hour standard is protected without burning out the team.",
    signed: "Approved — update sent to the stakeholder.",
    inputs: [
      {
        type: "note",
        ih: "Project log — this week",
        meta: "Health sector refurb",
        body: "Roofing works 60% complete; weather delay Tue–Wed (2 days). Window delivery confirmed for next Mon. Variation VO-07 (additional flashing) priced, awaiting client sign-off. Next site meeting Thu 10:00. No H&S incidents.",
      },
      {
        type: "qline",
        ih: "Stakeholder request",
        meta: "Client PM",
        body: "“Can you send me a short progress note for the trust board on Friday?”",
      },
    ],
    guide: {
      hook: "You market a one-hour response promise. On a small team running many projects, that promise is the first thing to crack under load.",
      pointAt: [
        "Point at the inputs: \"Your project log for the week, and a stakeholder asking for a board update.\"",
        "Run it, then read the draft: \"Every line is pulled from the project record — 60% complete, the weather delay, VO-07 awaiting sign-off. Nothing invented.\"",
        "Land on the quick review: \"Someone glances, tweaks, sends — in minutes, not after an hour of writing.\"",
      ],
      land: "You protect the responsiveness you're known for, even as the project count climbs — without burning the team out to do it.",
      question:
        "\"Will it sound like us, or like a robot?\"",
      answer:
        "It drafts in your voice from your project's own facts, and a person always reviews before it sends. It removes the blank-page delay; the human still owns the tone and the send.",
    },
  },
  portfolio: {
    label: "Portfolio Q&A",
    title: "Portfolio Q&A agent",
    pain: "Pain: knowledge is scattered across projects — a simple cross-estate question means **hours of manual searching**.",
    inLabel: "Ask in plain English",
    inSub: "A plain-language question across every project, document and survey.",
    runLabel: "Ask the portfolio",
    proc: [
      "Searching across all projects",
      "Gathering matching records",
      "Composing a sourced answer",
    ],
    docKind: "Portfolio answer — with sources",
    qa: "A director uses the answer to make the call — with every source one click away. Insight on demand, not a fishing trip.",
    signed: "Noted — answer saved to the estate dashboard.",
    inputs: [
      {
        type: "qline",
        ih: "Your question",
        meta: "plain English",
        body: "“Show every category-1 defect found across the education estate this year, and which are still open.”",
      },
    ],
    guide: {
      hook: "Right now, answering 'what's our exposure across the estate?' means someone digging through files for a day. Ask it in plain English instead.",
      pointAt: [
        "Point at the question — it's typed the way a director would actually ask it.",
        "Run it, then point at the answer: \"Seven category-1 defects, three still open — pulled from across every project.\"",
        "Point at the sources: \"And every figure is sourced — one click back to the original survey. No black box.\"",
      ],
      land: "This is the agent that turns your reports into a live, queryable asset — and it's the foundation for the dashboards you could sell your estate-owner clients as a subscription.",
      question:
        "\"Can we trust the answer?\"",
      answer:
        "Every answer is sourced — you click straight through to the original report behind each figure. It surfaces and cites; your director still interprets and decides.",
    },
  },
};

/* ---------- business-flow lanes (one per agent) ---------- */
export type StepKind = "team" | "fos" | "qa";
export interface FlowLane {
  tag: string;
  steps: { k: StepKind; t: string }[];
}
export const LANES: Record<AgentKey, FlowLane> = {
  survey: {
    tag: "Report production",
    steps: [
      { k: "team", t: "Site visit & capture" },
      { k: "fos", t: "Drafted into your format" },
      { k: "fos", t: "Cross-checked" },
      { k: "qa", t: "Director sign-off" },
      { k: "team", t: "Issued to client" },
    ],
  },
  condition: {
    tag: "Estate condition survey",
    steps: [
      { k: "team", t: "Walk-round capture" },
      { k: "fos", t: "Scored to your scale" },
      { k: "fos", t: "Defects classified" },
      { k: "qa", t: "Director sign-off" },
      { k: "team", t: "Into estate report" },
    ],
  },
  tender: {
    tag: "Tender & bid",
    steps: [
      { k: "team", t: "Opportunity in" },
      { k: "fos", t: "Best past answers assembled" },
      { k: "fos", t: "Compliance-aligned" },
      { k: "qa", t: "Director tailoring & sign-off" },
      { k: "team", t: "Submitted" },
    ],
  },
  compliance: {
    tag: "Compliance check",
    steps: [
      { k: "team", t: "Document ready" },
      { k: "fos", t: "Checked vs CDM/BSA/RICS" },
      { k: "fos", t: "Gaps flagged" },
      { k: "qa", t: "Principal Designer decides" },
    ],
  },
  comms: {
    tag: "Project comms",
    steps: [
      { k: "team", t: "Update needed" },
      { k: "fos", t: "Drafted from project record" },
      { k: "qa", t: "Quick review & send" },
    ],
  },
  portfolio: {
    tag: "Portfolio insight",
    steps: [
      { k: "team", t: "Plain-English question" },
      { k: "fos", t: "Searched across all projects" },
      { k: "fos", t: "Sourced answer" },
      { k: "qa", t: "Director acts on it" },
    ],
  },
};
