/**
 * 날짜 문자열을 "yy.MM.dd HH:mm" 형식으로 변환합니다.
 * @param dateString - ISO 8601 또는 Date 파싱 가능한 날짜 문자열
 * @returns "25.12.08 23:43" 형태의 포맷된 날짜 문자열
 */
export function formatCommentDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    const yy = String(date.getFullYear()).slice(2);
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yy}.${MM}.${dd} ${HH}:${mm}`;
  } catch (error) {
    console.error("날짜 포맷 변환 실패:", error);
    return dateString;
  }
}
