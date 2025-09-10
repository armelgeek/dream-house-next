import { db } from '@/drizzle/db';
import { reviews, users } from '@/drizzle/schema';
import { eq, and, desc, avg, count, sql } from 'drizzle-orm';
import type { 
  CreateReview, 
  Review, 
  ReviewWithUser, 
  ReviewStats, 
  UpdateReview 
} from '../config/review.schema';

export class ReviewService {
  static async create(data: CreateReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(data)
      .returning();

    return review;
  }

  static async getByPropertyId(propertyId: string): Promise<ReviewWithUser[]> {
    const result = await db
      .select({
        review: reviews,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.propertyId, propertyId))
      .orderBy(desc(reviews.createdAt));

    return result.map(({ review, user }) => ({
      ...review,
      user: user!,
    }));
  }

  static async getStats(propertyId: string): Promise<ReviewStats> {
    // Get average rating and total count
    const [avgResult] = await db
      .select({
        averageRating: avg(reviews.rating),
        totalReviews: count(),
      })
      .from(reviews)
      .where(eq(reviews.propertyId, propertyId));

    // Get rating distribution
    const ratingCounts = await db
      .select({
        rating: reviews.rating,
        count: count(),
      })
      .from(reviews)
      .where(eq(reviews.propertyId, propertyId))
      .groupBy(reviews.rating);

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingCounts.forEach(({ rating, count }) => {
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating as keyof typeof ratingDistribution] = count;
      }
    });

    return {
      totalReviews: avgResult.totalReviews || 0,
      averageRating: Number(avgResult.averageRating) || 0,
      ratingDistribution,
    };
  }

  static async getUserReview(propertyId: string, userId: string): Promise<Review | null> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.propertyId, propertyId), eq(reviews.userId, userId)))
      .limit(1);

    return review || null;
  }

  static async update(id: string, userId: string, data: UpdateReview): Promise<Review | null> {
    const [review] = await db
      .update(reviews)
      .set({ ...data, updatedAt: sql`now()` })
      .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
      .returning();

    return review || null;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(reviews)
      .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
      .returning();

    return result.length > 0;
  }

  static async canUserReview(propertyId: string, userId: string): Promise<boolean> {
    // Check if user already has a review for this property
    const existingReview = await this.getUserReview(propertyId, userId);
    return !existingReview;
  }
}