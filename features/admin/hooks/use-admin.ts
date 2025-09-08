import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { 
  AdminStats, 
  UserWithStats, 
  PropertyWithModerationInfo,
  UserModeration,
  PropertyModeration
} from '../config/admin.schema';

// Admin Stats Hook
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      const response = await fetch('/api/v1/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

// Users Management Hooks
export function useAdminUsers(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['admin', 'users', page, limit],
    queryFn: async (): Promise<{
      users: UserWithStats[];
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    }> => {
      const response = await fetch(`/api/v1/admin/users?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
}

export function useModerateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserModeration) => {
      const response = await fetch('/api/v1/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to moderate user');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (error) => {
      console.error('User moderation error:', error);
      toast.error('Failed to moderate user');
    },
  });
}

// Properties Management Hooks
export function useAdminProperties(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['admin', 'properties', page, limit],
    queryFn: async (): Promise<{
      properties: PropertyWithModerationInfo[];
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    }> => {
      const response = await fetch(`/api/v1/admin/properties?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    },
  });
}

export function useModerateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PropertyModeration) => {
      const response = await fetch('/api/v1/admin/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to moderate property');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch properties data
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (error) => {
      console.error('Property moderation error:', error);
      toast.error('Failed to moderate property');
    },
  });
}