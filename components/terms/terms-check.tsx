"use client";

import Link from "next/link";
import { useId } from "react";

import { cn } from "@/lib/utils";

import { BaseCheckBox } from "../shared/checkbox";
import { Term } from "./types";

// 스타일 상수
const TERMS_STYLES = {
  GROUP_CONTAINER: "bg-gray-100 rounded-md px-3 md:px-4 py-2 md:py-3",
  ALL_CHECK_WRAPPER: "mb-3 md:mb-4",
  ITEM_LIST_WRAPPER: "flex flex-col gap-0.5 md:gap-1",
  ITEM_WRAPPER: "flex items-center justify-between py-2.5 md:py-3",
  SHOW_LINK:
    "text-frog-600 label-small md:label-medium hover:underline shrink-0 ml-2",
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
            showLink={term.hasDetails}
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
  link?: string | null;
}

const CheckboxItem = ({
  label,
  id,
  required,
  checked,
  onChange,
  showLink = true,
  link,
}: CheckboxItemProps) => (
  <div
    className={cn(
      TERMS_STYLES.ITEM_WRAPPER,
      "flex items-start justify-between w-full gap-2"
    )}
  >
    <div className="flex-1 min-w-0">
      <BaseCheckBox
        id={id}
        label={`${required === true ? "(필수) " : required === false ? "(선택) " : ""}${label}`}
        checked={checked}
        onCheckedChange={onChange}
        className="body-small md:body-medium break-keep"
      />
    </div>
    {showLink && link && (
      <Link
        href={link}
        className={cn(TERMS_STYLES.SHOW_LINK, "whitespace-nowrap pt-1")}
        target="_blank"
        rel="noopener noreferrer"
      >
        보기
      </Link>
    )}
  </div>
);
