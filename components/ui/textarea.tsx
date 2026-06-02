"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] px-3 py-2.5 text-[13px] text-[color:var(--color-ink-strong)] placeholder:text-[color:var(--color-ink-faint)] focus:outline-none focus:border-[color:var(--color-sycamore)]/50 focus:ring-2 focus:ring-[color:var(--color-sycamore)]/15 transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
