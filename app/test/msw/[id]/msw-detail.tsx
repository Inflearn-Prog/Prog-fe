"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { queries } from "@/queries";

export default function MswDetail({ id }: { id: string }) {
  const { data: userDetail } = useSuspenseQuery(queries.testQueries.detail(id));
  return (
    <div>
      <h2>MSW Detail User ID: {userDetail.data?.id}</h2>
      <p>MSW Detail User Name: {userDetail.data?.name}</p>
      <p>MSW Detail User Age: {userDetail.data?.age}</p>
    </div>
  );
}
