import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-[6px] px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]",
        analyzing: "bg-sky-50 text-sky-700 border border-sky-200",
        fixing: "bg-blue-50 text-[#1E40AF] border border-blue-200",
        testing: "bg-amber-50 text-amber-700 border border-amber-200",
        review: "bg-purple-50 text-purple-700 border border-purple-200",
        completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        failed: "bg-red-50 text-red-700 border border-red-200",
        secondary: "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]",
        outline: "border border-[#E5E7EB] text-[#4B5563] bg-transparent",
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
