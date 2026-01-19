"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

import { BaseInput } from "./inputs";

//스타일 상수
const STYLES = {
  CONTAINER: "space-y-2",
  INPUT_BASE: "bg-gray-0 body-medium",
  MESSAGE_BASE: "label-small ml-1",
  TYPE: {
    default: "text-gray-600",
    success: "text-[#04B014]",
    error: "text-red-500",
  },
} as const;

interface ValidationInputProps extends React.ComponentProps<typeof BaseInput> {
  message?: string;
  messageType?: "default" | "success" | "error";
}

const getMessageColor = (type: string) => {
  switch (type) {
    case "success":
      return STYLES.TYPE.success;
    case "error":
      return STYLES.TYPE.error;
    default:
      return STYLES.TYPE.default;
  }
};

export function ValidationInput({
  message = " ",
  name,
  placeholder,
  rounded,
  className,
  inputSize,
  messageType = "default",
  ...props
}: ValidationInputProps) {
  const baseId = useId();
  const messageId = `${name || baseId}-message`;
  const isError = messageType === "error";

  const messageColor = getMessageColor(messageType);
  return (
    <div className={cn(STYLES.CONTAINER, className)}>
      <BaseInput
        name={name}
        rounded={rounded}
        inputSize={inputSize}
        className={STYLES.INPUT_BASE}
        placeholder={placeholder}
        {...props}
        aria-invalid={isError}
        aria-describedby={message ? messageId : undefined}
      />

      <p
        className={cn(STYLES.MESSAGE_BASE, messageColor)}
        id={messageId}
        role={isError ? "alert" : "status"}
        aria-live="polite"
      >
        {message || " "}
      </p>
    </div>
  );
}
