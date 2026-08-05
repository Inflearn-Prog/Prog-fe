import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  formatAbsolute,
  formatRelative,
  parseServerDate,
} from "@/lib/datetime";

// 이 테스트는 실행 머신의 TZ 와 무관하게 같은 결과를 내야 한다.
// (표시 함수가 로컬 게터 대신 Intl 의 timeZone:"Asia/Seoul" 을 쓰기 때문)
// TZ=UTC / TZ=Asia/Seoul / TZ=America/New_York 에서 모두 초록이어야 통과다.

describe("parseServerDate — 와이어 포맷 해석", () => {
  it("오프셋 없는 문자열은 UTC 로 해석한다", () => {
    expect(parseServerDate("2026-08-05T07:02:28")?.toISOString()).toBe(
      "2026-08-05T07:02:28.000Z"
    );
  });

  it('"Z" 문자열은 그대로 UTC', () => {
    expect(parseServerDate("2026-08-05T07:02:28Z")?.toISOString()).toBe(
      "2026-08-05T07:02:28.000Z"
    );
  });

  it('"+09:00" 오프셋을 존중한다 (16:02 KST == 07:02 UTC)', () => {
    expect(parseServerDate("2026-08-05T16:02:28+09:00")?.toISOString()).toBe(
      "2026-08-05T07:02:28.000Z"
    );
  });

  it.each([null, undefined, "", "   ", "garbage", "2026-13-45T99:99:99"])(
    "잘못된 입력(%s)은 null 을 반환하고 예외를 던지지 않는다",
    (input) => {
      expect(parseServerDate(input as string | null | undefined)).toBeNull();
    }
  );
});

describe("formatAbsolute — Asia/Seoul 고정 절대 표기", () => {
  it("UTC 벽시계를 KST(+9)로 표시한다 (07:02 UTC → 16:02 KST)", () => {
    expect(formatAbsolute("2026-08-05T07:02:28")).toBe("26.08.05 16:02");
  });

  it('"Z" 문자열도 동일하게 KST 로', () => {
    expect(formatAbsolute("2026-08-05T07:02:28Z")).toBe("26.08.05 16:02");
  });

  it("자정 경계: 23:30 UTC → 익일 08:30 KST", () => {
    expect(formatAbsolute("2026-08-05T23:30:00")).toBe("26.08.06 08:30");
  });

  it.each([null, undefined, "", "garbage"])(
    '잘못된 입력(%s)은 "—"',
    (input) => {
      expect(formatAbsolute(input as string | null | undefined)).toBe("—");
    }
  );
});

describe("formatRelative — 상대 표기", () => {
  beforeEach(() => {
    // now 를 2026-08-05T07:00:00Z 로 고정
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-05T07:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('0분 → "방금 전"', () => {
    expect(formatRelative("2026-08-05T07:00:00Z")).toBe("방금 전");
  });

  it('59분 → "59분 전"', () => {
    expect(formatRelative("2026-08-05T06:01:00Z")).toBe("59분 전");
  });

  it('60분 → "1시간 전"', () => {
    expect(formatRelative("2026-08-05T06:00:00Z")).toBe("1시간 전");
  });

  it('24시간 → "1일 전"', () => {
    expect(formatRelative("2026-08-04T07:00:00Z")).toBe("1일 전");
  });

  it("오프셋 없는 과거값도 UTC 기준으로 계산한다 (04:00 → 3시간 전)", () => {
    expect(formatRelative("2026-08-05T04:00:00")).toBe("3시간 전");
  });

  it('미래값(시계 오차)은 "방금 전"', () => {
    expect(formatRelative("2026-08-05T07:05:00Z")).toBe("방금 전");
  });

  it.each([null, undefined, "", "garbage"])(
    '잘못된 입력(%s)은 "—" (NaN일 전 금지)',
    (input) => {
      expect(formatRelative(input as string | null | undefined)).toBe("—");
    }
  );
});
