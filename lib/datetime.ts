// date-fns 라이브러리: https://date-fns.org/
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

/**
 * 서버 날짜 문자열의 "와이어 포맷"을 아는 이 프로젝트의 유일한 지점.
 *
 * 현재 BE 는 오프셋 없는 LocalDateTime 을 내려준다(예: "2026-08-05T07:02:28").
 * 서버 JVM 이 UTC 라서(2026-08-05 실측: Docker 에 TZ 미지정 → temurin 기본 UTC)
 * 저장된 숫자가 곧 UTC 벽시계이므로, 오프셋이 없는 문자열은 UTC 로 간주한다.
 * 오프셋 없는 문자열을 브라우저가 로컬로 해석하면 한국에서 9시간 밀린다.
 *
 * ── BE 포맷이 바뀌면 여기(parseServerDate)만 고친다 ──
 *  - "...Z" / "...+09:00" : 이미 오프셋이 있어 그대로 파싱됨. 변경 불필요.
 *  - epoch millis(number) : `typeof raw === "number"` 분기 하나 추가.
 *  - 오프셋 없이 서버만 KST 로 이동: 아래 폴백 접미사 "Z" → "+09:00" 로 교체(한 곳).
 * 호출부·표시 함수·테스트는 어느 경우에도 바뀌지 않는다. 그게 이 구조의 목적이다.
 */
const HAS_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/;

export function parseServerDate(raw: string | null | undefined): Date | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;

  // 오프셋이 없으면 UTC 로 간주한다(위 주석 참조).
  const normalized = HAS_OFFSET.test(trimmed) ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 값이 없거나 파싱 실패 시의 표시. 현재시각으로 지어내지 않는다 — 깨진 데이터는 드러나야 한다. */
const PLACEHOLDER = "—";

/**
 * 표시 시간대는 한국 서비스 기준 Asia/Seoul 로 고정한다.
 * getFullYear()/getHours() 같은 로컬 게터를 쓰지 않는 이유: 그게 브라우저 시간대에
 * 의존하는 지점이라, Vercel 런타임(UTC)과 사용자 브라우저(KST)가 다른 글자를 낸다.
 */
const ABSOLUTE_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function toDate(value: string | Date | null | undefined): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  return parseServerDate(value);
}

/** 절대 표기 "26.08.05 16:02" (Asia/Seoul 고정). 입력이 없거나 깨지면 "—". */
export function formatAbsolute(
  value: string | Date | null | undefined
): string {
  const date = toDate(value);
  if (!date) return PLACEHOLDER;

  // ko-KR 은 "26. 08. 05. 16:02" 형태를 내므로, 서비스 표기 "26.08.05 16:02" 로 재조립한다.
  const parts = ABSOLUTE_FORMATTER.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")} ${get("hour")}:${get("minute")}`;
}

/** 상대 표기 "방금 전"/"N분 전"/"N시간 전"/"N일 전". 입력이 없거나 깨지면 "—". */
export function formatRelative(
  value: string | Date | null | undefined
): string {
  const date = toDate(value);
  if (!date) return PLACEHOLDER;

  const now = new Date();
  const diffMinutes = differenceInMinutes(now, date);
  if (diffMinutes < 60) {
    return diffMinutes <= 0 ? "방금 전" : `${diffMinutes}분 전`;
  }

  const diffHours = differenceInHours(now, date);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  return `${differenceInDays(now, date)}일 전`;
}
