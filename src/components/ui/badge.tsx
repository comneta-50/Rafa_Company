import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-[6px] px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40",
        analyzing: "bg-sky-950/40 text-sky-400 border border-sky-800/50",
        fixing: "bg-[#1E40AF]/40 text-[#93C5FD] border border-[#2563EB]/50",
        testing: "bg-amber-950/40 text-amber-400 border border-amber-800/50",
        review: "bg-indigo-950/40 text-indigo-300 border border-indigo-800/50",
        completed: "bg-emerald-950/40 text-emerald-400 border border-emerald-800/50",
        failed: "bg-red-950/40 text-red-400 border border-red-800/50",
        secondary: "bg-[#1F2937] text-[#94A3B8] border border-[#2E384D]",
        outline: "border border-[#2E384D] text-[#94A3B8] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
