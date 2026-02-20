"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { BaseButton } from "../shared/button";
import { BaseInput } from "../shared/inputs";

interface userExperienceProps {
  value: string[];
  label: string;
  placeholder: string;
  onChange: (items: string[]) => void;
  maxItems?: number;
}

export default function UserExperience({
  value = [],
  onChange,
  label,
  placeholder,
  maxItems = 3,
}: userExperienceProps) {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && value.length < maxItems) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeItem = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="body-medium text-gray-1000">{label}</label>

      {/* 1. 추가된 경험 리스트 */}
      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-100 rounded-[6px] group"
          >
            <span className="body-medium text-gray-500">{item}</span>
            <button
              onClick={() => removeItem(index)}
              className="text-gray-500 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* 2. 입력 창 (최대 개수 미달 시에만 노출) */}
      {value.length < maxItems && (
        <div className="relative">
          <BaseInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.slice(0, 200))}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder={placeholder}
            maxLength={200}
            viewLength
          />
        </div>
      )}

      {/* 3. 추가하기 버튼 */}
      <BaseButton
        type="button"
        onClick={addItem}
        disabled={!inputValue.trim() || value.length >= maxItems}
        className="disabled:!bg-gray-100 disabled:!text-gray-400 disabled:!cursor-not-allowed"
      >
        <Plus size={18} />
        <p className="label-medium">{label} 추가하기</p>
      </BaseButton>
    </div>
  );
}
