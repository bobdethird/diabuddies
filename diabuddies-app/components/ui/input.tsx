import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border-4 border-[#E5E5E5] bg-white px-4 py-3 text-base font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.08)] transition-all file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-gray-400 placeholder:font-semibold focus-visible:border-[#1CB0F6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1CB0F6]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

