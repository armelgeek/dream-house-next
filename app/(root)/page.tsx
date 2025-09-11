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

      {/* Property Categories Section */}
      <section className="py-16 bg-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Property Type</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect property type that matches your lifestyle and needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/search?type=house" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl text-white">🏠</span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
              <h3 className="text-lg font-semibold text-center group-hover:text-blue-600 transition-colors">Houses</h3>
            </Link>
            
            <Link href="/search?type=apartment" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-4xl text-white">🏢</span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
              <h3 className="text-lg font-semibold text-center group-hover:text-green-600 transition-colors">Apartments</h3>
            </Link>
            
            <Link href="/search?type=villa" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl text-white">🏰</span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
              <h3 className="text-lg font-semibold text-center group-hover:text-purple-600 transition-colors">Villas</h3>
            </Link>
            
            <Link href="/search?type=studio" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-4xl text-white">🏨</span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
              <h3 className="text-lg font-semibold text-center group-hover:text-orange-600 transition-colors">Studios</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Locations Section */}
      <section className="py-16 bg-gray-50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Locations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover properties in the most sought-after neighborhoods
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/search?location=downtown" className="group relative">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🏙️</div>
                    <h3 className="text-xl font-bold">Downtown</h3>
                    <p className="text-sm opacity-90">150+ properties</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
            </Link>
            
            <Link href="/search?location=suburbs" className="group relative">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🌳</div>
                    <h3 className="text-xl font-bold">Suburbs</h3>
                    <p className="text-sm opacity-90">200+ properties</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
            </Link>
            
            <Link href="/search?location=waterfront" className="group relative">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🌊</div>
                    <h3 className="text-xl font-bold">Waterfront</h3>
                    <p className="text-sm opacity-90">75+ properties</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our growing community of property owners, buyers, and renters
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">1000+</div>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">500+</div>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">50+</div>
              <p className="text-gray-600">Verified Agents</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Market Trends
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest property listings, market insights, and exclusive deals delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
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
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;Dream House made finding our family home so easy. The search filters helped us find exactly what we were looking for!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">First-time buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;Excellent service! The messaging feature allowed me to connect directly with sellers. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold">
                  MC
                </div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-500">Property investor</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;As a real estate agent, this platform has helped me reach more clients and showcase properties beautifully.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold">
                  ER
                </div>
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
