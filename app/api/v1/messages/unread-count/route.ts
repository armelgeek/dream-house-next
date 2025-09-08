import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { MessageService } from '@/features/messaging/domain/service';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const unreadCount = await MessageService.getUnreadCount(session.user.id);
    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error('Error in GET /api/v1/messages/unread-count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}