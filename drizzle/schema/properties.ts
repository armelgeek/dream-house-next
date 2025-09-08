import { sql } from 'drizzle-orm';
import { boolean, decimal, integer, json, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './auth';

// Property type enum
export const propertyTypeEnum = pgEnum('property_type', ['apartment', 'house', 'land', 'commercial']);

// Property status enum  
export const propertyStatusEnum = pgEnum('property_status', ['available', 'sold', 'rented', 'draft']);

export const properties = pgTable('properties', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  size: integer('size'), // in square meters
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  location: text('location').notNull(),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  zipCode: text('zip_code'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  type: propertyTypeEnum('type').notNull(),
  status: propertyStatusEnum('status').notNull().default('draft'),
  images: json('images').$type<string[]>().default([]), // Array of image URLs
  features: json('features').$type<string[]>().default([]), // Array of feature strings
  isActive: boolean('is_active').notNull().default(true),
  viewCount: integer('view_count').notNull().default(0),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export const favorites = pgTable('favorites', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  propertyId: text('property_id')
    .notNull()
    .references(() => properties.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
});

export const messages = pgTable('messages', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  senderId: text('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recipientId: text('recipient_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  propertyId: text('property_id')
    .references(() => properties.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});