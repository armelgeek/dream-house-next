import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { updatePropertyStatus } from '@/features/properties/domain/use-cases/update-property-status.use-case';
import { z } from 'zod';

interface Params {
  id: string;
}

const statusUpdateSchema = z.object({
  status: z.enum(['available', 'sold', 'rented', 'draft']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = statusUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid status', details: validation.error.errors },
        { status: 400 }
      );
    }

    const result = await updatePropertyStatus({
      id,
      ownerId: session.user.id,
      status: validation.data.status,
    });

    if (!result.success) {
      const statusCode = result.error?.includes('not found') || result.error?.includes('permission') ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status: statusCode }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in PATCH /api/v1/properties/[id]/status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}