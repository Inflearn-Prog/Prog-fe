import { queryOptions } from "@tanstack/react-query";

import { testFetcherAll, testFetcherDetail } from "./test-fetcher";

// https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation
export const testQueries = {
  all: queryOptions({
    queryKey: ["test"],
  }),
  list: queryOptions({
    queryKey: ["test", "list"],
    queryFn: testFetcherAll,
  }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["test", "detail", id],
      queryFn: () => testFetcherDetail(id),
    }),
};
