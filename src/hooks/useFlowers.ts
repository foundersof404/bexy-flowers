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
  return useQuery({
    queryKey: flowersQueryKeys.list(filters),
    queryFn: () => getFlowers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - reduced
    gcTime: 3 * 60 * 1000, // 3 minutes - reduced
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // REMOVED: Pre-warming to prevent memory buildup
    // onSuccess causes memory accumulation - queries will load on demand instead
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
    staleTime: 2 * 60 * 1000, // 2 minutes - reduced
    gcTime: 3 * 60 * 1000, // 3 minutes - reduced
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




