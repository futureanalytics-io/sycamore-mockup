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
    className={cn("relative flex w-full touch-none select-none items-center h-5", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[5px] w-full grow overflow-hidden rounded-full bg-[color:var(--color-cream-edge)]">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[color:var(--color-sycamore)] to-[color:var(--color-sycamore-strong)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-[color:var(--color-sycamore)] bg-white shadow-[0_2px_4px_rgba(17,32,37,0.15)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sycamore)]/30 hover:scale-110 transition-transform disabled:pointer-events-none cursor-grab active:cursor-grabbing" />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
