"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  id,
  disabled,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer shrink-0 border-2 border-solid border-gray-50 dark:bg-input/30 data-[state=checked]:bg-frog-600 data-[state=checked]:text-gray-0 dark:data-[state=checked]:bg-frog-600 data-[state=checked]:border-frog-600 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-[22px] shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 data-[state=checked]:disabled:bg-gray-100 data-[state=checked]:disabled:border-frog-200 data-[state=checked]:disabled:text-frog-200",
        className
      )}
      id={id}
      disabled={disabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
