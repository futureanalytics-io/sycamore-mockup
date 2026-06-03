"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // On phones the 5 tabs exceed the viewport, so allow horizontal scroll
      // (with hidden scrollbar) instead of wrapping/overflowing.
      "flex items-center gap-1 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-cream-edge)]/60 p-1 my-2.5 shadow-[inset_0_1px_2px_rgba(20,36,43,0.05)] max-w-full overflow-x-auto no-scrollbar sm:inline-flex",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 sm:px-4 text-[13px] font-body font-medium text-[color:var(--color-ink-muted)] transition-all duration-200 hover:text-[color:var(--color-ink-strong)] focus:outline-none data-[state=active]:bg-gradient-to-b data-[state=active]:from-white data-[state=active]:to-[color:var(--color-sycamore-tint)] data-[state=active]:text-[color:var(--color-sycamore-strong)] data-[state=active]:font-bold data-[state=active]:shadow-[0_1px_3px_rgba(20,36,43,0.12),0_3px_10px_-3px_rgba(47,125,146,0.30)] data-[state=active]:ring-1 data-[state=active]:ring-[color:var(--color-sycamore)]/15",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus:outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
