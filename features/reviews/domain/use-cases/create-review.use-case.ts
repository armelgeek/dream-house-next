import { ReviewService } from '../service';
import type { CreateReviewRequest, Review } from '../../config/review.schema';

export async function createReviewUseCase(
  data: CreateReviewRequest & { userId: string }
): Promise<Review> {
  // Check if user can review this property
  const canReview = await ReviewService.canUserReview(data.propertyId, data.userId);
  
  if (!canReview) {
    throw new Error('You have already reviewed this property');
  }

  // Validate rating range
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  return await ReviewService.create({
    propertyId: data.propertyId,
    userId: data.userId,
    rating: data.rating,
    comment: data.comment,
    isVerified: false, // Default to false, can be updated by admin
  });
}