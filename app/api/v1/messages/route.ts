import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { MessageService } from '@/features/messaging/domain/service';
import { createMessageSchema } from '@/features/messaging/config/message.schema';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const conversations = await MessageService.getConversations(session.user.id);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error in GET /api/v1/messages:', error);
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

    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);
    
    const message = await MessageService.create({
      ...validatedData,
      senderId: session.user.id,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/v1/messages:', error);
    
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