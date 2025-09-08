import { db } from '@/drizzle/db';
import { messages, users, properties } from '@/drizzle/schema';
import { eq, and, or, desc, asc, count, sql } from 'drizzle-orm';
import type { CreateMessage, Message, Conversation } from '../config/message.schema';

export class MessageService {
  static async create(data: CreateMessage & { senderId: string }): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(data)
      .returning();

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
    // Get all unique conversation partners
    const conversationPartners = await db
      .select({
        participantId: sql<string>`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.recipientId}
          ELSE ${messages.senderId}
        END`,
        propertyId: messages.propertyId,
      })
      .from(messages)
      .where(
        or(eq(messages.senderId, userId), eq(messages.recipientId, userId))
      )
      .groupBy(
        sql`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.recipientId}
          ELSE ${messages.senderId}
        END`,
        messages.propertyId
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
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
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
            partner.propertyId ? eq(messages.propertyId, partner.propertyId) : sql`1=1`
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      // Get unread count
      const [{ unreadCount }] = await db
        .select({ unreadCount: count() })
        .from(messages)
        .where(
          and(
            eq(messages.recipientId, userId),
            eq(messages.senderId, partner.participantId),
            eq(messages.isRead, false),
            partner.propertyId ? eq(messages.propertyId, partner.propertyId) : sql`1=1`
          )
        );

      if (lastMessageQuery[0]) {
        const { message, sender, participant, property } = lastMessageQuery[0];
        conversations.push({
          participantId: partner.participantId,
          participant: participant!,
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
    const [{ count: unreadCount }] = await db
      .select({ count: count() })
      .from(messages)
      .where(
        and(eq(messages.recipientId, userId), eq(messages.isRead, false))
      );

    return unreadCount;
  }

  private static mapToMessage(message: any): Message {
    return {
      ...message,
    };
  }
}