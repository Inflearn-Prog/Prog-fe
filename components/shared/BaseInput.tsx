"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";

const INPUT_SIZE_CLASS_MAP: Record<
  NonNullable<BaseInputProps["inputSize"]>,
  string
> = {
  md: "text-15 h-10",
  lg: "text-17 h-12",
};

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string; // 추가 스타일 클래스
  name: string; // input의 name 속성 (필수)
  rounded?: boolean; // 둥근 테두리 여부
  inputSize?: "md" | "lg"; // 사이즈 옵션
}

export function BaseInput({
  className,
  name,
  rounded = false,
  inputSize = "md",
  ...props
}: BaseInputProps) {
  const isRound = rounded ? "rounded-full" : "rounded-md";

  return (
    <Input
      disabled={props.disabled}
      className={cn(
        "text-gray-700 px-4 focus: border-gray-100 bg-gray-50 transition-all",
        "hover:border-gray-200 focus:border-gray-700 disabled:text-frog-200 disabled:bg-gray-50 disabled:border-prog-200",
        `${isRound} ${INPUT_SIZE_CLASS_MAP[inputSize || "md"]}`,
        className
      )}
      {...props}
    />
  );
}
