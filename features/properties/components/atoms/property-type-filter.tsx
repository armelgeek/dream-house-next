import React from 'react';
import { PropertyType, PropertyStatus } from '../../config/property.schema';

interface PropertyTypeFilterProps {
  value?: PropertyType;
  onChange: (value: PropertyType | undefined) => void;
  className?: string;
}

export const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const types = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Property Type
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as PropertyType || undefined)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};