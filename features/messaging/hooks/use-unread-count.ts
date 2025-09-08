import { useQuery } from '@tanstack/react-query';

interface UseUnreadCountResult {
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export function useUnreadCount(): UseUnreadCountResult {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async (): Promise<{ unreadCount: number }> => {
      const response = await fetch('/api/v1/messages/unread-count');
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    unreadCount: data?.unreadCount || 0,
    loading,
    error: error?.message || null,
  };
}