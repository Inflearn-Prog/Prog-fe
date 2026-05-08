// date-fns 라이브러리: https://date-fns.org/
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

/**
 * 주어진 날짜 문자열을 현재 시각 기준으로
 * "N분 전", "N시간 전", "N일 전" 형태로 반환하는 유틸 함수
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2026-02-28T10:00:00Z")
 * @returns 상대 시간 문자열 (예: "5분 전", "2시간 전", "3일 전")
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const now = new Date();
    const target = new Date(dateString);

    const diffMinutes = differenceInMinutes(now, target);
    const diffHours = differenceInHours(now, target);
    const diffDays = differenceInDays(now, target);

    // 1시간 미만: N분 전
    if (diffMinutes < 60) {
      return diffMinutes <= 0 ? "방금 전" : `${diffMinutes}분 전`;
    }

    // 24시간 미만: N시간 전
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }

    // 24시간 이상: N일 전
    return `${diffDays}일 전`;
  } catch (error) {
    // 날짜 파싱 오류 처리
    console.error("날짜 변환 중 오류 발생:", error);
    return "날짜 오류";
  }
}
