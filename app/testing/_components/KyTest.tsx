"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetch";

export default function KyTest() {
  const { data } = useSuspenseQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const response = await fetcher.get("user/11").json();

      return response;
    },
  });

  async function handlePost() {
    const res = await fetcher
      .post("user", {
        json: {
          name: "John Doe",
          email: "123@kakao.com",
          age: 30,
        },
      })
      .json();
  }

  return (
    <div>
      <p>KyTest</p>

      <button onClick={handlePost}>post</button>
    </div>
  );
}
