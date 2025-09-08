import React, { useState } from 'react';
import { PropertyTypeFilter } from '../atoms/property-type-filter';
import { PriceRangeFilter } from '../atoms/price-range-filter';
import type { PropertySearch, PropertyType } from '../../config/property.schema';

interface PropertySearchFormProps {
  onSearch: (filters: PropertySearch) => void;
  initialFilters?: Partial<PropertySearch>;
  className?: string;
}

export const PropertySearchForm: React.FC<PropertySearchFormProps> = ({
  onSearch,
  initialFilters = {},
  className = ''
}) => {
  const [filters, setFilters] = useState<Partial<PropertySearch>>({
    query: '',
    type: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    location: '',
    ...initialFilters,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters as PropertySearch);
  };

  const handleReset = () => {
    const resetFilters = {
      query: '',
      type: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      location: '',
    };
    setFilters(resetFilters);
    onSearch(resetFilters as PropertySearch);
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search properties..."
            value={filters.query || ''}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City, state, or address"
            value={filters.location || ''}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Property Type */}
        <PropertyTypeFilter
          value={filters.type}
          onChange={(type) => setFilters({ ...filters, type })}
        />

        {/* Price Range */}
        <div className="md:col-span-2">
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={(minPrice) => setFilters({ ...filters, minPrice })}
            onMaxPriceChange={(maxPrice) => setFilters({ ...filters, maxPrice })}
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            value={filters.bedrooms || ''}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <select
            value={filters.bathrooms || ''}
            onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Search Properties
        </button>
      </div>
    </form>
  );
};