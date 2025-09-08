import { db } from '@/drizzle/db';
import { favorites, properties, users } from '@/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { PropertyWithOwner } from '@/features/properties/config/property.schema';

export class FavoriteService {
  static async toggle(userId: string, propertyId: string): Promise<{ isFavorited: boolean }> {
    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)))
      .limit(1);

    if (existing.length > 0) {
      // Remove from favorites
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
      
      return { isFavorited: false };
    } else {
      // Add to favorites
      await db
        .insert(favorites)
        .values({ userId, propertyId });
      
      return { isFavorited: true };
    }
  }

  static async getUserFavorites(userId: string): Promise<PropertyWithOwner[]> {
    const result = await db
      .select({
        property: properties,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        favoriteCreatedAt: favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(properties, eq(favorites.propertyId, properties.id))
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return result.map(({ property, owner }) => ({
      ...this.mapToProperty(property),
      owner: owner!,
      isFavorited: true,
    }));
  }

  static async isFavorited(userId: string, propertyId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)))
      .limit(1);

    return result.length > 0;
  }

  private static mapToProperty(property: any) {
    return {
      ...property,
      price: property.price.toString(),
      images: property.images || [],
      features: property.features || [],
    };
  }
}