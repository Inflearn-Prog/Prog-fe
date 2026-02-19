"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetch";

export default function KyTest() {
  const { data } = useSuspenseQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const response = await fetcher.get("user/11");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      return res;
    },
  });

  return <div>KyTest</div>;
}
