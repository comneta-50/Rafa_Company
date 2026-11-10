import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-[6px] px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]",
        analyzing: "bg-rose-50 text-rose-700 border border-rose-200",
        fixing: "bg-red-50 text-[#B91C1C] border border-red-200",
        testing: "bg-amber-50 text-amber-700 border border-amber-200",
        review: "bg-purple-50 text-purple-700 border border-purple-200",
        completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        failed: "bg-red-100 text-red-800 border border-red-300",
        secondary: "bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]",
        outline: "border border-[#E4E4E7] text-[#52525B] bg-transparent",
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
