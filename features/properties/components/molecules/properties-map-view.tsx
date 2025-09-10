import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PropertyCard } from './property-card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { PropertyWithOwner } from '../../config/property.schema';

interface PropertiesMapViewProps {
  properties: PropertyWithOwner[];
  className?: string;
}

export const PropertiesMapView: React.FC<PropertiesMapViewProps> = ({
  properties,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithOwner | null>(null);

  // Filter properties that have valid coordinates
  const propertiesWithCoords = properties.filter(
    (property) => 
      property.latitude && 
      property.longitude && 
      !isNaN(Number(property.latitude)) && 
      !isNaN(Number(property.longitude))
  );

  useEffect(() => {
    if (!mapRef.current || propertiesWithCoords.length === 0) return;

    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Calculate center point of all properties
    const lats = propertiesWithCoords.map(p => Number(p.latitude));
    const lngs = propertiesWithCoords.map(p => Number(p.longitude));
    
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    // Create a simple map grid
    const zoom = propertiesWithCoords.length === 1 ? 15 : 12;
    const tileSize = 256;
    
    const x = Math.floor((centerLng + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Create a grid of tiles (5x5 for better coverage)
    const tilesPerRow = 5;
    const tilesPerCol = 5;
    const centerTileX = x;
    const centerTileY = y;
    
    mapContainer.style.display = 'grid';
    mapContainer.style.gridTemplateColumns = `repeat(${tilesPerRow}, 1fr)`;
    mapContainer.style.gridTemplateRows = `repeat(${tilesPerCol}, 1fr)`;
    mapContainer.style.position = 'relative';
    mapContainer.style.overflow = 'hidden';

    // Add map tiles
    for (let row = 0; row < tilesPerCol; row++) {
      for (let col = 0; col < tilesPerRow; col++) {
        const tileX = centerTileX - 2 + col;
        const tileY = centerTileY - 2 + row;
        
        const tile = document.createElement('img');
        tile.src = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
        tile.style.width = '100%';
        tile.style.height = '100%';
        tile.style.objectFit = 'cover';
        tile.alt = 'Map tile';
        
        mapContainer.appendChild(tile);
      }
    }

    // Add property markers
    propertiesWithCoords.forEach((property, index) => {
      const lat = Number(property.latitude);
      const lng = Number(property.longitude);

      // Calculate marker position relative to center
      const latDiff = lat - centerLat;
      const lngDiff = lng - centerLng;
      
      // Convert to percentage position (rough approximation)
      const pixelsPerDegree = 100; // Rough approximation for display
      const topPercent = 50 - (latDiff * pixelsPerDegree);
      const leftPercent = 50 + (lngDiff * pixelsPerDegree);

      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.top = `${Math.max(5, Math.min(95, topPercent))}%`;
      marker.style.left = `${Math.max(5, Math.min(95, leftPercent))}%`;
      marker.style.transform = 'translate(-50%, -100%)';
      marker.style.zIndex = '10';
      marker.style.cursor = 'pointer';
      
      const formatPrice = (price: string) => {
        const num = Number(price);
        if (num >= 1000000) {
          return `$${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
          return `$${(num / 1000).toFixed(0)}K`;
        }
        return `$${num.toLocaleString()}`;
      };

      marker.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg whitespace-nowrap mb-1">
            ${formatPrice(property.price)}
          </div>
          <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      `;
      
      marker.addEventListener('click', () => {
        setSelectedProperty(property);
      });
      
      mapContainer.appendChild(marker);
    });

  }, [propertiesWithCoords]);

  if (propertiesWithCoords.length === 0) {
    return (
      <Card className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Map Data Available</h3>
        <p className="text-gray-500">
          Properties don't have location coordinates for map display.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Card className="relative overflow-hidden" style={{ height: '600px' }}>
        <div ref={mapRef} className="w-full h-full">
          {/* Map tiles and markers will be inserted here */}
        </div>
        
        <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
          © OpenStreetMap contributors
        </div>

        <div className="absolute top-2 right-2 bg-white px-3 py-2 rounded-md shadow text-sm">
          {propertiesWithCoords.length} propert{propertiesWithCoords.length === 1 ? 'y' : 'ies'} shown
        </div>
      </Card>

      {/* Property Details Popup */}
      {selectedProperty && (
        <div className="absolute top-4 left-4 z-20 w-80">
          <Card className="p-4 shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-sm">Property Details</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProperty(null)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <PropertyCard property={selectedProperty} className="shadow-none border-0" />
          </Card>
        </div>
      )}
    </div>
  );
};