"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

//기본 Button
/**
 * @param className - 추가적으로 적용할 CSS 클래스명
 * @param variant - 버튼의 타입 (default| secondary | destructive | outline | ghost)
 * @param size - 버튼의 크기 (default | sm | lg | icon | icon-sm | icon-lg)
 * @param shape - 버튼의 모서리 둥글기 (default=rounded-md | round=rounded-full)
 * @param full - true일 경우 width 100% 적용 (기본값: false)
 */
export function BaseButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button className={cn(className)} {...props} />;
}
