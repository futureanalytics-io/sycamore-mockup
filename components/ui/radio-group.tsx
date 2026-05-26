"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

interface RagRadioItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  swatch: string;
  swatchStroke: string;
  label: string;
}

export const RagRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RagRadioItemProps
>(({ className, swatch, swatchStroke, label, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group flex items-center gap-2.5 rounded-md border border-[color:var(--color-border-strong)] bg-white px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--color-background)] data-[state=checked]:border-[color:var(--color-sycamore)]/40 data-[state=checked]:bg-[color:var(--color-sycamore-soft)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--color-sycamore)]/40",
      className
    )}
    {...props}
  >
    <span
      className="h-3.5 w-3.5 rounded-sm"
      style={{ backgroundColor: swatch, border: `1px solid ${swatchStroke}` }}
    />
    <span className="flex-1 text-[color:var(--color-foreground)]">{label}</span>
    <span className="h-3 w-3 rounded-full border border-[color:var(--color-border-strong)] bg-white group-data-[state=checked]:border-[color:var(--color-sycamore)] group-data-[state=checked]:bg-[color:var(--color-sycamore)] relative after:absolute after:inset-[3px] after:rounded-full after:bg-white after:opacity-0 group-data-[state=checked]:after:opacity-100" />
  </RadioGroupPrimitive.Item>
));
RagRadioItem.displayName = "RagRadioItem";
