import React from 'react';
import { PropertyType } from '../../config/property.schema';

interface PropertyTypeBadgeProps {
  type: PropertyType;
  className?: string;
}

export const PropertyTypeBadge: React.FC<PropertyTypeBadgeProps> = ({ 
  type, 
  className = '' 
}) => {
  const getTypeColor = (type: PropertyType) => {
    switch (type) {
      case 'apartment':
        return 'bg-blue-100 text-blue-800';
      case 'house':
        return 'bg-green-100 text-green-800';
      case 'land':
        return 'bg-yellow-100 text-yellow-800';
      case 'commercial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: PropertyType) => {
    switch (type) {
      case 'apartment':
        return 'Apartment';
      case 'house':
        return 'House';
      case 'land':
        return 'Land';
      case 'commercial':
        return 'Commercial';
      default:
        return type;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)} ${className}`}
    >
      {getTypeLabel(type)}
    </span>
  );
};