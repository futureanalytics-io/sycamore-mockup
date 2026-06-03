"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] shadow-[var(--shadow-sm)] transition-shadow duration-200 hover:shadow-[var(--shadow-md)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-b border-[color:var(--color-line)] px-5 py-4 flex items-center justify-between gap-3 rounded-t-xl bg-gradient-to-b from-[color:var(--color-sycamore-tint)]/60 to-transparent",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-display text-[14px] font-semibold text-[color:var(--color-ink-strong)]", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardSubtitle = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-[12px] text-[color:var(--color-ink-muted)] mt-0.5", className)} {...props} />
);

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const SectionTitle = ({
  children,
  eyebrow,
  trailing,
  className,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  trailing?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-end justify-between gap-4 mb-3", className)}>
    <div>
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1">
          {eyebrow}
        </div>
      )}
      <h2 className="brand-title text-[22px] leading-[1]">{children}</h2>
    </div>
    {trailing}
  </div>
);
