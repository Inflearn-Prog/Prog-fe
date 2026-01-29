import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { queries } from "@/queries";

import MswComponent from "./msw-component";

export default function MswPage() {
  const queryClient = new QueryClient();

  void queryClient.prefetchQuery(queries.testQueries.list);

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h1>msw page</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <MswComponent />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
