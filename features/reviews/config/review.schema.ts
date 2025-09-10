import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { reviews } from '@/drizzle/schema';

// Base schema from database
export const reviewSchema = createSelectSchema(reviews);
export const createReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// API schemas
export const createReviewRequestSchema = createReviewSchema.omit({
  userId: true, // Will be set from session
}).extend({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const updateReviewSchema = createReviewRequestSchema.partial();

// TypeScript types
export type Review = z.infer<typeof reviewSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
export type CreateReviewRequest = z.infer<typeof createReviewRequestSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;

// Review with user info
export type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

// Review stats
export type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};