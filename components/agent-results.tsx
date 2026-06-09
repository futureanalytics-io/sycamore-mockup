"use client";

/*
 * Agent result renderers — the "what comes out" draft for each agent, as native
 * React in the portal's teal/Poppins system. One component per agent key.
 * Severity pills reuse the portal's RAG palette tokens.
 */
import type { AgentKey } from "@/lib/agents-data";
import { AlertTriangle, Check, Leaf } from "lucide-react";

const H5 = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-display text-[10.5px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-sycamore)] mt-3.5 first:mt-0 mb-1">
    {children}
  </h5>
);
const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[13px] text-[color:var(--color-ink)] mb-1 ${className}`}>{children}</p>
);

function Sev({ tone, children }: { tone: "red" | "amber" | "green"; children: React.ReactNode }) {
  const map = {
    red: "bg-[color:var(--color-rag-red)]/12 text-[color:var(--color-rag-red-stroke)]",
    amber: "bg-[color:var(--color-rag-amber)]/15 text-[color:var(--color-rag-amber-stroke)]",
    green: "bg-[color:var(--color-rag-green)]/15 text-[color:var(--color-rag-green-stroke)]",
  } as const;
  return (
    <span className={`inline-block font-display font-bold text-[10.5px] px-2 py-0.5 rounded-full whitespace-nowrap ${map[tone]}`}>
      {children}
    </span>
  );
}

function Src({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] text-[color:var(--color-sycamore-strong)] bg-[color:var(--color-sycamore-soft)] rounded-md px-2 py-0.5 mr-1 mt-1 font-medium">
      {children}
    </span>
  );
}

function Flag({ tone, title, sub }: { tone: "warn" | "ok"; title: string; sub: string }) {
  const Icon = tone === "warn" ? AlertTriangle : Check;
  const color = tone === "warn" ? "text-[color:var(--color-rag-red)]" : "text-[color:var(--color-accent-green)]";
  return (
    <div className="flex gap-2.5 items-start py-2 border-b border-dashed border-[color:var(--color-line)] last:border-0">
      <Icon className={`h-[18px] w-[18px] mt-0.5 shrink-0 ${color}`} />
      <div className="text-[12.5px]">
        <b className="block font-display text-[color:var(--color-ink-strong)]">{title}</b>
        <small className="text-[color:var(--color-ink-muted)]">{sub}</small>
      </div>
    </div>
  );
}

const Table = ({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) => (
  <table className="w-full border-collapse my-1">
    <thead>
      <tr>
        {head.map((h, i) => (
          <th
            key={i}
            className="text-left text-[12px] font-display font-semibold text-[color:var(--color-ink-soft)] bg-[color:var(--color-sycamore-tint)] px-2 py-1.5 border-b border-[color:var(--color-line)]"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>
          {r.map((c, j) => (
            <td key={j} className="text-[12.5px] px-2 py-1.5 border-b border-[color:var(--color-line)] align-top">
              {c}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export function AgentResult({ agent }: { agent: AgentKey }) {
  switch (agent) {
    case "survey":
      return (
        <>
          <H5>Property</H5>
          <P>Unit 4, 46 Park Place — ground-floor commercial unit, approx. 210 m² (scan-measured). Terminal dilapidations.</P>
          <H5>Schedule of dilapidations — breaches</H5>
          <Table
            head={["Item", "Breach / observation", "Remedy"]}
            rows={[
              ["Roof covering", "Felt covering, ponding to NE corner — disrepair", "Fall correction / localised renewal"],
              ["Windows (rear)", "Two units seized; not operable", "Overhaul or replace"],
              ["Store-room ceiling", "Damp staining — failed flashing above", "Trace & remedy flashing; redecorate"],
              ["Electrical", "Consumer unit 2009; no RCD on lighting", "Recommend EICR / upgrade"],
              ["Tenant alterations", "Partition + kitchenette not reinstated", "Reinstatement to original layout"],
            ]}
          />
          <H5>Linked evidence</H5>
          <P>14 site photos and site scan SSG-PP4-02 cross-referenced to each item above — every breach traceable back to source.</P>
        </>
      );
    case "condition":
      return (
        <>
          <H5>Block C — element condition schedule</H5>
          <Table
            head={["Element", "Grade", "Defect / note"]}
            rows={[
              ["Roof", <Sev key="r" tone="amber">B — fair</Sev>, "Slipped tiles; flashing lifting at parapet"],
              ["External walls", <Sev key="w" tone="amber">B — fair</Sev>, "Spalling to brick plinth, west elevation"],
              ["Windows", <Sev key="wi" tone="red">C — poor</Sev>, "Paint failure; 2 timber units rotten"],
              ["M&E — boiler", <Sev key="b" tone="red">C — poor</Sev>, "14 yrs; beyond economic life"],
              ["Internal finishes", <Sev key="i" tone="green">A — good</Sev>, "Serviceable; ceiling tiles stained (ingress)"],
            ]}
          />
          <H5>Priority defects</H5>
          <Flag tone="warn" title="Boiler — replacement, near-term" sub="Beyond economic life; risk to heating continuity." />
          <Flag tone="warn" title="Rotten window units — repair/replace" sub="Water ingress risk if left." />
          <H5>Sustainability note</H5>
          <div className="flex gap-2.5 items-start py-2">
            <Leaf className="h-[18px] w-[18px] mt-0.5 shrink-0 text-[color:var(--color-accent-green)]" />
            <div className="text-[12.5px]">
              <b className="block font-display text-[color:var(--color-ink-strong)]">Net-zero / retrofit line ready</b>
              <small className="text-[color:var(--color-ink-muted)]">
                Poor-grade elements (boiler, single-glazed units) flagged as retrofit-priority — feeds an embodied-carbon / net-zero reporting line for estate owners.
              </small>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-[color:var(--color-ink-muted)]">
            Grades applied consistently to your standard scale across every block in the estate survey.
          </p>
        </>
      );
    case "tender":
      return (
        <>
          <H5>Q3.1 — Relevant experience</H5>
          <P>
            Drafted from <Src>past win · occupied public estate</Src> <Src>CDM PD narrative</Src>. Tailored to the lot&apos;s occupied-estate requirement.
          </P>
          <H5>Q3.4 — Quality management</H5>
          <P>
            Populated from your accreditation evidence: <Src>ISO 9001</Src> <Src>ISO 14001</Src> <Src>ISO 45001</Src>.
          </P>
          <H5>Q4.2 — Fire compartmentation / BSA</H5>
          <P>
            Drafted from <Src>prior BSA Principal Designer response</Src>; aligned to current Building Safety Act duties.
          </P>
          <H5>Gaps flagged — needs your input</H5>
          <Flag tone="warn" title="Q5.1 Social value — no recent matching answer" sub="Carbon-neutral statement available to build on; needs a fresh project example." />
          <Flag tone="ok" title="All mandatory questions answered" sub="No blank responses — compliant to submit once Q5.1 is finalised." />
        </>
      );
    case "compliance":
      return (
        <>
          <H5>Document</H5>
          <P>Pre-construction information pack — occupied education block refurbishment.</P>
          <H5>Checked against</H5>
          <P>
            <Src>CDM 2015</Src> <Src>Building Safety Act 2022</Src> <Src>RICS standards</Src>
          </P>
          <H5>Findings</H5>
          <Flag tone="warn" title="No fire strategy section" sub="Occupied building works engage Building Safety Act duties — a fire strategy should be referenced in the PCI." />
          <Flag tone="warn" title="Asbestos register dated 2019" sub="Confirm a current refurbishment/demolition survey before intrusive works (CDM duty to provide pre-construction info)." />
          <Flag tone="warn" title="Principal Contractor not named" sub="Required where more than one contractor is involved (CDM 2015)." />
          <Flag tone="ok" title="Principal Designer appointed & recorded" sub="Meets CDM 2015 appointment duty." />
        </>
      );
    case "comms":
      return (
        <>
          <div className="flex gap-2.5 py-1 text-[13px] border-b border-dashed border-[color:var(--color-line)]">
            <b className="w-[120px] text-[color:var(--color-ink-soft)] font-display font-semibold">To</b>
            <span>Client Project Manager — Trust board pack</span>
          </div>
          <div className="flex gap-2.5 py-1 text-[13px] border-b border-dashed border-[color:var(--color-line)] mb-1">
            <b className="w-[120px] text-[color:var(--color-ink-soft)] font-display font-semibold">Subject</b>
            <span>Weekly progress update — health sector refurbishment</span>
          </div>
          <H5>Draft</H5>
          <P>Dear [name],</P>
          <P>Ahead of Friday&apos;s board, a short progress summary:</P>
          <P>
            • Roofing works are approximately 60% complete. A two-day weather delay earlier this week has been absorbed without affecting the overall programme.
            <br />• Replacement windows are confirmed for delivery on Monday.
            <br />• Variation VO-07 (additional flashing) has been priced and is with you for sign-off.
            <br />• The next site meeting is Thursday at 10:00.
            <br />• No health &amp; safety incidents to report this period.
          </P>
          <P>Happy to expand any point for the board. Kind regards, Sycamore Square Group.</P>
          <p className="text-[12px] text-[color:var(--color-ink-muted)] mt-2">
            Every figure above is pulled from this week&apos;s project log — nothing invented.
          </p>
        </>
      );
    case "portfolio":
      return (
        <>
          <H5>Answer</H5>
          <P>
            <b className="font-display">7 category-1 defects</b> were recorded across the education estate this year. <b className="font-display">3 remain open.</b>
          </P>
          <Table
            head={["Site", "Defect", "Status"]}
            rows={[
              ["Block C — Leeds", "Boiler beyond economic life", <Sev key="1" tone="red">Open</Sev>],
              ["Block C — Leeds", "Rotten window units", <Sev key="2" tone="red">Open</Sev>],
              ["Annexe — site 2", "Failed parapet flashing", <Sev key="3" tone="red">Open</Sev>],
              ["Main hall", "Spalling concrete soffit", <Sev key="4" tone="green">Closed</Sev>],
            ]}
          />
          <H5>Sources</H5>
          <P>
            <Src>Block C condition survey</Src> <Src>Annexe inspection</Src> <Src>Main hall report</Src> — click any source in the live platform to open the original.
          </P>
          <p className="mt-2 text-[12px] text-[color:var(--color-ink-muted)]">
            Ask in the same way across any theme — open RAAC findings, fire-compartmentation gaps, or retrofit-priority elements for a net-zero return.
          </p>
        </>
      );
  }
}
