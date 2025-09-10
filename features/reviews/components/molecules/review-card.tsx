import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '../atoms/star-rating';
import { formatDistanceToNow } from 'date-fns';
import type { ReviewWithUser } from '../../config/review.schema';

interface ReviewCardProps {
  review: ReviewWithUser;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, className }) => {
  const getUserInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.user.image || undefined} />
              <AvatarFallback className="text-sm">
                {getUserInitials(review.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium">
                  {review.user.name || 'Anonymous User'}
                </h4>
                {review.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      {review.comment && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700 leading-relaxed">
            {review.comment}
          </p>
        </CardContent>
      )}
    </Card>
  );
};