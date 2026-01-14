"use client";

import { cn } from "@/lib/utils";

import { BaseInput } from "./inputs";

//스타일 상수
const STYLES = {
  CONTAINER: "space-y-2",
  INPUT_BASE: "bg-gray-0 body-medium",
  MESSAGE_BASE: "label-small ml-1",
} as const;

interface ValidationInputProps {
  message?: string;
  name: string;
  placeholder?: string;
  rounded?: boolean;
  inputSize?: "md" | "lg";
  className?: string;
}

export function ValidationInput({
  message = " ",
  name,
  placeholder,
  className,
  rounded,
  inputSize,
}: ValidationInputProps) {
  return (
    <div className={STYLES.CONTAINER}>
      <BaseInput
        name={name}
        rounded={rounded}
        inputSize={inputSize}
        className={STYLES.INPUT_BASE}
        placeholder={placeholder}
      />

      <p className={cn(STYLES.MESSAGE_BASE, className)}>{message || " "}</p>
    </div>
  );
}
