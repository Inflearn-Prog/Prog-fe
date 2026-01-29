"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { queries } from "@/queries";

export default function MswComponent() {
  const { data: mswData } = useSuspenseQuery(queries.testQueries.list);

  return (
    <div>
      <h2>MSW Component</h2>
      <div className="flex flex-col gap-y-2">
        {mswData.data?.map((user) => (
          <Link
            className="border p-2 rounded-sm hover:bg-blue-50 transition-all"
            href={`/test/msw/${user.id}`}
            key={user.id}
          >
            <p>User ID: {user.id}</p>
            <p>User Name: {user.name}</p>
            <p>User Age: {user.age}</p>
            <hr />
          </Link>
        ))}
      </div>
    </div>
  );
}
