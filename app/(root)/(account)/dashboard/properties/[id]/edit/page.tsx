'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProperty } from '@/features/properties/hooks/use-property';
import { PropertyForm } from '@/features/properties/components/organisms/property-form';
import { Card, CardContent } from '@/components/ui/card';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState<string>('');
  
  useEffect(() => {
    params.then(({ id }) => setPropertyId(id));
  }, [params]);

  const { property, loading, error } = useProperty(propertyId);

  if (loading) {
    return (
      <div className="s mx-auto px-6 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-6 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Go Back
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto px-6 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Not Found</h3>
            <p className="text-gray-600 mb-4">The property you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.</p>
            <button
              onClick={() => router.push('/dashboard/properties')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Properties
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PropertyForm 
      mode="edit" 
      propertyId={propertyId}
      initialData={property}
    />
  );
}