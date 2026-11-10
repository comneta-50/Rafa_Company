import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[10px] border border-transparent font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] text-white hover:bg-[#1E40AF]",
        secondary:
          "bg-[#1F2937] text-white border-[#2E384D] hover:bg-[#263346] hover:border-[#3B4761]",
        outline:
          "border-[#2E384D] bg-transparent text-white hover:bg-[#1E293B] hover:border-[#3B4761]",
        ghost:
          "bg-transparent text-[#94A3B8] hover:bg-[#1E293B] hover:text-white",
        destructive:
          "bg-red-950/40 text-red-400 border border-red-800/50 hover:bg-red-900/40",
      },
      size: {
        default: "h-[38px] gap-2 px-4 text-[13px]",
        sm: "h-[32px] gap-1.5 px-3 text-xs",
        lg: "h-[44px] gap-2 px-5 text-sm",
        icon: "size-[38px]",
        "icon-sm": "size-[32px]",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
