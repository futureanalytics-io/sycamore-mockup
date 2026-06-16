"use client";

/*
 * Co-brand lockup for the proposal: FutureAnalytics × Sycamore Square Group.
 *
 * The FA mark is the real FutureAnalytics logo (from futureanalytics.io): three
 * rounded squares — two ink (#121417) on the bottom row, one emerald (#177E6B)
 * top-right — with the "Future" (bold ink) + "Analytics" (regular muted)
 * wordmark. Colours are hardcoded so the logo is always correct regardless of
 * the surrounding theme. SSG uses its real logo SVG from /public.
 */
import Image from "next/image";

/** FutureAnalytics mark — three rounded squares (real brand logo). */
export function FAMark({ className = "h-[18px] w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" className={className} aria-hidden role="img">
      <rect x="0" y="15" width="11" height="11" rx="2.5" fill="#121417" />
      <rect x="14" y="15" width="11" height="11" rx="2.5" fill="#121417" />
      <rect x="28" y="1" width="11" height="11" rx="2.5" fill="#177E6B" />
    </svg>
  );
}

export function FAWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <FAMark className={compact ? "h-4 w-auto" : "h-[18px] w-auto"} />
      <span className={`font-display tracking-[-0.01em] ${compact ? "text-[15px]" : "text-[17px]"}`}>
        <span className="font-bold text-[color:var(--color-ink-strong)]">Future</span>
        <span className="font-normal text-[color:var(--color-ink-muted)]">Analytics</span>
      </span>
    </span>
  );
}

/** The full FutureAnalytics × Sycamore Square Group lockup. */
export function CoBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 sm:gap-3.5">
      <FAWordmark compact={compact} />
      <span className={`text-[color:var(--color-ink-faint)] font-display ${compact ? "text-[14px]" : "text-[16px]"}`}>×</span>
      <Image
        src="/sycamore-logo.svg"
        alt="Sycamore Square Group"
        width={150}
        height={42}
        priority
        className={compact ? "h-6 w-auto" : "h-7 w-auto"}
      />
    </div>
  );
}
