'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyManagementTable } from '@/features/admin/components/organisms/property-management-table';
import { useAdminProperties, useModerateProperty } from '@/features/admin/hooks/use-admin';

export default function PropertiesManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  
  const { data, isLoading, error } = useAdminProperties(currentPage, limit);
  const moderatePropertyMutation = useModerateProperty();

  const handlePreviousPage = () => {
    if (data?.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You don&apos;t have permission to access property management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
        <p className="text-muted-foreground">
          Moderate property listings and manage content quality
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
          {data && (
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data.total)} of {data.total} properties
            </p>
          )}
        </CardHeader>
        <CardContent>
          <PropertyManagementTable
            properties={data?.properties || []}
            loading={isLoading}
            onModerateProperty={moderatePropertyMutation.mutateAsync}
          />
          
          {data && data.total > limit && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={!data.hasPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {currentPage}
              </span>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!data.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}