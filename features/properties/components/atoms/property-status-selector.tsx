import React from 'react';
import { usePropertyStatus } from '../../hooks/use-property-status';
import type { PropertyStatus } from '../../config/property.schema';

interface PropertyStatusSelectorProps {
  propertyId: string;
  currentStatus: PropertyStatus;
  onStatusChange?: (status: PropertyStatus) => void;
  disabled?: boolean;
  className?: string;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', emoji: '📝' },
  available: { label: 'Available', color: 'bg-green-100 text-green-800', emoji: '✅' },
  sold: { label: 'Sold', color: 'bg-red-100 text-red-800', emoji: '💰' },
  rented: { label: 'Rented', color: 'bg-blue-100 text-blue-800', emoji: '🏠' },
} as const;

export const PropertyStatusSelector: React.FC<PropertyStatusSelectorProps> = ({
  propertyId,
  currentStatus,
  onStatusChange,
  disabled = false,
  className = '',
}) => {
  const { updateStatus, isUpdating } = usePropertyStatus({
    onSuccess: (status) => {
      onStatusChange?.(status);
    },
  });

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PropertyStatus;
    if (newStatus !== currentStatus && !isUpdating) {
      await updateStatus(propertyId, newStatus);
    }
  };

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={disabled || isUpdating}
        className={`
          appearance-none rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer
          ${currentConfig.color}
          ${disabled || isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        `}
      >
        {Object.entries(statusConfig).map(([status, config]) => (
          <option key={status} value={status}>
            {config.emoji} {config.label}
          </option>
        ))}
      </select>
      
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};