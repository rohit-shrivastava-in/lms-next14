import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backgroudvariants = cva(
  "rounded-full flex item-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-sky-100",
        success: "bg-emerald-100",
      },
      iconVariant: {
        default: "text-sky-700",
        success: "text-emerald-700"
      },
      size: {
        deafult: "p-2",
        sm: "p-1"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "deafult",
    }
  }
);

const iconVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "text-sky-700",
        success: "text-emerald-700"
      },
      size: {
        deafult: "h-8 w-8",
        sm: "h-4 w-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "deafult",
    }
  }
);

type BackgroudvariantsProps = VariantProps<typeof backgroudvariants>
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroudvariantsProps, IconVariantsProps {
  icon: LucideIcon;
}

export const IconBadge = ({
  icon: Icon,
  variant,
  size
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroudvariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  )
}