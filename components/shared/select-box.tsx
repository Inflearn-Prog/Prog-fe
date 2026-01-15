"use client";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

export function SelectBox({
  value,
  onValueChange,
  disabled = false,
  required = false,
  selectOptions,
  name,
  placeholder = "Select an option",
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  selectOptions: SelectOption[];
  name?: string;
  placeholder?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      <SelectTrigger
        size="lg"
        className={cn(
          `w-full border-gray-50 text-gray-950 transition-300`,
          `hover:text-frog-600 hover:border-gray-300`,
          ""
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4}>
        <SelectGroup>
          {selectOptions && selectOptions.length > 0 ? (
            selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              선택 가능한 항목이 없습니다
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
