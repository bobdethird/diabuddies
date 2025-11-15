"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-[#E5E5E5] bg-white data-[state=checked]:bg-[#58CC02] data-[state=checked]:text-white data-[state=checked]:border-[#46A302] focus-visible:border-[#1CB0F6] focus-visible:ring-[#1CB0F6]/50 aria-invalid:ring-[#FF4B4B]/20 aria-invalid:border-[#FF4B4B] size-6 shrink-0 rounded-lg border-4 shadow-[0_3px_0_0_rgba(0,0,0,0.1)] transition-all outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-4 font-black stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
