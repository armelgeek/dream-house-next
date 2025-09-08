'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useUnreadCount } from '@/features/messaging/hooks/use-unread-count';

export function MessageNotification() {
  const { unreadCount } = useUnreadCount();

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/dashboard/messages">
        <MessageSquare className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}