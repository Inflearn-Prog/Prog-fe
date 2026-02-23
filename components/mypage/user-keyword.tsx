"use client";

import { X } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface KeywordInputProps {
  value: string[];
  label: string;
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function UserKeyword({
  value = [],
  label,
  onChange,
  placeholder = "키워드",
  maxTags = 5, //TODO: 최대 몇개까지인지 (추후 정해지는대로 수정)
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocus, setIsFocus] = useState(false); // 클릭 여부 상태
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(60);

  // 글자 길이에 따라 인풋 너비 조절
  useEffect(() => {
    if (spanRef.current) {
      // 텍스트가 있을 때는 텍스트 길이만큼, 없을 때는 placeholder 길이만큼
      const measuredWidth = spanRef.current.offsetWidth;
      setInputWidth(Math.max(60, measuredWidth + 36));
    }
  }, [inputValue, isFocus]);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="body-medium text-gray-1000">{label}</p>

      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-4 min-h-[52px] w-full",
          "bg-gray-50 border border-gray-100 rounded-[6px] transition-all cursor-text"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* 1. 확정된 태그 리스트 */}
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-3 px-4 py-1.5 bg-gray-0 border border-gray-100 rounded-full label-medium text-gray-700"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((_, i) => i !== index));
              }}
              className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={14} className="text-gray-700" />
            </button>
          </span>
        ))}

        {/* 2. 입력 중인 태그 */}
        {value.length < maxTags && (
          <div
            className={cn(
              "relative flex items-center transition-all duration-200 px-4 py-1.5",
              isFocus && "bg-gray-0 border border-gray-100 rounded-full"
            )}
            style={{ width: isFocus ? inputWidth : "auto" }}
          >
            {/* 너비 계산용 (화면엔 안 보임) */}
            <span
              ref={spanRef}
              className="absolute invisible whitespace-pre label-medium"
            >
              {inputValue || (isFocus ? "" : placeholder)}
            </span>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onFocus={() => setIsFocus(true)}
              onBlur={(e) => {
                if (
                  !e.currentTarget
                    .closest(".flex-wrap")
                    ?.contains(e.relatedTarget as Node)
                ) {
                  addTag();
                }
                setIsFocus(false);
              }}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!isFocus && value.length === 0 ? placeholder : ""}
              className={cn(
                "w-full bg-transparent outline-none label-medium text-gray-700",
                "placeholder:text-gray-400"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
