'use client';

import Hero from '@/shared/components/atoms/hero';
import { PropertyList } from '@/features/properties/components/organisms/property-list';
import { useLatestProperties } from '@/features/properties/hooks/use-properties';
import Link from 'next/link';

export default function Home() {
  const { properties, loading, error } = useLatestProperties(8);

  return (
    <>
      <Hero showSearch={false} />
      
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

      {/* Statistics Section */}
      <section className="py-16 bg-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600">Verified Agents</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who found their perfect homes with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;Dream House made finding our family home so easy. The search filters helped us find exactly what we were looking for!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">First-time buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;Excellent service! The messaging feature allowed me to connect directly with sellers. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-500">Property investor</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;As a real estate agent, this platform has helped me reach more clients and showcase properties beautifully.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Emma Rodriguez</p>
                  <p className="text-sm text-gray-500">Real Estate Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of happy clients who found their perfect property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Properties
            </Link>
            <Link
              href="/dashboard/properties/new"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
