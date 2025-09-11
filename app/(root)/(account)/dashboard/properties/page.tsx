'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { PropertyListItem } from '@/features/properties/components/molecules/property-list-item';
import { PropertyStatusSelector } from '@/features/properties/components/atoms/property-status-selector';
import type { Property, PropertyWithOwner, PropertyStatus } from '@/features/properties/config/property.schema';
import { toast } from 'sonner';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll use the regular properties API and filter on the server side
      // In a real app, we'd create a dedicated endpoint for user's properties
      const response = await axios.get('/api/v1/properties?owner=me');
      setProperties(response.data.items || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Please sign in to view your properties');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    // Update the local state to reflect the change
    setProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? { ...property, status: newStatus }
          : property
      )
    );
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingPropertyId(propertyId);
      await axios.delete(`/api/v1/properties/${propertyId}`);
      
      // Remove the property from the local state
      setProperties(prev => prev.filter(property => property.id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete property');
      }
    } finally {
      setDeletingPropertyId(null);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  if (loading) {
    return (
      <div className="py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Add Property
          </Link>
        </div>

        {error && error.includes('sign in') ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-4">Please sign in to view your properties</p>
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
            {properties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-4">Create your first property listing to get started</p>
                <Link
                  href="/dashboard/properties/new"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  + Add Property
                </Link>
              </div>
            )}
            
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyListItem property={property as PropertyWithOwner} />
                  
                  {/* Action buttons - positioned at the top right */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <PropertyStatusSelector
                      propertyId={property.id}
                      currentStatus={property.status}
                      onStatusChange={(newStatus) => handleStatusChange(property.id, newStatus)}
                    />
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                    >
                      ✏️
                    </Link>
                    <button 
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={deletingPropertyId === property.id}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingPropertyId === property.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}