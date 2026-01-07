"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BaseCheckBoxProps extends React.ComponentProps<typeof Checkbox> {
  label?: string;
}

/**
 * BaseCheckBox 컴포넌트 Props
 */

export function BaseCheckBox({
  className,
  label,
  id,
  disabled,
  ...props
}: BaseCheckBoxProps) {
  return (
    <div className={cn("flex items-center space-x-2 py-1", className)}>
      <Checkbox
        className={cn(className)}
        id={id}
        disabled={disabled}
        {...props}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
