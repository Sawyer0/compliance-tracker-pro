import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { theme, createStyles } from "@/lib/theme";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed", 
  {
  variants: {
    variant: {
      default: "bg-brand text-white hover:bg-brand-dark",
      destructive: "bg-rose-500 text-white hover:bg-rose-600",
      outline: "border border-gray-300 bg-white hover:bg-gray-50",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      ghost: "hover:bg-gray-100",
      link: "text-blue-500 underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4",
      sm: "h-8 px-3 text-xs",
      lg: "h-10 px-6",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
