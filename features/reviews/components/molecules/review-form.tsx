import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRating } from '../atoms/star-rating';
import { createReviewRequestSchema } from '../../config/review.schema';
import type { CreateReviewRequest } from '../../config/review.schema';

interface ReviewFormProps {
  propertyId: string;
  onSubmit: (data: CreateReviewRequest) => void;
  isLoading?: boolean;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  propertyId,
  onSubmit,
  isLoading = false,
  className,
}) => {
  const form = useForm<CreateReviewRequest>({
    resolver: zodResolver(createReviewRequestSchema),
    defaultValues: {
      propertyId,
      rating: 5,
      comment: '',
    },
  });

  const handleSubmit = (data: CreateReviewRequest) => {
    onSubmit(data);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <StarRating
                        rating={field.value}
                        interactive
                        onRatingChange={field.onChange}
                        size="lg"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({field.value} out of 5)
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your experience with this property..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};