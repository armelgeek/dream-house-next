import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PropertyWithOwner, PropertySearch } from '../config/property.schema';

interface UsePropertiesResult {
  properties: PropertyWithOwner[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  refetch: () => void;
}

export function useProperties(filters: Partial<PropertySearch> = {}): UsePropertiesResult {
  const [properties, setProperties] = useState<PropertyWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UsePropertiesResult['pagination']>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await axios.get(`/api/v1/properties?${params}`);
      setProperties(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [JSON.stringify(filters)]);

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
  };
}

export function useLatestProperties(limit = 8) {
  const [properties, setProperties] = useState<PropertyWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/v1/properties?limit=${limit}&sortBy=created_at&sortOrder=desc&status=available`);
        setProperties(response.data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch latest properties');
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [limit]);

  return { properties, loading, error };
}