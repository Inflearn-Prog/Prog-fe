import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextPromptPageParam } from "@/hooks/use-prompt-list";
import { fetchSearchPrompts } from "@/queries/api/prompts";

import { SearchSection } from "./_components/search-section";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const queryClient = new QueryClient();

  if (q) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["prompts", "all", q, "latest"],
      queryFn: ({ pageParam = 0 }) =>
        fetchSearchPrompts(q, pageParam as number),
      initialPageParam: 0,
      getNextPageParam: getNextPromptPageParam,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchSection q={q} />
    </HydrationBoundary>
  );
}
