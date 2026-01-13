import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSignatureCollections,
  addToSignatureCollection,
  removeFromSignatureCollection,
  updateSignatureCollection
} from '@/lib/api/signature-collection';

// Query keys for better cache management
export const signatureQueryKeys = {
  all: ['signature-collection'] as const,
  lists: () => [...signatureQueryKeys.all, 'list'] as const,
  list: (filters?: { category?: string; featured?: boolean; isActive?: boolean }) =>
    [...signatureQueryKeys.lists(), filters] as const,
  details: () => [...signatureQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...signatureQueryKeys.details(), id] as const,
};

/**
 * React Query hook for fetching signature collection with advanced caching
 */
export const useSignatureCollection = (filters?: {
  category?: string;
  featured?: boolean;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: signatureQueryKeys.list(filters),
    queryFn: () => getSignatureCollections(),
    staleTime: 0, // CRITICAL: Set to 0 to always refetch fresh data (fixes discount not updating)
    gcTime: 5 * 60 * 1000, // Reduced from 10 min to prevent memory leaks
    refetchOnWindowFocus: true, // CRITICAL: Refetch when window regains focus to get latest admin changes
    refetchOnMount: true, // CRITICAL: Always refetch when component mounts to ensure fresh data
  });
};


/**
 * Mutation hook for adding product to signature collection
 */
export const useAddToSignatureCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, displayOrder }: {
      productId: string;
      displayOrder?: number;
    }) => addToSignatureCollection(productId, displayOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for removing product from signature collection
 */
export const useRemoveFromSignatureCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromSignatureCollection(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureQueryKeys.lists() });
    },
  });
};

/**
 * Mutation hook for updating signature collection item
 */
export const useUpdateSignatureCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: {
      id: string;
      updates: Parameters<typeof updateSignatureCollection>[1];
    }) => updateSignatureCollection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureQueryKeys.lists() });
    },
  });
};
