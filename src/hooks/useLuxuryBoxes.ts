import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLuxuryBoxes,
  getLuxuryBox,
  createLuxuryBox,
  updateLuxuryBox,
  deleteLuxuryBox
} from '@/lib/api/luxury-boxes';

// Query keys for better cache management
export const luxuryBoxesQueryKeys = {
  all: ['luxury-boxes'] as const,
  lists: () => [...luxuryBoxesQueryKeys.all, 'list'] as const,
  list: (filters?: { category?: string; featured?: boolean; isActive?: boolean }) =>
    [...luxuryBoxesQueryKeys.lists(), filters] as const,
  details: () => [...luxuryBoxesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...luxuryBoxesQueryKeys.details(), id] as const,
};

/**
 * React Query hook for fetching luxury boxes with advanced caching
 */
export const useLuxuryBoxes = (filters?: {
  category?: string;
  featured?: boolean;
  isActive?: boolean;
}) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: luxuryBoxesQueryKeys.list(filters),
    queryFn: () => getLuxuryBoxes(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Pre-warm individual luxury boxes for better navigation performance
    onSuccess: (data) => {
      if (data && data.length > 0) {
        // Pre-load first 3 luxury boxes (most likely to be viewed)
        data.slice(0, 3).forEach((box) => {
          queryClient.prefetchQuery({
            queryKey: luxuryBoxesQueryKeys.detail(box.id),
            queryFn: () => getLuxuryBox(box.id),
            staleTime: 5 * 60 * 1000,
          });
        });
      }
    },
  });
};

/**
 * React Query hook for fetching a single luxury box
 */
export const useLuxuryBox = (id: string | undefined) => {
  return useQuery({
    queryKey: luxuryBoxesQueryKeys.detail(id!),
    queryFn: () => getLuxuryBox(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Mutation hook for creating luxury boxes
 */
export const useCreateLuxuryBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ box, images }: {
      box: Parameters<typeof createLuxuryBox>[0];
      images?: File[];
    }) => createLuxuryBox(box, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: luxuryBoxesQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for updating luxury boxes
 */
export const useUpdateLuxuryBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
      newImages,
      imagesToDelete
    }: {
      id: string;
      updates: Parameters<typeof updateLuxuryBox>[1];
      newImages?: File[];
      imagesToDelete?: string[];
    }) => updateLuxuryBox(id, updates, newImages, imagesToDelete),
    onSuccess: (data) => {
      queryClient.setQueryData(luxuryBoxesQueryKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: luxuryBoxesQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for deleting luxury boxes
 */
export const useDeleteLuxuryBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLuxuryBox,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: luxuryBoxesQueryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: luxuryBoxesQueryKeys.lists() });
    },
  });
};




