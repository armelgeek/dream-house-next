import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { MessageService } from '@/features/messaging/domain/service';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messageIds } = body;

    if (!Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'messageIds must be an array' },
        { status: 400 }
      );
    }

    await MessageService.markAsRead(messageIds, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/v1/messages/mark-read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}