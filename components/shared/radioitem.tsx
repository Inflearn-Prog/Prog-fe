"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface BaseRadioItemProps extends React.ComponentProps<
  typeof RadioGroupItem
> {
  label: string;
  className?: string;
  id: string;
  disabled?: boolean;
  value: string;
}

/**
+ * BaseRadioItem 컴포넌트
+ * 
+ * RadioGroupItem과 Label을 조합한 라디오 버튼 컴포넌트입니다.
+ * label prop이 제공되면 접근성을 위해 자동으로 연결됩니다.
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
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
