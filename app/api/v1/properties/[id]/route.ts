import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { getPropertyById } from '@/features/properties/domain/use-cases/get-property.use-case';
import { updateProperty } from '@/features/properties/domain/use-cases/update-property.use-case';
import { deleteProperty } from '@/features/properties/domain/use-cases/delete-property.use-case';
import { updatePropertySchema } from '@/features/properties/config/property.schema';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    
    // Get user ID if authenticated
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    const result = await getPropertyById(id, userId);

    if (!result.success) {
      const statusCode = result.error === 'Property not found' ? 404 : 500;
      return NextResponse.json(
        { error: result.error },
        { status: statusCode }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/v1/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const validation = updatePropertySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const result = await updateProperty({
      id,
      ownerId: session.user.id,
      ...validation.data,
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
    console.error('Error in PUT /api/v1/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const result = await deleteProperty({
      id,
      ownerId: session.user.id,
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
    console.error('Error in DELETE /api/v1/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}