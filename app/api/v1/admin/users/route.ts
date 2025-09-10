import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/features/admin/domain/service';
import { userModerationSchema } from '@/features/admin/config/admin.schema';

// Helper function to check if user is admin (basic implementation)
async function isAdmin(userId: string): Promise<boolean> {
  // TODO: Implement proper admin role checking
  // For now, you can hardcode admin user IDs or implement a role system
  // This is a basic implementation that should be replaced with proper role management
  console.log(`Checking admin status for user: ${userId}`);
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

    const result = await AdminService.getUsers(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/v1/admin/users:', error);
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
    const validatedData = userModerationSchema.parse(body);
    
    await AdminService.moderateUser(validatedData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/v1/admin/users:', error);
    
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