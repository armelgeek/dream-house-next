import { db } from '@/drizzle/db';
import { users, properties, messages } from '@/drizzle/schema';
import { eq, count, desc, gte, sql } from 'drizzle-orm';
import type { 
  UserWithStats, 
  PropertyWithModerationInfo, 
  AdminStats,
  UserModeration,
  PropertyModeration 
} from '../config/admin.schema';

export class AdminService {
  // User management
  static async getUsers(page = 1, limit = 50): Promise<{
    users: UserWithStats[];
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const offset = (page - 1) * limit;

    // Get users with stats
    const usersWithStats = await db
      .select({
        user: users,
        propertyCount: count(properties.id),
        // TODO: Add message count and suspension status when implemented
      })
      .from(users)
      .leftJoin(properties, eq(users.id, properties.ownerId))
      .groupBy(users.id)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(users);

    const mappedUsers: UserWithStats[] = usersWithStats.map(({ user, propertyCount }) => ({
      ...user,
      propertyCount,
      messageCount: 0, // TODO: Implement when message counting is added
      isSuspended: false, // TODO: Implement suspension logic
      isEmailVerified: user.emailVerified, // Map emailVerified to isEmailVerified
    }));

    return {
      users: mappedUsers,
      total,
      hasNext: offset + limit < total,
      hasPrev: page > 1,
    };
  }

  static async getProperties(page = 1, limit = 50): Promise<{
    properties: PropertyWithModerationInfo[];
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const offset = (page - 1) * limit;

    const propertiesWithOwner = await db
      .select({
        property: properties,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(properties)
      .leftJoin(users, eq(properties.ownerId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(properties.createdAt));

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(properties);

    const mappedProperties: PropertyWithModerationInfo[] = propertiesWithOwner.map(
      ({ property, owner }) => ({
        ...property,
        owner: owner!,
      })
    );

    return {
      properties: mappedProperties,
      total,
      hasNext: offset + limit < total,
      hasPrev: page > 1,
    };
  }

  static async getAdminStats(): Promise<AdminStats> {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get overall stats
    const [userStats] = await db
      .select({ total: count() })
      .from(users);

    const [propertyStats] = await db
      .select({ total: count() })
      .from(properties);

    const [messageStats] = await db
      .select({ total: count() })
      .from(messages);

    // Get recent activity (last 30 days)
    const [newUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    const [newProperties] = await db
      .select({ count: count() })
      .from(properties)
      .where(gte(properties.createdAt, thirtyDaysAgo));

    const [newMessages] = await db
      .select({ count: count() })
      .from(messages)
      .where(gte(messages.createdAt, thirtyDaysAgo));

    // Get active users (users who have properties or sent messages in last 30 days)
    const [activeUsers] = await db
      .select({ count: count(sql`DISTINCT ${users.id}`) })
      .from(users)
      .leftJoin(properties, eq(users.id, properties.ownerId))
      .leftJoin(messages, eq(users.id, messages.senderId))
      .where(
        sql`${properties.createdAt} >= ${thirtyDaysAgo} OR ${messages.createdAt} >= ${thirtyDaysAgo}`
      );

    return {
      totalUsers: userStats.total,
      totalProperties: propertyStats.total,
      totalMessages: messageStats.total,
      activeUsers: activeUsers.count,
      pendingProperties: 0, // TODO: Implement when property approval workflow is added
      recentActivity: {
        newUsers: newUsers.count,
        newProperties: newProperties.count,
        newMessages: newMessages.count,
      },
    };
  }

  // Moderation actions
  static async moderateUser(data: UserModeration): Promise<void> {
    const { userId, action, reason } = data;

    switch (action) {
      case 'delete':
        // Delete user and cascade to related records
        await db.delete(users).where(eq(users.id, userId));
        break;
      case 'suspend':
      case 'unsuspend':
        // TODO: Implement user suspension when user schema includes suspension fields
        console.log(`${action} user ${userId} with reason: ${reason}`);
        break;
    }
  }

  static async moderateProperty(data: PropertyModeration): Promise<void> {
    const { propertyId, action, reason } = data;

    switch (action) {
      case 'delete':
        await db.delete(properties).where(eq(properties.id, propertyId));
        break;
      case 'approve':
        await db
          .update(properties)
          .set({ status: 'available', isActive: true })
          .where(eq(properties.id, propertyId));
        break;
      case 'reject':
        await db
          .update(properties)
          .set({ status: 'draft', isActive: false })
          .where(eq(properties.id, propertyId));
        break;
    }
  }
}