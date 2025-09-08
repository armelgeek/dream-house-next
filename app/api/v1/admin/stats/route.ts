import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { AdminService } from '@/features/admin/domain/service';

// Helper function to check if user is admin
async function isAdmin(_userId: string): Promise<boolean> {
  // TODO: Implement proper admin role checking
  return true; // Temporary: allow all authenticated users as admin for testing
}

export async function GET() {
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

    const stats = await AdminService.getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/v1/admin/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}