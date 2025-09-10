import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { ReviewService } from '@/features/reviews/domain/service';
import { createReviewUseCase } from '@/features/reviews/domain/use-cases/create-review.use-case';
import { createReviewRequestSchema } from '@/features/reviews/config/review.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    if (includeStats) {
      const [reviews, stats] = await Promise.all([
        ReviewService.getByPropertyId(propertyId),
        ReviewService.getStats(propertyId),
      ]);
      
      return NextResponse.json({ reviews, stats });
    } else {
      const reviews = await ReviewService.getByPropertyId(propertyId);
      return NextResponse.json({ reviews });
    }
  } catch (error) {
    console.error('Error in GET /api/v1/properties/[id]/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: propertyId } = await params;
    const body = await request.json();
    const validatedData = createReviewRequestSchema.parse({
      ...body,
      propertyId,
    });
    
    const review = await createReviewUseCase({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/v1/properties/[id]/reviews:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid input data' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('already reviewed')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}