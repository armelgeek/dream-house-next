'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertySearchForm } from '@/features/properties/components/molecules/property-search-form';
import { PropertyList } from '@/features/properties/components/organisms/property-list';
import { ViewToggle, type ViewMode } from '@/features/properties/components/atoms/view-toggle';
import { useProperties } from '@/features/properties/hooks/use-properties';
import type { PropertySearch, PropertyType } from '@/features/properties/config/property.schema';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<PropertySearch>(() => {
    const initialFilters: PropertySearch = {
      page: 1,
      limit: 12,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    
    // Parse URL parameters
    const query = searchParams.get('query');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const page = searchParams.get('page');
    
    if (query) initialFilters.query = query;
    if (type) initialFilters.type = type as PropertyType;
    if (location) initialFilters.location = location;
    if (minPrice) initialFilters.minPrice = Number(minPrice);
    if (maxPrice) initialFilters.maxPrice = Number(maxPrice);
    if (bedrooms) initialFilters.bedrooms = Number(bedrooms);
    if (bathrooms) initialFilters.bathrooms = Number(bathrooms);
    if (page) initialFilters.page = Number(page);
    
    return initialFilters;
  });

  // Initialize view mode from URL
  useEffect(() => {
    const view = searchParams.get('view') as ViewMode;
    if (view && ['grid', 'list', 'map'].includes(view)) {
      setViewMode(view);
    }
  }, [searchParams]);

  const { properties, loading, error, pagination } = useProperties(filters);

  // Update URL when filters or view mode change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    
    if (viewMode !== 'grid') {
      params.set('view', viewMode);
    }
    
    const newUrl = `/search?${params.toString()}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, viewMode, router]);

  const handleSearch = (newFilters: PropertySearch) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 on new search
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Search Properties
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find your perfect home with our advanced search filters. Browse thousands of properties for sale and rent.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-600">Available Properties</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Cities Covered</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Verified Listings</div>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Form Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <PropertySearchForm
                onSearch={handleSearch}
                initialFilters={filters}
                className="mb-8 lg:mb-0"
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Results Header */}
            {pagination && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <p className="text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} properties
                </p>
                
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
                  
                  {/* Sort Dropdown - Hide in map view */}
                  {viewMode !== 'map' && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Sort by:</label>
                      <select
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split('-');
                          setFilters({ 
                            ...filters, 
                            sortBy: sortBy as 'price' | 'size' | 'created_at' | 'view_count', 
                            sortOrder: sortOrder as 'asc' | 'desc', 
                            page: 1 
                          });
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-black focus:border-black"
                      >
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="size-desc">Size: Largest First</option>
                        <option value="view_count-desc">Most Popular</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-4xl mb-4">❌</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Error</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            )}

            {/* Results */}
            {!error && (
              <PropertyList 
                properties={properties} 
                loading={loading}
                viewMode={viewMode}
                className="mb-8"
              />
            )}

            {/* Pagination - Hide in map view */}
            {viewMode !== 'map' && pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 border rounded-md ${
                        pageNum === pagination.page
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}