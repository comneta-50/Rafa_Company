import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[10px] border border-transparent font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#16A34A]/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#16A34A] text-white hover:bg-[#15803D]",
        secondary:
          "bg-[#202522] text-white border-[#363D38] hover:bg-[#282F2A] hover:border-[#454B47]",
        outline:
          "border-[#454B47] bg-transparent text-white hover:bg-[#1C211D] hover:border-[#525B54]",
        ghost:
          "bg-transparent text-[#A1A1AA] hover:bg-[#1C211D] hover:text-white",
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
