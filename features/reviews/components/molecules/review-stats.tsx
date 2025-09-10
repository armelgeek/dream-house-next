import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StarRating } from '../atoms/star-rating';
import { Star } from 'lucide-react';
import type { ReviewStats } from '../../config/review.schema';

interface ReviewStatsProps {
  stats: ReviewStats;
  className?: string;
}

export const ReviewStatsCard: React.FC<ReviewStatsProps> = ({ stats, className }) => {
  const { totalReviews, averageRating, ratingDistribution } = stats;

  if (totalReviews === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 text-sm">Be the first to review this property!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <StarRating rating={averageRating} size="md" />
            <div className="text-sm text-muted-foreground mt-1">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};