import React from 'react';
import Link from 'next/link';
import { PropertyTypeBadge } from '../atoms/property-type-badge';
import type { PropertyWithOwner } from '../../config/property.schema';

interface PropertyCardProps {
  property: PropertyWithOwner;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  className = '' 
}) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price));
  };

  const primaryImage = property.images?.[0] || '/placeholder-property.jpg';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2">
            <PropertyTypeBadge type={property.type} />
          </div>
          {property.isFavorited && (
            <div className="absolute top-2 right-2">
              <div className="bg-red-500 text-white p-1 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-black transition-colors">
            {property.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(property.price)}
          </span>
          <div className="text-sm text-gray-500">
            📍 {property.location}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {property.size && (
              <span>📐 {property.size} m²</span>
            )}
            {property.bedrooms && (
              <span>🛏️ {property.bedrooms}</span>
            )}
            {property.bathrooms && (
              <span>🚿 {property.bathrooms}</span>
            )}
          </div>
          <div className="text-xs">
            by {property.owner.name}
          </div>
        </div>
      </div>
    </div>
  );
};