import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { queries } from "@/queries";

import MswDetail from "./msw-detail";

export default async function MswUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();

  void queryClient.prefetchQuery(queries.testQueries.detail(id));
  return (
    <div>
      <h1>msw user detail Page{id}</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading detail...</div>}>
          <MswDetail id={id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
