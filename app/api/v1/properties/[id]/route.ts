import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { getPropertyById } from '@/features/properties/domain/use-cases/get-property.use-case';

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