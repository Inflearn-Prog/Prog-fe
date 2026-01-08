"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BaseCheckBoxProps extends React.ComponentProps<typeof Checkbox> {
  label?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
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
      <Checkbox id={id} disabled={disabled} {...props} />
      {/* label이 있을 때만 렌더링 */}
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
}
