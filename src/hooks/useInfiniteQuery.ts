/**
 * Infinite Query Hook for Pagination
 * 
 * Handles paginated data fetching with infinite scroll
 * Optimized for scalability with large datasets
 */

import { useInfiniteQuery as useReactQueryInfiniteQuery } from '@tanstack/react-query';

interface InfiniteQueryOptions<TData, TError = Error> {
  queryKey: readonly unknown[];
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<TData>;
  getNextPageParam: (lastPage: TData, allPages: TData[]) => number | undefined;
  initialPageParam?: number;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useInfiniteQuery<TData, TError = Error>(
  options: InfiniteQueryOptions<TData, TError>
) {
  return useReactQueryInfiniteQuery({
    ...options,
    initialPageParam: options.initialPageParam ?? 0,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options.gcTime ?? 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
