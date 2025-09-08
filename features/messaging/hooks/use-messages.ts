import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Conversation, CreateMessage } from '../config/message.schema';

interface UseConversationsResult {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useConversations(): UseConversationsResult {
  const [error, setError] = useState<string | null>(null);

  const { data: conversations = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const response = await fetch('/api/v1/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for near real-time updates
  });

  return {
    conversations,
    loading,
    error,
    refetch,
  };
}

interface UseConversationResult {
  messages: any[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
  refetch: () => void;
}

export function useConversation(userId: string, propertyId?: string): UseConversationResult {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const queryKey = ['conversation', userId, propertyId].filter(Boolean);
  
  const { data: messages = [], isLoading: loading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const url = new URL(`/api/v1/messages/conversation/${userId}`, window.location.origin);
      if (propertyId) {
        url.searchParams.set('propertyId', propertyId);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      return response.json();
    },
    refetchInterval: 5000, // More frequent updates for active conversations
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const payload: CreateMessage = {
        recipientId: userId,
        content,
        ...(propertyId && { propertyId }),
      };

      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch conversation and conversations list
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setError('Failed to send message');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      const response = await fetch('/api/v1/messages/mark-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
    onError: (error) => {
      console.error('Error marking messages as read:', error);
      setError('Failed to mark messages as read');
    },
  });

  return {
    messages,
    loading,
    error,
    sendMessage: sendMessageMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    refetch,
  };
}