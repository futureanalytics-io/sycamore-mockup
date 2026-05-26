"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[color:var(--color-border)]">
      <SliderPrimitive.Range className="absolute h-full bg-[color:var(--color-sycamore)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-3.5 w-3.5 rounded-full border border-[color:var(--color-sycamore)] bg-white shadow focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sycamore)]/30 disabled:pointer-events-none" />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
