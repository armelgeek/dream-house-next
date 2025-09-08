import React from 'react';

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  className?: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Price Range
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min price"
          value={minPrice || ''}
          onChange={(e) => onMinPriceChange(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice || ''}
          onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
        />
      </div>
    </div>
  );
};