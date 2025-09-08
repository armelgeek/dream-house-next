import { z } from 'zod';

// User management schemas
export const userModerationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  action: z.enum(['suspend', 'unsuspend', 'delete']),
  reason: z.string().optional(),
});

export const propertyModerationSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  action: z.enum(['approve', 'reject', 'delete']),
  reason: z.string().optional(),
});

// Admin types
export type UserModeration = z.infer<typeof userModerationSchema>;
export type PropertyModeration = z.infer<typeof propertyModerationSchema>;

// User with moderation info
export interface UserWithStats {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Additional stats
  propertyCount: number;
  messageCount: number;
  isSuspended?: boolean;
  isEmailVerified: boolean;
}

// Property with moderation info
export interface PropertyWithModerationInfo {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  status: string;
  images: string[] | null;
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

// Admin dashboard stats
export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalMessages: number;
  activeUsers: number;
  pendingProperties: number;
  recentActivity: {
    newUsers: number;
    newProperties: number;
    newMessages: number;
  };
}