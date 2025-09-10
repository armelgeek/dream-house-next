import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateReviewRequest, ReviewWithUser, ReviewStats } from '../config/review.schema';

interface ReviewsResponse {
  reviews: ReviewWithUser[];
  stats?: ReviewStats;
}

const API_BASE = '/api/v1';

export function useReviews(propertyId: string, includeStats = true) {
  const queryClient = useQueryClient();

  // Fetch reviews
  const query = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: async (): Promise<ReviewsResponse> => {
      const url = `${API_BASE}/properties/${propertyId}/reviews${includeStats ? '?includeStats=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      return response.json();
    },
  });

  // Create review mutation
  const createReview = useMutation({
    mutationFn: async (data: CreateReviewRequest) => {
      const response = await fetch(`${API_BASE}/properties/${propertyId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create review');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      toast.success('Review submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  // Update review mutation
  const updateReview = useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: Partial<CreateReviewRequest> }) => {
      const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update review');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      toast.success('Review updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update review');
    },
  });

  // Delete review mutation
  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete review');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      toast.success('Review deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });

  // Check if user can review (simple client-side check, real check is server-side)
  const canUserReview = true; // This should be determined by auth state and existing reviews

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createReview,
    updateReview,
    deleteReview,
    isCreating: createReview.isPending,
    isUpdating: updateReview.isPending,
    isDeleting: deleteReview.isPending,
    canUserReview,
    refetch: query.refetch,
  };
}