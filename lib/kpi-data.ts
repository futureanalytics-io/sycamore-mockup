/*
 * SycKPI data — Sycamore Square Group's metrics catalogue. Built around a
 * building-surveying & construction consultancy: report delivery, framework
 * bids, compliance, the 1-hour comms SLA, and fee-earner capacity. All figures
 * are illustrative for the demo (no pricing/ROI; no other client's identity).
 *
 * Owners are Sycamore's named team (from the brief): Debbie Lewis, Will
 * Roberts, Mark Whitley, Chris Beddis, Mohammed Parvez.
 */

export type KpiArea = "Delivery" | "Bids" | "Compliance" | "Comms" | "Capacity";
export const KPI_AREAS: KpiArea[] = ["Delivery", "Bids", "Compliance", "Comms", "Capacity"];

export type Trend = "up" | "down" | "flat";
/** "good" = this movement is positive for the business, "bad" = negative. */
export type Sentiment = "good" | "bad" | "neutral";

export interface Kpi {
  name: string;
  area: KpiArea;
  definition: string;
  owner: string;          // full name
  ownerInitials: string;
  value: string;          // formatted latest value
  unit?: string;
  trend: Trend;
  change: string;         // e.g. "-18%" or "+4 pts"
  sentiment: Sentiment;
  ytd: string;            // year-to-date change
  mtd: string;            // month-to-date change
  updated: string;        // human date (static — demo)
  featured?: boolean;     // shows in the top card row
}

export const KPIS: Kpi[] = [
  // ---- Delivery (report production — their core revenue bottleneck) ----
  {
    name: "Avg. report turnaround",
    area: "Delivery",
    definition: "Working days from site visit to client-issued report, across all survey types.",
    owner: "Will Roberts", ownerInitials: "WR",
    value: "3.2", unit: "days",
    trend: "down", change: "-41%", sentiment: "good",
    ytd: "-41%", mtd: "-6%", updated: "9 Jun 2026", featured: true,
  },
  {
    name: "Reports issued",
    area: "Delivery",
    definition: "Client-ready reports issued this month across all live commissions.",
    owner: "Will Roberts", ownerInitials: "WR",
    value: "38", unit: "this mo.",
    trend: "up", change: "+27%", sentiment: "good",
    ytd: "+22%", mtd: "+27%", updated: "9 Jun 2026", featured: true,
  },
  {
    name: "Director QA time / report",
    area: "Delivery",
    definition: "Average director review time per report before sign-off.",
    owner: "Debbie Lewis", ownerInitials: "DL",
    value: "24", unit: "min",
    trend: "down", change: "-55%", sentiment: "good",
    ytd: "-55%", mtd: "-9%", updated: "9 Jun 2026",
  },
  {
    name: "Draft-to-issue rework",
    area: "Delivery",
    definition: "Share of reports needing a second review cycle before issue.",
    owner: "Mark Whitley", ownerInitials: "MW",
    value: "11%",
    trend: "down", change: "-19 pts", sentiment: "good",
    ytd: "-19 pts", mtd: "-3 pts", updated: "8 Jun 2026",
  },

  // ---- Bids (public-sector framework work) ----
  {
    name: "Framework bid win rate",
    area: "Bids",
    definition: "Share of submitted framework/PQQ bids won, rolling 12 months.",
    owner: "Debbie Lewis", ownerInitials: "DL",
    value: "47%",
    trend: "up", change: "+12 pts", sentiment: "good",
    ytd: "+12 pts", mtd: "+2 pts", updated: "6 Jun 2026", featured: true,
  },
  {
    name: "Avg. bid turnaround",
    area: "Bids",
    definition: "Working days to assemble a compliant framework response.",
    owner: "Will Roberts", ownerInitials: "WR",
    value: "1.5", unit: "days",
    trend: "down", change: "-58%", sentiment: "good",
    ytd: "-58%", mtd: "-11%", updated: "6 Jun 2026",
  },
  {
    name: "Bids in progress",
    area: "Bids",
    definition: "Open framework/tender opportunities being responded to.",
    owner: "Debbie Lewis", ownerInitials: "DL",
    value: "3",
    trend: "up", change: "+1", sentiment: "neutral",
    ytd: "+1", mtd: "+1", updated: "9 Jun 2026",
  },

  // ---- Compliance (CDM / BSA / RICS) ----
  {
    name: "Compliance gaps caught pre-issue",
    area: "Compliance",
    definition: "Gaps flagged against CDM/BSA/RICS before documents are signed off.",
    owner: "Mark Whitley", ownerInitials: "MW",
    value: "29",
    trend: "up", change: "+14", sentiment: "good",
    ytd: "+14", mtd: "+5", updated: "7 Jun 2026", featured: true,
  },
  {
    name: "Open compliance actions",
    area: "Compliance",
    definition: "Flagged obligations awaiting a Principal Designer decision.",
    owner: "Mark Whitley", ownerInitials: "MW",
    value: "2",
    trend: "down", change: "-3", sentiment: "good",
    ytd: "-3", mtd: "-3", updated: "9 Jun 2026",
  },
  {
    name: "Docs checked vs standards",
    area: "Compliance",
    definition: "Documents run through a CDM/BSA/RICS check this month.",
    owner: "Chris Beddis", ownerInitials: "CB",
    value: "41",
    trend: "up", change: "+33%", sentiment: "good",
    ytd: "+28%", mtd: "+33%", updated: "7 Jun 2026",
  },

  // ---- Comms (their marketed 1-hour response promise) ----
  {
    name: "Within-1-hour responses",
    area: "Comms",
    definition: "Share of stakeholder correspondence answered within one hour.",
    owner: "Debbie Lewis", ownerInitials: "DL",
    value: "94%",
    trend: "up", change: "+6 pts", sentiment: "good",
    ytd: "+6 pts", mtd: "+1 pt", updated: "9 Jun 2026",
  },
  {
    name: "Updates drafted from project data",
    area: "Comms",
    definition: "Stakeholder updates and reports auto-drafted this month.",
    owner: "Mohammed Parvez", ownerInitials: "MP",
    value: "62",
    trend: "up", change: "+48%", sentiment: "good",
    ytd: "+40%", mtd: "+48%", updated: "8 Jun 2026",
  },

  // ---- Capacity (fee-earner utilisation; ~5-person team) ----
  {
    name: "Fee-earner admin time",
    area: "Capacity",
    definition: "Share of fee-earner hours spent on admin & write-up (vs billable expert work).",
    owner: "Will Roberts", ownerInitials: "WR",
    value: "21%",
    trend: "down", change: "-17 pts", sentiment: "good",
    ytd: "-17 pts", mtd: "-2 pts", updated: "8 Jun 2026",
  },
  {
    name: "Live commissions / fee earner",
    area: "Capacity",
    definition: "Concurrent commissions handled per fee earner without backlog.",
    owner: "Debbie Lewis", ownerInitials: "DL",
    value: "4.6",
    trend: "up", change: "+0.8", sentiment: "good",
    ytd: "+0.8", mtd: "+0.2", updated: "8 Jun 2026",
  },
];
