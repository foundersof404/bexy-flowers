import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFlowers,
  getFlower,
  createFlower,
  updateFlower,
  deleteFlower
} from '@/lib/api/flowers';

// Query keys for better cache management
export const flowersQueryKeys = {
  all: ['flowers'] as const,
  lists: () => [...flowersQueryKeys.all, 'list'] as const,
  list: (filters?: { category?: string; featured?: boolean; isActive?: boolean }) =>
    [...flowersQueryKeys.lists(), filters] as const,
  details: () => [...flowersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...flowersQueryKeys.details(), id] as const,
};

/**
 * React Query hook for fetching flowers with advanced caching
 */
export const useFlowers = (filters?: {
  category?: string;
  featured?: boolean;
  isActive?: boolean;
}) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: flowersQueryKeys.list(filters),
    queryFn: () => getFlowers(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Pre-warm individual flowers for better navigation performance
    onSuccess: (data) => {
      if (data && data.length > 0) {
        // Pre-load first 3 flowers (most likely to be viewed)
        data.slice(0, 3).forEach((flower) => {
          queryClient.prefetchQuery({
            queryKey: flowersQueryKeys.detail(flower.id),
            queryFn: () => getFlower(flower.id),
            staleTime: 5 * 60 * 1000,
          });
        });
      }
    },
  });
};

/**
 * React Query hook for fetching a single flower
 */
export const useFlower = (id: string | undefined) => {
  return useQuery({
    queryKey: flowersQueryKeys.detail(id!),
    queryFn: () => getFlower(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Mutation hook for creating flowers
 */
export const useCreateFlower = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flower, images }: {
      flower: Parameters<typeof createFlower>[0];
      images?: File[];
    }) => createFlower(flower, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowersQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for updating flowers
 */
export const useUpdateFlower = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
      newImages,
      imagesToDelete
    }: {
      id: string;
      updates: Parameters<typeof updateFlower>[1];
      newImages?: File[];
      imagesToDelete?: string[];
    }) => updateFlower(id, updates, newImages, imagesToDelete),
    onSuccess: (data) => {
      queryClient.setQueryData(flowersQueryKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: flowersQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for deleting flowers
 */
export const useDeleteFlower = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlower,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: flowersQueryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: flowersQueryKeys.lists() });
    },
  });
};




