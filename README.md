# FutureOS — proposal for Sycamore Square Group

A co-branded **FutureAnalytics × Sycamore Square Group** proposal website with a
**live, clickable product mockup embedded inside it**. One shareable link: the
proposal *is* the site, and the demo lives in the "Live demo" section.

Built with Next.js 15 (App Router) · React 19 · Tailwind v4 · Radix · Leaflet · Recharts · Zustand.

## Routes

| Route | What it is |
|-------|-----------|
| `/` | The proposal. Left sidebar of sections (Overview · The opportunity · What we propose · Live demo · How we work · Pricing · Next step). The demo section embeds the OS via an iframe with an "Open full screen" link. |
| `/app` | The standalone **Sycamore Square OS** mockup (full screen). Internal workspace (Home · SycKPI · SycFlow · **SycBid** · SycAI) + a Client-portal toggle (University of Bradford roof-asset portal). |

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (proposal)  ·  /app for the OS
npm run build    # production build
```

## Deploy (Vercel)

```bash
vercel           # or: push to a repo connected to Vercel
```

No environment variables are required. **Everything is mocked** — there are no
live data feeds, no API keys, and nothing leaves the browser. The OS demo runs
inside an iframe so it keeps its own viewport while embedded in the proposal.

> If you later wire real AI (e.g. into SycAI or SycBid drafting), proxy the
> Anthropic call through a Next.js API route so the key stays server-side, and
> read it from `ANTHROPIC_API_KEY` (never hardcode it in client code). The
> current build deliberately does **not** do this — the demo is scripted so it
> never breaks in front of a client.

## Structure

```
app/
  page.tsx              # the proposal (renders ProposalShell)
  app/page.tsx          # the standalone OS mockup
  layout.tsx, globals.css
components/
  proposal/             # the proposal wrapper
    proposal-shell.tsx  #   sidebar nav + header + section router + progress
    sections.tsx        #   all proposal sections (methodology rewritten here)
    brand.tsx           #   FutureAnalytics × SSG co-brand lockup
  sycbid.tsx            # SycBid — Bidding & Opportunity Engine (mock pipeline)
  sycflow / syckpi / sycai / home-page / portal-view / ...   # the OS modules
lib/
  bids-data.ts          # SycBid mock opportunities + scripted draft engine
  agents-data / kpi-data / buildings-seed / store / ...
```

## SycBid (mock only)

The Bidding & Opportunity Engine demonstrates the full flow on illustrative
data: scan sources (Contracts Finder / Find a Tender / CCS / Bloom / YORtender /
NHS) → opportunity board with a **% match score** → opportunity detail with the
match breakdown → **AI-drafted bid** → **comment → regenerate** loop (the
comments compose into a visible revision prompt) → **approve** → **auto-generate
& submit** the formatted proposal. All drafting is scripted in `lib/bids-data.ts`.
