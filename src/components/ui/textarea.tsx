import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-[6px] border border-[#E7E5E4] bg-[#FAF9F9] px-3.5 py-2.5 text-xs text-[#1C1917] transition-colors outline-none placeholder:text-[#A8A29E] focus-visible:border-[#881337] focus-visible:ring-2 focus-visible:ring-[#881337]/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
