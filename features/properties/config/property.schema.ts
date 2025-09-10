import { z } from 'zod';

// Property type enum
export const PropertyType = {
  APARTMENT: 'apartment',
  HOUSE: 'house', 
  LAND: 'land',
  COMMERCIAL: 'commercial'
} as const;

export const PropertyStatus = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RENTED: 'rented',
  DRAFT: 'draft'
} as const;

export const TransactionType = {
  BUY: 'buy',
  SELL: 'sell',
  RENT: 'rent'
} as const;

export type PropertyType = typeof PropertyType[keyof typeof PropertyType];
export type PropertyStatus = typeof PropertyStatus[keyof typeof PropertyStatus];
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

// Property creation schema
export const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  size: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  type: z.enum(['apartment', 'house', 'land', 'commercial']),
  status: z.enum(['available', 'sold', 'rented', 'draft']).default('draft'),
  transactionType: z.enum(['buy', 'sell', 'rent']),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
});

// Property update schema
export const updatePropertySchema = createPropertySchema.partial();

// Property search/filter schema
export const propertySearchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(['apartment', 'house', 'land', 'commercial']).optional(),
  transactionType: z.enum(['buy', 'sell', 'rent']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['available', 'sold', 'rented']).optional(),
  sortBy: z.enum(['price', 'size', 'created_at', 'view_count']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
});

// Property types
export type CreateProperty = z.infer<typeof createPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;
export type PropertySearch = z.infer<typeof propertySearchSchema>;

export interface Property {
  id: string;
  title: string;
  description: string;
  price: string; // decimal stored as string
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
  type: PropertyType;
  status: PropertyStatus;
  transactionType: TransactionType;
  images: string[];
  features: string[];
  isActive: boolean;
  viewCount: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  owner?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  isFavorited?: boolean;
}

export interface PropertyWithOwner extends Property {
  owner: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}