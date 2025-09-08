import React, { useState } from 'react';
import { useFavoriteToggle } from '../../hooks/use-favorites';

interface FavoriteButtonProps {
  propertyId: string;
  isFavorited: boolean;
  onToggle?: (isFavorited: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  isFavorited: initialIsFavorited,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const { toggleFavorite, loading } = useFavoriteToggle();

  const handleToggle = async () => {
    if (loading) return;

    try {
      const newIsFavorited = await toggleFavorite(propertyId);
      setIsFavorited(newIsFavorited);
      onToggle?.(newIsFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Optionally show a toast notification here
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 p-1';
      case 'lg':
        return 'w-12 h-12 p-3';
      default:
        return 'w-8 h-8 p-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${getSizeClasses()}
        ${isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-400'} 
        border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={getIconSize()}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};