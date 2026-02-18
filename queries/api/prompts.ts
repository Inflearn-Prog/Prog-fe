const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const fetchPrompts = async (category: string, pageParam: number) => {
  const pageSize = 10;
  const response = await fetch(
    `${BASE_URL}/api/prompts?category=${category}&page=${pageParam}&size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다.");
  }
  return response.json();
};
