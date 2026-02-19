import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  //파스텔톤 컬러 적용
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 60%)`;
}

export function formatRelativeDate(dateString: string) {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").trim();
}
