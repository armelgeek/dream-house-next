'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PropertyMapProps {
  latitude?: number | string;
  longitude?: number | string;
  address?: string;
  title: string;
  className?: string;
  height?: string;
}

export function PropertyMap({ 
  latitude, 
  longitude, 
  address, 
  title, 
  className,
  height = 'h-64'
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Convert string coordinates to numbers if needed
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

  // For now, we'll create a simple static map using OpenStreetMap tiles
  // In a production app, you'd use Google Maps, Mapbox, or another service
  const hasValidCoordinates = lat && lng && !isNaN(lat) && !isNaN(lng);

  useEffect(() => {
    if (!hasValidCoordinates || !mapRef.current) return;

    // Create a simple map using Leaflet-style tile display
    // This is a simplified version - you would typically use a proper map library
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Calculate tile coordinates for the given lat/lng
    const zoom = 15;
    const tileSize = 256;
    
    const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Create a grid of tiles
    const tilesPerRow = 3;
    const tilesPerCol = 3;
    const centerTileX = x;
    const centerTileY = y;
    
    mapContainer.style.display = 'grid';
    mapContainer.style.gridTemplateColumns = `repeat(${tilesPerRow}, 1fr)`;
    mapContainer.style.gridTemplateRows = `repeat(${tilesPerCol}, 1fr)`;
    mapContainer.style.position = 'relative';
    mapContainer.style.overflow = 'hidden';

    for (let row = 0; row < tilesPerCol; row++) {
      for (let col = 0; col < tilesPerRow; col++) {
        const tileX = centerTileX - 1 + col;
        const tileY = centerTileY - 1 + row;
        
        const tile = document.createElement('img');
        tile.src = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
        tile.style.width = '100%';
        tile.style.height = '100%';
        tile.style.objectFit = 'cover';
        tile.alt = 'Map tile';
        
        mapContainer.appendChild(tile);
      }
    }

    // Add a marker in the center
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.top = '50%';
    marker.style.left = '50%';
    marker.style.transform = 'translate(-50%, -100%)';
    marker.style.zIndex = '10';
    marker.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
      </div>
    `;
    mapContainer.appendChild(marker);

  }, [hasValidCoordinates, lat, lng]);

  if (!hasValidCoordinates) {
    return (
      <Card className={cn('p-6 text-center', height, className)}>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <MapPin className="w-12 h-12 mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">Location Not Available</h3>
          <p className="text-sm">
            {address ? `Address: ${address}` : 'No location data available for this property'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Property Location</h3>
            {address && (
              <p className="text-sm text-muted-foreground">{address}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className={cn('relative', height)} ref={mapRef}>
        {/* Map tiles will be inserted here */}
      </div>
      
      <div className="p-3 text-xs text-muted-foreground border-t">
        © OpenStreetMap contributors
      </div>
    </Card>
  );
}

// Enhanced version that could use a proper map library
export function PropertyMapAdvanced({ 
  latitude, 
  longitude, 
  address, 
  title, 
  className,
  height = 'h-64' 
}: PropertyMapProps) {
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  const hasValidCoordinates = lat && lng && !isNaN(lat) && !isNaN(lng);

  if (!hasValidCoordinates) {
    return (
      <Card className={cn('p-6 text-center', height, className)}>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <MapPin className="w-12 h-12 mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">Location Not Available</h3>
          <p className="text-sm">
            {address ? `Address: ${address}` : 'No location data available for this property'}
          </p>
        </div>
      </Card>
    );
  }

  // Generate a static map URL using a service like Google Static Maps or Mapbox
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-building+FF0000(${lng},${lat})/${lng},${lat},15,0/600x400@2x?access_token=your_mapbox_token`;
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Property Location</h3>
            {address && (
              <p className="text-sm text-muted-foreground">{address}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className={cn('relative bg-gray-100', height)}>
        {/* Placeholder for actual map implementation */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <p className="text-sm">Interactive map would be here</p>
            <p className="text-xs mt-1">Coordinates: {lat}, {lng}</p>
          </div>
        </div>
      </div>
      
      <div className="p-3 text-xs text-muted-foreground border-t">
        Map data would be provided by mapping service
      </div>
    </Card>
  );
}