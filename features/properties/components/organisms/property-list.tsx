import React from 'react';
import { PropertyCard } from '../molecules/property-card';
import { PropertyListItem } from '../molecules/property-list-item';
import { PropertiesMapView } from '../molecules/properties-map-view';
import type { PropertyWithOwner } from '../../config/property.schema';
import type { ViewMode } from '../atoms/view-toggle';

interface PropertyListProps {
  properties: PropertyWithOwner[];
  loading?: boolean;
  className?: string;
  viewMode?: ViewMode;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  className = '',
  viewMode = 'grid'
}) => {
  if (loading) {
    const LoadingSkeleton = () => {
      if (viewMode === 'map') {
        return <div className="bg-gray-200 animate-pulse rounded-lg h-96"></div>;
      }
      
      if (viewMode === 'list') {
        return (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
            ))}
          </div>
        );
      }
      
      // Grid view loading
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      );
    };

    return (
      <div className={className}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-500">Try adjusting your search criteria to find more properties.</p>
      </div>
    );
  }

  // Map View
  if (viewMode === 'map') {
    return (
      <div className={className}>
        <PropertiesMapView properties={properties} />
      </div>
    );
  }

  // List View
  if (viewMode === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {properties.map((property) => (
          <PropertyListItem key={property.id} property={property} />
        ))}
      </div>
    );
  }

  // Grid View (default)
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};