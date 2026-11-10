import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[6px] border border-transparent font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#881337]/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#881337] text-white hover:bg-[#5B0E23] shadow-xs",
        secondary:
          "bg-white text-[#1C1917] border-[#E7E5E4] hover:bg-[#FAF9F9] hover:border-[#D6D3D1] shadow-2xs",
        outline:
          "border-[#E7E5E4] bg-transparent text-[#1C1917] hover:bg-[#F5F5F6] hover:border-[#D6D3D1]",
        ghost:
          "bg-transparent text-[#78716C] hover:bg-[#F5F5F6] hover:text-[#1C1917]",
        destructive:
          "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
      },
      size: {
        /* Padding diperluas untuk ergonomi tombol yang lebih nyaman */
        default: "h-[40px] gap-2.5 px-5 text-[13px]",
        sm: "h-[34px] gap-2 px-3.5 text-xs",
        lg: "h-[46px] gap-3 px-6 text-sm font-semibold",
        icon: "size-[40px]",
        "icon-sm": "size-[34px]",
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
