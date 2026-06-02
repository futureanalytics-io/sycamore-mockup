"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[13px] font-medium font-display transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sycamore)]/40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--color-sycamore)] text-white hover:bg-[color:var(--color-sycamore-strong)] shadow-[0_1px_0_rgba(17,32,37,0.08),0_4px_12px_-4px_rgba(55,117,135,0.5)]",
        outline:
          "border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] text-[color:var(--color-ink-strong)] hover:border-[color:var(--color-sycamore)]/40 hover:text-[color:var(--color-sycamore)]",
        ghost:
          "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-cream)] hover:text-[color:var(--color-ink-strong)]",
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
