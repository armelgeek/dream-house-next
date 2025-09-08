'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { ConversationList } from './conversation-list';
import { MessageList } from '../molecules/message-list';
import type { Conversation } from '../../config/message.schema';

interface MessagingInterfaceProps {
  currentUserId: string;
  className?: string;
}

export function MessagingInterface({ currentUserId, className }: MessagingInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsMobileView(true);
  };

  const handleBackToList = () => {
    setIsMobileView(false);
    setSelectedConversation(null);
  };

  return (
    <div className={`h-[600px] ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
        {/* Conversations List */}
        <Card className={`${isMobileView ? 'hidden md:block' : 'block'}`}>
          <ConversationList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.participantId}
          />
        </Card>
        
        {/* Message Area */}
        <Card className={`md:col-span-2 ${!isMobileView && !selectedConversation ? 'hidden md:block' : 'block'}`}>
          {selectedConversation ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <h3 className="font-medium">{selectedConversation.participant.name}</h3>
                  {selectedConversation.property && (
                    <p className="text-sm text-muted-foreground">
                      Re: {selectedConversation.property.title}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1">
                <MessageList
                  userId={selectedConversation.participantId}
                  currentUserId={currentUserId}
                  propertyId={selectedConversation.property?.id}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}