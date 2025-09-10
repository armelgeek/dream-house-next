import { ReviewService } from '../service';
import type { UpdateReview, Review } from '../../config/review.schema';

export async function updateReviewUseCase(
  reviewId: string,
  userId: string,
  data: UpdateReview
): Promise<Review> {
  // Validate rating if provided
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  const updatedReview = await ReviewService.update(reviewId, userId, data);
  
  if (!updatedReview) {
    throw new Error('Review not found or you do not have permission to update it');
  }

  return updatedReview;
}