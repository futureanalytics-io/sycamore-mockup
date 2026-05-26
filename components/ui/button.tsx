"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--color-sycamore)]/40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--color-sycamore)] text-white hover:bg-[color:var(--color-sycamore-dark)]",
        outline:
          "border border-[color:var(--color-border-strong)] bg-white text-[color:var(--color-foreground)] hover:bg-[color:var(--color-background)]",
        ghost:
          "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-background)]",
        soft:
          "bg-[color:var(--color-sycamore-soft)] text-[color:var(--color-sycamore-dark)] hover:bg-[color:var(--color-sycamore-soft)]/70",
        destructive:
          "bg-[color:var(--color-rag-red)] text-white hover:bg-[color:var(--color-rag-red-stroke)]",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2.5 text-[12px]",
        lg: "h-9 px-4",
        icon: "h-8 w-8",
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
