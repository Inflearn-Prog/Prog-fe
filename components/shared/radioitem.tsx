"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface BaseRadioItemProps extends React.ComponentProps<
  typeof RadioGroupItem
> {
  label?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  value: string;
}

/**
 * BaseRadioItem 컴포넌트 Props
 */

export function BaseRadioItem({
  className,
  label,
  id,
  disabled,
  value,
  ...props
}: BaseRadioItemProps) {
  return (
    <div className={cn("flex items-center space-x-2 py-1", className)}>
      <RadioGroupItem value={value} id={id} disabled={disabled} {...props} />
      {/* label이 있을 때만 렌더링 */}
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
}
