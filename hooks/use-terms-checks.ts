import { useCallback, useState } from "react";

import { Term } from "@/components/terms/types";

export function useTermsChecks(terms: Term[]) {
  // 1. 초기 상태를 Map으로 설정
  const [checks, setChecks] = useState<Map<number, boolean>>(new Map());

  // 전체 동의 여부 계산 (UI에서 사용)
  const isAllChecked =
    terms.length > 0 && terms.every((t) => checks.get(t.termId) === true);

  // 전체 동의 핸들러
  const handleAllCheck = useCallback(() => {
    const nextValue = !isAllChecked;

    const nextMap = new Map();
    terms.forEach((term) => {
      nextMap.set(term.termId, nextValue);
    });

    setChecks(nextMap);
  }, [isAllChecked, terms]);

  // 개별 동의 핸들러
  const handleSingleCheck = useCallback((id: number) => {
    setChecks((prev) => {
      const next = new Map(prev);
      // 현재 값이 true면 false로, false나 undefined면 true로 토글
      next.set(id, !prev.get(id));
      return next;
    });
  }, []);

  // 필수 항목이 모두 체크되었는지 확인 (다음 버튼 활성화용)
  const isRequiredDone = terms
    .filter((t) => t.isRequired)
    .every((t) => checks.get(t.termId) === true);

  return {
    checks,
    isAllChecked,
    handleAllCheck,
    handleSingleCheck,
    isRequiredDone,
  };
}
