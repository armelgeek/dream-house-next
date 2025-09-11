import React from 'react';
import Link from 'next/link';
import { PropertyTypeBadge } from '../atoms/property-type-badge';
import { TransactionTypeBadge } from '../atoms/transaction-type-badge';
import { FavoriteButton } from '@/features/favorites/components/atoms/favorite-button';
import { PropertyImageGallery } from './property-image-gallery';
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
          <PropertyImageGallery 
            images={property.images}
            title={property.title}
            variant="grid"
            maxHeight="h-48"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <PropertyTypeBadge type={property.type} />
            {property.transactionType && (
              <TransactionTypeBadge transactionType={property.transactionType} />
            )}
          </div>
          <div className="absolute top-2 right-2">
            <FavoriteButton
              propertyId={property.id}
              isFavorited={property.isFavorited || false}
              size="sm"
            />
          </div>
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