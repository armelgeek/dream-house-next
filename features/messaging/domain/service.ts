import { db } from '@/drizzle/db';
import { messages, users, properties } from '@/drizzle/schema';
import { eq, and, or, desc, asc, count, sql } from 'drizzle-orm';
import type { CreateMessage, Message, Conversation } from '../config/message.schema';
import { MessageEmailService } from '../utils/email.service';

export class MessageService {
  static async create(data: CreateMessage & { senderId: string }): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(data)
      .returning();

    // Send email notification to the recipient
    try {
      const [recipient] = await db
        .select({
          email: users.email,
          name: users.name,
        })
        .from(users)
        .where(eq(users.id, data.recipientId))
        .limit(1);

      const [sender] = await db
        .select({
          name: users.name,
        })
        .from(users)
        .where(eq(users.id, data.senderId))
        .limit(1);

      let propertyTitle: string | undefined;
      if (data.propertyId) {
        const [property] = await db
          .select({
            title: properties.title,
          })
          .from(properties)
          .where(eq(properties.id, data.propertyId))
          .limit(1);
        
        propertyTitle = property?.title;
      }

      if (recipient && sender) {
        await MessageEmailService.sendMessageNotification({
          recipientEmail: recipient.email,
          recipientName: recipient.name || 'User',
          senderName: sender.name || 'Someone',
          message: data.content,
          propertyTitle,
        });
      }
    } catch (error) {
      console.error('Failed to send email notification for message:', error);
      // Don't fail the message creation if email fails
    }

    return this.mapToMessage(message);
  }

  static async getConversation(user1Id: string, user2Id: string, propertyId?: string): Promise<Message[]> {
    let whereClause = and(
      or(
        and(eq(messages.senderId, user1Id), eq(messages.recipientId, user2Id)),
        and(eq(messages.senderId, user2Id), eq(messages.recipientId, user1Id))
      )
    );

    if (propertyId) {
      whereClause = and(whereClause, eq(messages.propertyId, propertyId));
    }

    const result = await db
      .select({
        message: messages,
        sender: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        recipient: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(whereClause)
      .orderBy(asc(messages.createdAt));

    return result.map(({ message, sender }) => ({
      ...this.mapToMessage(message),
      sender: sender!,
    }));
  }

  static async getConversations(userId: string): Promise<Conversation[]> {
    // Get all unique conversation partners with their property IDs
    const conversationPartners = await db
      .selectDistinct({
        participantId: sql<string>`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.recipientId}
          ELSE ${messages.senderId}
        END`,
        propertyId: messages.propertyId,
      })
      .from(messages)
      .where(
        or(eq(messages.senderId, userId), eq(messages.recipientId, userId))
      );

    const conversations: Conversation[] = [];

    for (const partner of conversationPartners) {
      // Get the last message for this conversation
      const lastMessageQuery = await db
        .select({
          message: messages,
          sender: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          },
          participant: {
            id: sql<string>`participant.id`,
            name: sql<string>`participant.name`,
            email: sql<string>`participant.email`,
            image: sql<string>`participant.image`,
          },
          property: {
            id: properties.id,
            title: properties.title,
            images: properties.images,
          },
        })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .leftJoin(
          sql`${users} AS participant`,
          sql`participant.id = ${partner.participantId}`
        )
        .leftJoin(properties, eq(messages.propertyId, properties.id))
        .where(
          and(
            or(
              and(eq(messages.senderId, userId), eq(messages.recipientId, partner.participantId)),
              and(eq(messages.senderId, partner.participantId), eq(messages.recipientId, userId))
            ),
            partner.propertyId ? eq(messages.propertyId, partner.propertyId) : sql`TRUE`
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      // Get unread count
      const [unreadResult] = await db
        .select({ unreadCount: count() })
        .from(messages)
        .where(
          and(
            eq(messages.recipientId, userId),
            eq(messages.senderId, partner.participantId),
            eq(messages.isRead, false),
            partner.propertyId ? eq(messages.propertyId, partner.propertyId) : sql`TRUE`
          )
        );

      const unreadCount = unreadResult?.unreadCount || 0;

      if (lastMessageQuery[0]) {
        const { message, sender, participant, property } = lastMessageQuery[0];
        conversations.push({
          participantId: partner.participantId,
          participant: {
            id: participant.id,
            name: participant.name,
            email: participant.email,
            image: participant.image,
          },
          lastMessage: {
            ...this.mapToMessage(message),
            sender: sender!,
          },
          unreadCount,
          property: property || undefined,
        });
      }
    }

    return conversations.sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }

  static async markAsRead(messageIds: string[], userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true, updatedAt: sql`now()` })
      .where(
        and(
          sql`${messages.id} = ANY(${messageIds})`,
          eq(messages.recipientId, userId)
        )
      );
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(messages)
      .where(
        and(eq(messages.recipientId, userId), eq(messages.isRead, false))
      );

    return result?.count || 0;
  }

  private static mapToMessage(message: any): Message {
    return {
      ...message,
    };
  }
}