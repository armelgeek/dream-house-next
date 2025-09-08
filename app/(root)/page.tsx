'use client';

import Hero from '@/shared/components/atoms/hero';
import { PropertyList } from '@/features/properties/components/organisms/property-list';
import { useLatestProperties } from '@/features/properties/hooks/use-properties';
import Link from 'next/link';

export default function Home() {
  const { properties, loading, error } = useLatestProperties(8);

  return (
    <>
      <Hero />
      
      {/* Latest Properties Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Properties</h2>
              <p className="text-gray-600">Discover the newest listings in our platform</p>
            </div>
            <Link 
              href="/search"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all properties →
            </Link>
          </div>
          
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">❌</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <PropertyList 
              properties={properties} 
              loading={loading}
              className="mb-8"
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Dream House?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make buying, selling, and renting properties simple and transparent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">Find properties with advanced filters and location-based search</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Messaging</h3>
              <p className="text-gray-600">Connect directly with property owners and agents</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="text-gray-600">Bookmark properties and track them easily</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
