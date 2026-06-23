/*
 * /unipol — dedicated, co-branded client endpoint for Unipol.
 *
 * Sycamore Square Group is the delivery brand and owns the chrome (its teal +
 * logo, top-left); Unipol is the client, shown via its real wordmark badge.
 * The body is a faithful web replica of the Unipol fire-compartmentation Power
 * BI dashboard, plus survey-derived modules. Shareable as a single link.
 */
import Image from "next/image";
import { UnipolPortal } from "@/components/unipol/unipol-portal";

export const metadata = {
  title: "Unipol · Fire compartmentation portal — Sycamore Square Group",
  description:
    "Fire compartmentation remedial-works portal for Unipol's Leeds student-housing portfolio, delivered by Sycamore Square Group.",
};

export default function UnipolPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] flex flex-col">
      {/* Top bar — Sycamore (delivery) chrome + Unipol (client) badge */}
      <header className="h-[60px] sm:h-[68px] sticky top-0 z-[400] flex items-center gap-3 px-4 sm:px-6 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]/85 backdrop-blur-md">
        <div className="h-[3px] w-full absolute top-0 left-0" style={{ background: "var(--gradient-brand)" }} />

        <Image
          src="/sycamore-logo.svg"
          alt="Sycamore Square Group"
          width={172}
          height={48}
          priority
          className="h-7 sm:h-8 w-auto"
        />
        <div className="h-6 w-px bg-[color:var(--color-line-strong)] hidden sm:block" />
        <h1 className="font-display font-bold text-[14px] sm:text-[16px] text-[color:var(--color-ink-strong)] truncate">
          Fire compartmentation portal
        </h1>

        {/* Client badge */}
        <div className="hidden md:flex items-center gap-2.5 ml-3 bg-[color:var(--color-cream)] border border-[color:var(--color-line)] rounded-full pl-3 pr-3 py-1">
          <Image src="/unipol/unipol-logo.png" alt="Unipol" width={150} height={34} className="h-5 w-auto" />
          <div className="h-4 w-px bg-[color:var(--color-line-strong)]" />
          <span className="text-[11.5px] font-medium text-[color:var(--color-ink-soft)]">Student housing</span>
        </div>

        <div className="ml-auto hidden lg:flex items-center gap-2 text-[11px] text-[color:var(--color-ink-muted)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-green)]" />
          Survey complete · 2 buildings
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-5 lg:px-7 py-5 sm:py-6 w-full max-w-[1500px] mx-auto">
        <UnipolPortal />
      </main>
    </div>
  );
}
