'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { PropertyList } from '@/features/properties/components/organisms/property-list';

export default function FavoritesPage() {
  const { favorites, loading, error } = useFavorites();

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">Properties you&apos;ve saved for later</p>
        </div>

        {error && error.includes('sign in') ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-4">Please sign in to view your favorites</p>
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Sign In →
            </Link>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <>
            {favorites.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-4">Start browsing properties and save your favorites</p>
                <Link href="/search" className="text-blue-600 hover:text-blue-700">
                  Browse Properties →
                </Link>
              </div>
            )}
            
            <PropertyList 
              properties={favorites} 
              loading={loading}
              viewMode="list"
            />
          </>
        )}
      </div>
    </div>
  );
}