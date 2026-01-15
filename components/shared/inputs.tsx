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

/**
 * BaseInput 컴포넌트는 공통 입력 필드의 스타일과 동작을 캡슐화한 컴포넌트입니다.
 *
 * @param className - 추가적으로 적용할 CSS 클래스명
 * @param name - input 요소의 name 속성
 * @param rounded - true일 경우 입력 필드의 모서리를 완전히 둥글게 처리 (기본값: false)
 * @param inputSize - 입력 필드의 크기 지정 ("md" | "lg", 기본값: "md")
 * @param props - 기타 Input 컴포넌트에 전달할 속성들
 */
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
        "text-gray-700 px-4 bg-gray-0 transition-all",
        "hover:text-gray-500 hover:border-gray-300",
        "focus:text-gray-700 focus:border-frog-300",
        "disabled:text-frog-100 disabled:bg-gray-0 disabled:border-frog-100",
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
    <div className="relative flex items-center">
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
