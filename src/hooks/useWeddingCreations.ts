import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWeddingCreations,
  getActiveWeddingCreations,
  getWeddingCreation,
  createWeddingCreation,
  updateWeddingCreation,
  deleteWeddingCreation
} from '@/lib/api/wedding-creations';

// Query keys for better cache management
export const weddingQueryKeys = {
  all: ['wedding-creations'] as const,
  lists: () => [...weddingQueryKeys.all, 'list'] as const,
  list: (filters?: { category?: string; featured?: boolean; isActive?: boolean }) =>
    [...weddingQueryKeys.lists(), filters] as const,
  details: () => [...weddingQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...weddingQueryKeys.details(), id] as const,
};

/**
 * React Query hook for fetching wedding creations with advanced caching
 */
export const useWeddingCreations = (filters?: {
  category?: string;
  featured?: boolean;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: weddingQueryKeys.list(filters),
    queryFn: async () => {
      // If isActive filter is true, use getActiveWeddingCreations
      if (filters?.isActive === true) {
        return await getActiveWeddingCreations();
      }
      // Otherwise, get all wedding creations
      return await getWeddingCreations();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - wedding data changes less frequently
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Pre-warm individual creations for better navigation performance
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const queryClient = useQueryClient();
        // Pre-load first 3 wedding creations (most likely to be viewed)
        data.slice(0, 3).forEach((creation) => {
          queryClient.prefetchQuery({
            queryKey: weddingQueryKeys.detail(creation.id),
            queryFn: () => getWeddingCreation(creation.id),
            staleTime: 5 * 60 * 1000,
          });
        });
      }
    },
  });
};

/**
 * React Query hook for fetching a single wedding creation
 */
export const useWeddingCreation = (id: string | undefined) => {
  return useQuery({
    queryKey: weddingQueryKeys.detail(id!),
    queryFn: () => getWeddingCreation(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Mutation hook for creating wedding creations
 */
export const useCreateWeddingCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creation, images }: {
      creation: Parameters<typeof createWeddingCreation>[0];
      images?: File[];
    }) => createWeddingCreation(creation, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weddingQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for updating wedding creations
 */
export const useUpdateWeddingCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
      newImages,
      imagesToDelete
    }: {
      id: string;
      updates: Parameters<typeof updateWeddingCreation>[1];
      newImages?: File[];
      imagesToDelete?: string[];
    }) => updateWeddingCreation(id, updates, newImages, imagesToDelete),
    onSuccess: (data) => {
      queryClient.setQueryData(weddingQueryKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: weddingQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for deleting wedding creations
 */
export const useDeleteWeddingCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWeddingCreation,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: weddingQueryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: weddingQueryKeys.lists() });
    },
  });
};




