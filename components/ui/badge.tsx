import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-700 text-zinc-50",
        secondary:
          "border-transparent bg-zinc-800 text-zinc-400",
        destructive:
          "border-transparent bg-red-900/80 text-zinc-50",
        success:
          "border-transparent bg-emerald-900/80 text-zinc-50",
        warning:
          "border-transparent bg-amber-900/80 text-zinc-50",
        outline: "text-zinc-400 border-zinc-700",
        draft: "border-transparent bg-zinc-700 text-zinc-400",
        submitted: "border-transparent bg-amber-900/80 text-amber-100",
        approved: "border-transparent bg-emerald-900/80 text-emerald-100",
        rejected: "border-transparent bg-red-900/80 text-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
