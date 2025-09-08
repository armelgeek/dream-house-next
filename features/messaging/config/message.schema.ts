import { z } from 'zod';

// Message creation schema
export const createMessageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  propertyId: z.string().optional(),
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
});

// Message types
export type CreateMessage = z.infer<typeof createMessageSchema>;

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  propertyId?: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  sender?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  recipient?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  property?: {
    id: string;
    title: string;
    images: string[] | null;
  };
}

export interface Conversation {
  participantId: string;
  participant: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  lastMessage: Message;
  unreadCount: number;
  property?: {
    id: string;
    title: string;
    images: string[] | null;
  };
}