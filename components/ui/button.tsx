import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 ease-smooth disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        glassPrimary:
          "btn-glass-primary rounded-xl text-white shadow-none border-0 font-semibold tracking-tight focus-visible:ring-0",
        glassSecondary:
          "btn-glass-secondary rounded-xl border font-medium tracking-tight text-emerald-50/95 focus-visible:ring-0",
        /** Solid fills — high contrast on dark / green BGs (hero-style) */
        solidEmerald:
          "rounded-lg border-0 bg-emerald-600/95 font-semibold text-white shadow-md shadow-emerald-900/25 transition-colors duration-300 ease-smooth hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:shadow-lg sm:shadow-emerald-900/30",
        solidWhite:
          "rounded-lg border-0 bg-white/95 font-semibold text-emerald-700 shadow-sm shadow-black/15 transition-colors duration-300 ease-smooth hover:bg-white hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:shadow-md sm:shadow-black/20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "min-h-[2.5rem] h-auto px-5 py-2.5 text-sm has-[>svg]:px-5 sm:min-h-[2.75rem] sm:px-8 sm:py-3 sm:text-[15px] sm:has-[>svg]:px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
