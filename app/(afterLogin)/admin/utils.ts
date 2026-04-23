export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const year = String(d.getFullYear()).slice(2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const year = String(d.getFullYear()).slice(2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hour}:${min}`;
}

export function formatDateKo(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
