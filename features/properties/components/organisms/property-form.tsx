'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { createPropertySchema, updatePropertySchema, type CreateProperty, type Property } from '../../config/property.schema';
import { PropertyImageUpload } from '../atoms/property-image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import axios from 'axios';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  mode: 'create' | 'edit';
  propertyId?: string;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  mode,
  propertyId,
}) => {
  const router = useRouter();

  const handleSubmit = async (values: CreateProperty) => {
    try {
      if (mode === 'create') {
        await axios.post('/api/v1/properties', values);
        toast.success('Property created successfully!');
        router.push('/dashboard/properties');
      } else if (mode === 'edit' && propertyId) {
        await axios.put(`/api/v1/properties/${propertyId}`, values);
        toast.success('Property updated successfully!');
        router.push('/dashboard/properties');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(`Failed to ${mode} property`);
      }
      throw error;
    }
  };

  const { form, handleSubmit: handleFormSubmit, isSubmitting, errors } = useFormHandler<CreateProperty>({
    schema: createPropertySchema as any, // Type assertion to resolve the schema type conflict
    initialValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price ? parseFloat(initialData.price) : 0,
      size: initialData?.size || undefined,
      bedrooms: initialData?.bedrooms || undefined,
      bathrooms: initialData?.bathrooms || undefined,
      location: initialData?.location || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || '',
      zipCode: initialData?.zipCode || '',
      latitude: initialData?.latitude ? parseFloat(initialData.latitude) : undefined,
      longitude: initialData?.longitude ? parseFloat(initialData.longitude) : undefined,
      type: initialData?.type || 'apartment',
      status: initialData?.status || 'draft',
      transactionType: initialData?.transactionType || 'buy',
      images: initialData?.images || [],
      features: initialData?.features || [],
    },
    onSubmit: handleSubmit,
  });

  const { register, watch, setValue } = form;
  const watchedType = watch('type');
  const watchedStatus = watch('status');
  const watchedTransactionType = watch('transactionType');

  return (
    <div className="mx-auto px-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {mode === 'create' ? 'Add New Property' : 'Edit Property'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Beautiful apartment in downtown"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="250000"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your property..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Property Type *</Label>
                  <Select
                    value={watchedType}
                    onValueChange={(value) => setValue('type', value as any)}
                  >
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <Label>Transaction Type *</Label>
                  <Select
                    value={watchedTransactionType}
                    onValueChange={(value) => setValue('transactionType', value as any)}
                  >
                    <SelectTrigger className={errors.transactionType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.transactionType && (
                    <p className="text-red-500 text-sm mt-1">{errors.transactionType.message}</p>
                  )}
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={watchedStatus}
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="size">Size (sq meters)</Label>
                  <Input
                    id="size"
                    type="number"
                    {...register('size', { valueAsNumber: true })}
                    placeholder="120"
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    {...register('bedrooms', { valueAsNumber: true })}
                    placeholder="3"
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    {...register('bathrooms', { valueAsNumber: true })}
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Downtown Paris"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="Île-de-France"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register('country')}
                    placeholder="France"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    {...register('zipCode')}
                    placeholder="75001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    {...register('latitude', { valueAsNumber: true })}
                    placeholder="48.8566"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    {...register('longitude', { valueAsNumber: true })}
                    placeholder="2.3522"
                  />
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Images</h3>
              <PropertyImageUpload
                name="images"
                control={form.control}
                description="Upload high-quality images of your property. The first image will be the main photo."
                maxImages={10}
                onUploadComplete={(urls) => {
                  console.log('Uploaded images:', urls);
                }}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting 
                  ? `${mode === 'create' ? 'Creating' : 'Updating'}...`
                  : `${mode === 'create' ? 'Create' : 'Update'} Property`
                }
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};