import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import type { PropertyStatus } from '../config/property.schema';

interface UsePropertyStatusOptions {
  onSuccess?: (status: PropertyStatus) => void;
  onError?: (error: string) => void;
}

export function usePropertyStatus(options: UsePropertyStatusOptions = {}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (propertyId: string, status: PropertyStatus) => {
    try {
      setIsUpdating(true);
      
      const response = await axios.patch(`/api/v1/properties/${propertyId}/status`, {
        status,
      });

      toast.success(`Property status updated to ${status}`);
      options.onSuccess?.(status);
      
      return response.data;
    } catch (error) {
      console.error('Error updating property status:', error);
      
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'Failed to update property status';
      
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatus,
    isUpdating,
  };
}