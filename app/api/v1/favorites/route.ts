import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { FavoriteService } from '@/features/favorites/domain/service';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const favorites = await FavoriteService.getUserFavorites(session.user.id);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error in GET /api/v1/favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const result = await FavoriteService.toggle(session.user.id, propertyId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/v1/favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}