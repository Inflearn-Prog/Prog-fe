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
        disabled={disabled}
        className={cn(
          `w-full border-gray-50 text-gray-950 transition-300`,
          `hover:text-frog-600 hover:border-gray-300`,
          "disabled:text-frog-300 disabled:border-grot-100 disabled:data-placeholder:text-frog-300"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        className="p-0 rounded-[5px]"
        position="popper"
        sideOffset={4}
      >
        <SelectGroup>
          {selectOptions && selectOptions.length > 0 ? (
            selectOptions.map((option) => (
              <SelectItem
                disabled={disabled}
                className={cn(
                  "h-11.5 rounded-none transition-300",
                  "focus:text-frog-600 focus:bg-white",
                  "data-[state=checked]:bg-frog-100 data-[state=checked]:text-frog-600",
                  "data-disabled:text-frog-100"
                )}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem
              disabled={true}
              className={cn("disabled:text-frog-300")}
              value="noSearch"
            >
              선택 가능한 옵션이 없습니다.
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
