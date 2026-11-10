import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[10px] border border-transparent font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#DC2626]/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-xs",
        secondary:
          "bg-white text-[#18181B] border-[#E4E4E7] hover:bg-[#FAFAFA] shadow-2xs",
        outline:
          "border-[#E4E4E7] bg-transparent text-[#18181B] hover:bg-[#F4F4F5] hover:border-[#D4D4D8]",
        ghost:
          "bg-transparent text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]",
        destructive:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
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
