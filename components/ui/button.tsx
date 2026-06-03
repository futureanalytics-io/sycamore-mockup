"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[13px] font-semibold font-display transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sycamore)]/40 focus-visible:ring-offset-1 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[image:var(--gradient-brand)] bg-[length:140%_140%] bg-[position:0%_0%] text-white shadow-[0_2px_6px_-1px_rgba(35,95,112,0.45),0_6px_18px_-6px_rgba(31,182,214,0.5)] hover:bg-[position:100%_100%] hover:shadow-[0_3px_10px_-1px_rgba(35,95,112,0.5),0_10px_26px_-8px_rgba(31,182,214,0.6)] hover:-translate-y-px active:translate-y-0",
        outline:
          "border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] text-[color:var(--color-ink-strong)] hover:border-[color:var(--color-sycamore)]/50 hover:text-[color:var(--color-sycamore)] hover:bg-[color:var(--color-sycamore-tint)]",
        ghost:
          "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-cream-edge)] hover:text-[color:var(--color-ink-strong)]",
        soft:
          "bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-strong)] hover:bg-[color:var(--color-sycamore-tint)]",
        eggplant:
          "bg-[color:var(--color-eggplant)] text-white hover:opacity-90",
        destructive:
          "bg-[color:var(--color-accent-red)] text-white hover:bg-[color:var(--color-rag-red-stroke)]",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-7 px-3 text-[12px]",
        lg: "h-10 px-5 text-[14px]",
        xl: "h-11 px-6 text-[14px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
