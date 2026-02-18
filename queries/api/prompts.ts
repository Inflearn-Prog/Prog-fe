const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080";

export const fetchPrompts = async (category: string, pageParam: number) => {
  const pageSize = 10;
  const params = new URLSearchParams({
    category,
    page: String(pageParam),
    size: String(pageSize),
  });
  const response = await fetch(`${BASE_URL}/api/prompts?${params}`);

  if (!response.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다.");
  }
  return response.json();
};
