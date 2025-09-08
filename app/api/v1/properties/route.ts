import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { createProperty } from '@/features/properties/domain/use-cases/create-property.use-case';
import { searchProperties } from '@/features/properties/domain/use-cases/search-properties.use-case';
import { createPropertySchema, propertySearchSchema } from '@/features/properties/config/property.schema';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createPropertySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const result = await createProperty({
      ...validation.data,
      ownerId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/v1/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    
    // Convert string params to appropriate types
    const filters = {
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : undefined,
      limit: searchParams.limit ? parseInt(searchParams.limit) : undefined,
      minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
      minSize: searchParams.minSize ? parseInt(searchParams.minSize) : undefined,
      maxSize: searchParams.maxSize ? parseInt(searchParams.maxSize) : undefined,
      bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : undefined,
      bathrooms: searchParams.bathrooms ? parseInt(searchParams.bathrooms) : undefined,
    };

    const validation = propertySearchSchema.safeParse(filters);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Get user ID if authenticated
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    const result = await searchProperties(validation.data, userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/v1/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}