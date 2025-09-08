'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PropertyTypeBadge } from '@/features/properties/components/atoms/property-type-badge';
import { useProperty } from '@/features/properties/hooks/use-property';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { property, loading, error } = useProperty(id);

  if (loading) {
    return (
      <div className="py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
              </div>
              <div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-4xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <Link href="/search" className="text-blue-600 hover:text-blue-700">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price));
  };

  const primaryImage = property.images?.[0] || '/placeholder-property.jpg';

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/search" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Search
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <img
                src={primaryImage}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {property.images.length > 1 && (
              <div className="space-y-4">
                {property.images.slice(1, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                ))}
                {property.images.length > 4 && (
                  <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    +{property.images.length - 4} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <PropertyTypeBadge type={property.type} />
                {property.isFavorited && (
                  <span className="text-red-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 mb-4">📍 {property.location}</p>
              <p className="text-4xl font-bold text-green-600 mb-4">{formatPrice(property.price)}</p>
            </div>

            {/* Property Details */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.size && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">📐</div>
                    <div className="text-sm text-gray-500">Size</div>
                    <div className="font-semibold">{property.size} m²</div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">🛏️</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚿</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-sm text-gray-500">Views</div>
                  <div className="font-semibold">{property.viewCount}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
                🗺️ Interactive map would be here
                <br />
                <small>Integration with Google Maps coming soon</small>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Owner */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {property.owner.image ? (
                    <img 
                      src={property.owner.image} 
                      alt={property.owner.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xl">👤</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{property.owner.name}</div>
                  <div className="text-sm text-gray-500">Property Owner</div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3">
                💬 Send Message
              </button>
              
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                📞 Request Call
              </button>
            </div>

            {/* Favorite Button */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <button 
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  property.isFavorited 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {property.isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}