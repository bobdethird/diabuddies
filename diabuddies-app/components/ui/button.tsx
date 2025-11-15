import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-md",
        outline:
          "border-4 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        // New Duolingo-style 3D variants
        duoGreen: "bg-[#58CC02] text-white rounded-2xl border-0 shadow-[0_6px_0_0_#46A302] hover:shadow-[0_8px_0_0_#46A302] hover:-translate-y-[2px] active:shadow-[0_2px_0_0_#46A302] active:translate-y-[4px] relative",
        duoBlue: "bg-[#1CB0F6] text-white rounded-2xl border-0 shadow-[0_6px_0_0_#1899D6] hover:shadow-[0_8px_0_0_#1899D6] hover:-translate-y-[2px] active:shadow-[0_2px_0_0_#1899D6] active:translate-y-[4px] relative",
        superheroRed: "bg-[#FF4B4B] text-white rounded-2xl border-0 shadow-[0_6px_0_0_#D93A3A] hover:shadow-[0_8px_0_0_#D93A3A] hover:-translate-y-[2px] active:shadow-[0_2px_0_0_#D93A3A] active:translate-y-[4px] relative",
        goldenYellow: "bg-[#FFC800] text-[#3C3C3C] rounded-2xl border-0 shadow-[0_6px_0_0_#E6B400] hover:shadow-[0_8px_0_0_#E6B400] hover:-translate-y-[2px] active:shadow-[0_2px_0_0_#E6B400] active:translate-y-[4px] relative",
        purple: "bg-[#CE82FF] text-white rounded-2xl border-0 shadow-[0_6px_0_0_#B569E6] hover:shadow-[0_8px_0_0_#B569E6] hover:-translate-y-[2px] active:shadow-[0_2px_0_0_#B569E6] active:translate-y-[4px] relative",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-5",
        sm: "h-10 rounded-xl gap-1.5 px-4 py-2 has-[>svg]:px-3",
        lg: "h-14 rounded-2xl px-8 py-4 text-base has-[>svg]:px-6",
        icon: "size-12 rounded-xl",
        "icon-sm": "size-10 rounded-lg",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
