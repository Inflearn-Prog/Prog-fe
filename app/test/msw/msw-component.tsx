"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { queries } from "@/queries";

export default function MswComponent() {
  const { data: mswData } = useSuspenseQuery(queries.testQueries.list);

  console.log(mswData);
  return (
    <div>
      <h2>MSW Component</h2>
      <pre>{JSON.stringify(mswData, null, 2)}</pre>
    </div>
  );
}
