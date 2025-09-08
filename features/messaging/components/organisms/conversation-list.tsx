'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MessageCircle } from 'lucide-react';
import { ConversationItem } from '../molecules/conversation-item';
import { useConversations } from '../../hooks/use-messages';
import type { Conversation } from '../../config/message.schema';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
  className?: string;
}

export function ConversationList({ 
  onSelectConversation, 
  selectedConversationId, 
  className 
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { conversations, loading, error } = useConversations();

  const filteredConversations = conversations.filter((conversation) =>
    conversation.participant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Failed to load conversations</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 px-4">
            {searchTerm ? (
              <p>No conversations found matching "{searchTerm}"</p>
            ) : (
              <div className="space-y-2">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start messaging property owners!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.participantId}
                conversation={conversation}
                isActive={selectedConversationId === conversation.participantId}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}