import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PropertyTypeBadge } from '../atoms/property-type-badge';
import { TransactionTypeBadge } from '../atoms/transaction-type-badge';
import { FavoriteButton } from '@/features/favorites/components/atoms/favorite-button';
import { PropertyImageGallery } from './property-image-gallery';
import type { PropertyWithOwner } from '../../config/property.schema';

interface PropertyListItemProps {
  property: PropertyWithOwner;
  className?: string;
}

export const PropertyListItem: React.FC<PropertyListItemProps> = ({
  property,
  className = '',
}) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price));
  };

  const primaryImage = property.images?.[0] || '/placeholder-property.jpg';

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <Link href={`/properties/${property.id}`} className="flex-shrink-0">
          <div className="w-full sm:w-64">
            <PropertyImageGallery 
              images={property.images}
              title={property.title}
              variant="carousel"
              maxHeight="h-48 sm:h-32"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              <PropertyTypeBadge type={property.type} />
              {property.transactionType && (
                <TransactionTypeBadge transactionType={property.transactionType} />
              )}
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link href={`/properties/${property.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-black transition-colors truncate">
                  {property.title}
                </h3>
              </Link>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-1">📍</span>
                <span className="truncate">{property.location}</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {property.description}
              </p>

              {/* Property Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                {property.size && (
                  <span className="flex items-center">
                    <span className="mr-1">📐</span>
                    {property.size} m²
                  </span>
                )}
                {property.bedrooms && (
                  <span className="flex items-center">
                    <span className="mr-1">🛏️</span>
                    {property.bedrooms}
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center">
                    <span className="mr-1">🚿</span>
                    {property.bathrooms}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                by {property.owner.name}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatPrice(property.price)}
              </div>
              <FavoriteButton
                propertyId={property.id}
                isFavorited={property.isFavorited || false}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};