import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/features/admin/domain/service';
import { propertyModerationSchema } from '@/features/admin/config/admin.schema';

// Helper function to check if user is admin
async function isAdmin(_userId: string): Promise<boolean> {
  // TODO: Implement proper admin role checking
  return true; // Temporary: allow all authenticated users as admin for testing
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = await AdminService.getProperties(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/v1/admin/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = propertyModerationSchema.parse(body);
    
    await AdminService.moderateProperty(validatedData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/v1/admin/properties:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}