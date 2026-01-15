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

export interface SelectBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  selectOptions: SelectOption[];
  name?: string;
  placeholder?: string;
}

const TRIGGER_STYLES = cn(
  "w-full text-gray-950 transition-300",
  "border-gray-50",
  "hover:text-frog-600 hover:border-gray-300",
  "disabled:text-frog-300 disabled:border-grot-100",
  "disabled:data-[placeholder]:text-frog-300"
);

const CONTENT_STYLES = cn("p-0 rounded-[5px]");

const ITEM_STYLES = cn(
  "h-11.5 rounded-none transition-300",
  "focus:text-frog-600 focus:bg-white",
  "data-[state=checked]:bg-frog-100 data-[state=checked]:text-frog-600",
  "data-[disabled]:text-frog-100"
);

const EMPTY_ITEM_STYLES = cn("disabled:text-frog-300");

export function SelectBox({
  value,
  onValueChange,
  disabled = false,
  required = false,
  selectOptions,
  name,
  placeholder = "Select an option",
}: SelectBoxProps) {
  const hasOptions = selectOptions.length > 0;

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      <SelectTrigger disabled={disabled} size="lg" className={TRIGGER_STYLES}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={4}
        className={CONTENT_STYLES}
      >
        <SelectGroup>
          {hasOptions ? (
            selectOptions.map((option) => (
              <SelectItem
                disabled={disabled}
                key={option.value}
                value={option.value}
                className={ITEM_STYLES}
              >
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="noSearch" disabled className={EMPTY_ITEM_STYLES}>
              선택 가능한 옵션이 없습니다.
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
