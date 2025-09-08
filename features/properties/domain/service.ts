import { db } from '@/drizzle/db';
import { properties, users, favorites } from '@/drizzle/schema';
import { eq, and, or, ilike, gte, lte, desc, asc, count, sql } from 'drizzle-orm';
import type { CreateProperty, UpdateProperty, PropertySearch, Property, PropertyWithOwner } from '../config/property.schema';

export class PropertyService {
  static async create(data: CreateProperty & { ownerId: string }): Promise<Property> {
    const [property] = await db
      .insert(properties)
      .values({
        ...data,
        price: data.price.toString(),
      })
      .returning();

    return this.mapToProperty(property);
  }

  static async findById(id: string, userId?: string): Promise<PropertyWithOwner | null> {
    const result = await db
      .select({
        property: properties,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        isFavorited: userId ? 
          sql<boolean>`EXISTS(
            SELECT 1 FROM ${favorites} 
            WHERE ${favorites.userId} = ${userId} 
            AND ${favorites.propertyId} = ${properties.id}
          )` : sql<boolean>`false`,
      })
      .from(properties)
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(eq(properties.id, id))
      .limit(1);

    if (!result[0]) return null;

    const { property, owner, isFavorited } = result[0];
    
    return {
      ...this.mapToProperty(property),
      owner: owner!,
      isFavorited,
    };
  }

  static async search(filters: PropertySearch, userId?: string) {
    const { page, limit, sortBy, sortOrder, ...searchFilters } = filters;
    
    // Build where conditions
    const conditions = [eq(properties.isActive, true)];
    
    if (searchFilters.query) {
      conditions.push(
        or(
          ilike(properties.title, `%${searchFilters.query}%`),
          ilike(properties.description, `%${searchFilters.query}%`),
          ilike(properties.location, `%${searchFilters.query}%`)
        )!
      );
    }

    if (searchFilters.type) {
      conditions.push(eq(properties.type, searchFilters.type));
    }

    if (searchFilters.status) {
      conditions.push(eq(properties.status, searchFilters.status));
    }

    if (searchFilters.minPrice !== undefined) {
      conditions.push(gte(properties.price, searchFilters.minPrice.toString()));
    }

    if (searchFilters.maxPrice !== undefined) {
      conditions.push(lte(properties.price, searchFilters.maxPrice.toString()));
    }

    if (searchFilters.minSize !== undefined) {
      conditions.push(gte(properties.size, searchFilters.minSize));
    }

    if (searchFilters.maxSize !== undefined) {
      conditions.push(lte(properties.size, searchFilters.maxSize));
    }

    if (searchFilters.bedrooms !== undefined) {
      conditions.push(eq(properties.bedrooms, searchFilters.bedrooms));
    }

    if (searchFilters.bathrooms !== undefined) {
      conditions.push(eq(properties.bathrooms, searchFilters.bathrooms));
    }

    if (searchFilters.location) {
      conditions.push(ilike(properties.location, `%${searchFilters.location}%`));
    }

    if (searchFilters.city) {
      conditions.push(ilike(properties.city, `%${searchFilters.city}%`));
    }

    const whereClause = and(...conditions);

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(properties)
      .where(whereClause);

    // Build order by
    const orderColumn = properties[sortBy as keyof typeof properties];
    const orderBy = sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

    // Get paginated results
    const offset = (page - 1) * limit;
    
    const results = await db
      .select({
        property: properties,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        isFavorited: userId ? 
          sql<boolean>`EXISTS(
            SELECT 1 FROM ${favorites} 
            WHERE ${favorites.userId} = ${userId} 
            AND ${favorites.propertyId} = ${properties.id}
          )` : sql<boolean>`false`,
      })
      .from(properties)
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const items = results.map(({ property, owner, isFavorited }) => ({
      ...this.mapToProperty(property),
      owner: owner!,
      isFavorited,
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  static async findByOwner(ownerId: string): Promise<Property[]> {
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId))
      .orderBy(desc(properties.createdAt));

    return result.map(this.mapToProperty);
  }

  static async update(id: string, data: UpdateProperty, ownerId: string): Promise<Property | null> {
    const updateData = { ...data };
    if (data.price !== undefined) {
      updateData.price = data.price.toString();
    }

    const [property] = await db
      .update(properties)
      .set({
        ...updateData,
        updatedAt: sql`now()`,
      })
      .where(and(eq(properties.id, id), eq(properties.ownerId, ownerId)))
      .returning();

    if (!property) return null;
    return this.mapToProperty(property);
  }

  static async delete(id: string, ownerId: string): Promise<boolean> {
    const result = await db
      .delete(properties)
      .where(and(eq(properties.id, id), eq(properties.ownerId, ownerId)))
      .returning({ id: properties.id });

    return result.length > 0;
  }

  static async incrementViewCount(id: string): Promise<void> {
    await db
      .update(properties)
      .set({
        viewCount: sql`${properties.viewCount} + 1`,
      })
      .where(eq(properties.id, id));
  }

  static async getLatest(limit = 8): Promise<PropertyWithOwner[]> {
    const results = await db
      .select({
        property: properties,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(properties)
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(and(eq(properties.isActive, true), eq(properties.status, 'available')))
      .orderBy(desc(properties.createdAt))
      .limit(limit);

    return results.map(({ property, owner }) => ({
      ...this.mapToProperty(property),
      owner: owner!,
    }));
  }

  private static mapToProperty(property: any): Property {
    return {
      ...property,
      price: property.price.toString(),
      images: property.images || [],
      features: property.features || [],
    };
  }
}