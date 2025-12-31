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
  className?: string;
  name: string;
  rounded?: boolean;
  inputSize?: "md" | "lg";
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

interface IconInputProps extends Omit<BaseInputProps, "name"> {
  name: string;
  icon: React.ReactNode;
}
export function IconInput({ name, icon, ...props }: IconInputProps) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-4 size-5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        {icon}
      </div>
      <BaseInput name={name} {...props} className="pl-11" />
    </div>
  );
}
