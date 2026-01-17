"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";

const INPUT_SIZE_CLASS_MAP: Record<
  NonNullable<BaseInputProps["inputSize"]>,
  string
> = {
  md: "label-medium h-10",
  lg: "label-small h-12",
};

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  rounded?: boolean;
  inputSize?: "md" | "lg";
  viewLength?: boolean;
}

export function BaseInput({
  className,
  rounded = false,
  inputSize = "md",
  viewLength = false,
  ...props
}: BaseInputProps) {
  const isRound = rounded ? "rounded-full" : "rounded-md";
  return (
    <div className="relative">
      <Input
        disabled={props.disabled}
        className={cn(
          "text-gray-700 px-4 bg-gray-0 transition-all",
          "hover:text-gray-500 hover:border-gray-300",
          "focus:text-gray-700 focus:border-frog-300",
          "disabled:text-frog-100 disabled:bg-gray-0 disabled:border-frog-100",
          `${isRound} ${INPUT_SIZE_CLASS_MAP[inputSize || "md"]}`,
          className
        )}
        {...props}
      />
      {viewLength && (
        <LengthIndicator
          currentLength={props.value?.toString().length || 0}
          maxLength={props.maxLength || 0}
        />
      )}
    </div>
  );
}

interface LengthIndicatorProps extends Pick<BaseInputProps, "maxLength"> {
  currentLength: number;
}
function LengthIndicator({ currentLength, maxLength }: LengthIndicatorProps) {
  return (
    <div className="absolute bottom-1 right-3 text-gray-400 text-12">
      {currentLength} / {maxLength}
    </div>
  );
}
interface IconInputProps extends Omit<BaseInputProps, "name"> {
  name: string;
  icon: React.ReactNode;
}

/**
 * IconInput 컴포넌트는 입력 필드 왼쪽에 아이콘을 함께 표시하는 입력 컴포넌트입니다.
 *
 * @param name - input 요소의 name 속성
 * @param icon - 입력 필드 내부에 표시할 React 노드 형태의 아이콘
 * @param props - BaseInput 컴포넌트에 전달할 추가 속성들
 *
 * @remarks
 * 아이콘은 입력 필드 내부에 절대 위치로 배치되며, 입력 필드는 아이콘 공간만큼 왼쪽 패딩이 적용됩니다.
 */
export function IconInput({ name, icon, ...props }: IconInputProps) {
  return (
    <div className="group relative flex items-center">
      <div
        className={cn(
          "absolute left-4 size-5 top-1/2 -translate-y-1/2",
          "flex items-center justify-center pointer-events-none",
          "text-gray-500",
          "group-hover:text-gray-700",
          "group-focus-within:text-frog-600",
          props.disabled && "text-frog-100"
        )}
      >
        {icon}
      </div>
      <BaseInput name={name} {...props} className="pl-11" />
    </div>
  );
}
