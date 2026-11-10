import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-[6px] px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40",
        analyzing: "bg-blue-950/40 text-blue-400 border border-blue-800/50",
        fixing: "bg-emerald-950/50 text-[#4ADE80] border border-[#16A34A]/50",
        testing: "bg-amber-950/40 text-amber-400 border border-amber-800/50",
        review: "bg-purple-950/40 text-purple-400 border border-purple-800/50",
        completed: "bg-[#14532D]/40 text-[#4ADE80] border border-[#16A34A]/50",
        failed: "bg-red-950/40 text-red-400 border border-red-800/50",
        secondary: "bg-[#202522] text-[#A1A1AA] border border-[#292D2A]",
        outline: "border border-[#292D2A] text-[#A1A1AA] bg-transparent",
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
