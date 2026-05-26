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
      "flex w-full rounded-md border border-[color:var(--color-border-strong)] bg-white px-3 py-2 text-[13px] text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-sycamore)]/40 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
