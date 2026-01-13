"use client";

import Link from "next/link";
import { useId } from "react";

import { cn } from "@/lib/utils";

import { BaseCheckBox } from "../shared/checkbox";
import { Term } from "./types";

// 스타일 상수
const TERMS_STYLES = {
  GROUP_CONTAINER: "bg-gray-100 rounded-md px-6 py-2",
  ALL_CHECK_WRAPPER: "mb-4",
  ITEM_LIST_WRAPPER: "gap-2",
  SHOW_LINK: "text-frog-600 label-medium hover:underline",
} as const;

// 인터페이스
interface ProgTermsProps {
  terms: Term[];
  checks: Map<number, boolean>;
  isAllChecked: boolean;
  onAllCheck: (checked: boolean) => void;
  onSingleCheck: (id: number, checked: boolean) => void;
}

export function ProgTerms({
  terms,
  checks,
  isAllChecked,
  onAllCheck,
  onSingleCheck,
}: ProgTermsProps) {
  const baseId = useId();

  return (
    <div>
      <div
        className={cn(
          TERMS_STYLES.GROUP_CONTAINER,
          TERMS_STYLES.ALL_CHECK_WRAPPER
        )}
      >
        <CheckboxItem
          id={`${baseId}-all`}
          label="전체 동의하기"
          checked={isAllChecked}
          onChange={onAllCheck}
          showLink={false}
        />
      </div>

      <div
        className={cn(
          TERMS_STYLES.GROUP_CONTAINER,
          TERMS_STYLES.ITEM_LIST_WRAPPER
        )}
      >
        {terms.map((term) => (
          <CheckboxItem
            key={`${baseId}-${term.termId}`}
            id={`${baseId}-${term.termId}`}
            label={term.title}
            required={term.isRequired}
            checked={!!checks.get(term.termId)}
            onChange={(checked) => onSingleCheck(term.termId, checked)}
            link={term.link}
          />
        ))}
      </div>
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  showLink?: boolean;
  className?: string;
  link?: string;
}

const CheckboxItem = ({
  label,
  id,
  required,
  checked,
  onChange,
  showLink = true,
  className,
  link,
}: CheckboxItemProps) => (
  <div className={"flex items-center justify-between py-2"}>
    <BaseCheckBox
      id={id}
      label={`${required ? "(필수) " : ""}${label}`}
      checked={checked}
      onCheckedChange={onChange}
      className={className}
    />
    {showLink && link && (
      <Link
        href={link}
        className={TERMS_STYLES.SHOW_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} 상세 보기`}
      >
        보기
      </Link>
    )}
  </div>
);
