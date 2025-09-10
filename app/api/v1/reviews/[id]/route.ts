import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { ReviewService } from '@/features/reviews/domain/service';
import { updateReviewUseCase } from '@/features/reviews/domain/use-cases/update-review.use-case';
import { updateReviewSchema } from '@/features/reviews/config/review.schema';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const reviewId = params.id;
    const body = await request.json();
    const validatedData = updateReviewSchema.parse(body);
    
    const review = await updateReviewUseCase(reviewId, session.user.id, validatedData);

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error in PUT /api/v1/reviews/[id]:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid input data' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('not found') || error.message.includes('permission')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const reviewId = params.id;
    const deleted = await ReviewService.delete(reviewId, session.user.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Review not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/v1/reviews/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}