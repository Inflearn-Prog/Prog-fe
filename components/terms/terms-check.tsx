"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { BaseCheckBox } from "../shared/checkbox";
import { Term } from "./types";

// 스타일 상수
const TERMS_STYLES = {
  GROUP_CONTAINER: "bg-gray-100 rounded-md px-6 py-2",
  ALL_CHECK_WRAPPER: "mb-4",
  ITEM_LIST_WRAPPER: "gap-2",
  SHOW_LINK: "text-frog-600 text-[17px] hover:underline",
} as const;

// 인터페이스
interface ProgTermsProps {
  terms: Term[]; // API에서 받은 배열
  checks: Map<number, boolean>; // { 1: true, 2: false } 형태
  onAllCheck: () => void;
  onSingleCheck: (id: number) => void;
}

export function ProgTerms({
  terms,
  checks,
  onAllCheck,
  onSingleCheck,
}: ProgTermsProps) {
  // 모든 항목이 체크되었는지 계산 (전체 동의 UI 상태용)
  const isAllChecked =
    terms.length > 0 && terms.every((t) => checks.get(t.termId));

  return (
    <>
      {/* 전체 동의 섹션 */}
      <div
        className={cn(
          TERMS_STYLES.GROUP_CONTAINER,
          TERMS_STYLES.ALL_CHECK_WRAPPER
        )}
      >
        <CheckboxItem
          id="all-check"
          label="전체 동의하기"
          checked={isAllChecked}
          onChange={onAllCheck}
          showLink={false}
        />
      </div>

      {/* API 데이터 기반 동적 리스트 */}
      <div
        className={cn(
          TERMS_STYLES.GROUP_CONTAINER,
          TERMS_STYLES.ITEM_LIST_WRAPPER
        )}
      >
        {terms.map((term) => (
          <CheckboxItem
            key={term.termId}
            id={String(term.termId)}
            label={term.title}
            required={term.isRequired}
            checked={!!checks.get(term.termId)} // undefined 방지
            onChange={() => onSingleCheck(term.termId)}
            link={term.link}
          />
        ))}
      </div>
    </>
  );
}

interface CheckboxItemProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: () => void;
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
  <div className={cn("flex items-center justify-between py-2", className)}>
    <BaseCheckBox
      label={`${required ? "(필수) " : ""}${label}`}
      id={id}
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
