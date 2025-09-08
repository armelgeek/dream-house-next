import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PropertyWithOwner } from '@/features/properties/config/property.schema';

interface UseFavoritesResult {
  favorites: PropertyWithOwner[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<PropertyWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/v1/favorites');
      setFavorites(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Please sign in to view favorites');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
}

interface UseFavoriteToggleResult {
  toggleFavorite: (propertyId: string) => Promise<boolean>;
  loading: boolean;
}

export function useFavoriteToggle(): UseFavoriteToggleResult {
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await axios.post('/api/v1/favorites', { propertyId });
      return response.data.isFavorited;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw new Error('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
  };
}