import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { MessageService } from '@/features/messaging/domain/service';

interface Params {
  userId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const conversation = await MessageService.getConversation(
      session.user.id,
      userId,
      propertyId || undefined
    );

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error in GET /api/v1/messages/conversation/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}