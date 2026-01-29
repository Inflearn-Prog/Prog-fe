const baseUrl = "https://api.example.com";

interface MswUser {
  id: string;
  name: string;
  age: number;
}

interface MswResponse<T> {
  data?: T;
}
export async function testFetcherAll() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(`${baseUrl}/api/user`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = (await res.json()) as MswResponse<MswUser[]>;
  return data;
}

export async function testFetcherDetail(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(`${baseUrl}/api/user/${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = (await res.json()) as MswResponse<MswUser>;
  return data;
}
