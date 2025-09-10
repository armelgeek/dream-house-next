import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ReviewCard } from '../molecules/review-card';
import { ReviewForm } from '../molecules/review-form';
import { ReviewStatsCard } from '../molecules/review-stats';
import { useReviews } from '../../hooks/use-reviews';
import type { CreateReviewRequest } from '../../config/review.schema';

interface PropertyReviewsProps {
  propertyId: string;
  className?: string;
}

export const PropertyReviews: React.FC<PropertyReviewsProps> = ({
  propertyId,
  className,
}) => {
  const [showForm, setShowForm] = useState(false);
  const { 
    data, 
    isLoading, 
    createReview, 
    isCreating,
    canUserReview 
  } = useReviews(propertyId);

  const handleSubmitReview = async (reviewData: CreateReviewRequest) => {
    try {
      await createReview.mutateAsync(reviewData);
      setShowForm(false);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to submit review:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const stats = data?.stats || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Review Stats */}
        <ReviewStatsCard stats={stats} />

        {/* Review Form */}
        {canUserReview && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Review</CardTitle>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)} variant="outline">
                    Write Review
                  </Button>
                )}
              </div>
            </CardHeader>
            {showForm && (
              <CardContent>
                <ReviewForm
                  propertyId={propertyId}
                  onSubmit={handleSubmitReview}
                  isLoading={isCreating}
                />
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Reviews ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review, index) => (
                <div key={review.id}>
                  <ReviewCard review={review} />
                  {index < reviews.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {reviews.length === 0 && stats.totalReviews === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Be the first to share your experience with this property!
              </p>
              {canUserReview && !showForm && (
                <Button onClick={() => setShowForm(true)}>
                  Write First Review
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};