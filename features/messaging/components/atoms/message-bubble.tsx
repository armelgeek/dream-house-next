import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '../../config/message.schema';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  className?: string;
}

export function MessageBubble({ message, isOwn, className }: MessageBubbleProps) {
  const sender = message.sender;
  
  return (
    <div
      className={cn(
        'flex gap-3 max-w-[80%]',
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto',
        className
      )}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={sender?.image || ''} alt={sender?.name || ''} />
        <AvatarFallback className="text-xs">
          {sender?.name?.slice(0, 2)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-2 rounded-lg break-words',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted rounded-bl-sm'
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}