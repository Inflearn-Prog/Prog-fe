"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

//스타일 상수
const STYLES = {
  CONTAINER: "min-h-6",
  INPUT_BASE: "bg-gray-0 body-medium",
  MESSAGE_BASE: "label-small ml-1",
  TYPE: {
    default: "text-gray-600",
    success: "text-success",
    error: "text-error",
    warning: "text-warning",
  },
} as const;

interface ValidationMessageProps {
  message?: string;
  messageType?: keyof typeof STYLES.TYPE;
  className?: string;
  name?: string;
}

export function ValidationMessage({
  message,
  className,
  name,
  messageType = "default",
  ...props
}: ValidationMessageProps) {
  const baseId = useId();
  const messageId = `${name || baseId}-message`;
  const isError = messageType === "error";

  let messageColor: string;
  switch (messageType) {
    case "success":
      messageColor = STYLES.TYPE.success;
      break;
    case "error":
      messageColor = STYLES.TYPE.error;
      break;
    case "warning":
      messageColor = STYLES.TYPE.warning;
      break;
    default:
      messageColor = STYLES.TYPE.default;
  }

  return (
    <div className={cn(STYLES.CONTAINER, className)}>
      {message && (
        <p
          className={cn(STYLES.MESSAGE_BASE, messageColor)}
          id={messageId}
          role={isError ? "alert" : "status"}
          aria-live="polite"
          {...props}
        >
          {message}
        </p>
      )}
    </div>
  );
}
