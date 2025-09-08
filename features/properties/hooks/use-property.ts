import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PropertyWithOwner } from '../config/property.schema';

interface UsePropertyResult {
  property: PropertyWithOwner | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProperty(id: string): UsePropertyResult {
  const [property, setProperty] = useState<PropertyWithOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/v1/properties/${id}`);
      setProperty(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Property not found');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
}