import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import type { Conversation } from '../../config/message.schema';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export function ConversationItem({ 
  conversation, 
  isActive = false, 
  onClick, 
  className 
}: ConversationItemProps) {
  const { participant, lastMessage, unreadCount, property } = conversation;
  
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50',
        isActive && 'bg-muted',
        className
      )}
      onClick={onClick}
    >
      <Avatar className="w-12 h-12 flex-shrink-0">
        <AvatarImage src={participant.image || ''} alt={participant.name} />
        <AvatarFallback>
          {participant.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">
            {participant.name}
          </h3>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
            {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        {property && (
          <p className="text-xs text-muted-foreground mb-1 truncate">
            Re: {property.title}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <p className={cn(
            'text-sm text-muted-foreground truncate',
            !lastMessage.isRead && lastMessage.recipientId !== lastMessage.senderId && 'font-medium text-foreground'
          )}>
            {lastMessage.content}
          </p>
          
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 flex-shrink-0">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
      
      <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </div>
  );
}