'use client';

import React, { useEffect } from 'react';
import { FieldValues, useController, UseControllerProps, PathValue, Path } from 'react-hook-form';
import { UploadButton } from '@uploadthing/react';
import { X, Image as ImageIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { OurFileRouter } from '@/app/api/uploadthing/core';

interface PropertyImageUploadProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
  label?: string;
  description?: string;
  onUploadComplete?: (urls: string[]) => void;
  maxImages?: number;
}

export function PropertyImageUpload<T extends FieldValues = FieldValues>({ 
  name, 
  label = "Property Images", 
  description = "Upload up to 10 high-quality images of your property. Drag to reorder.", 
  control, 
  defaultValue, 
  onUploadComplete,
  maxImages = 10 
}: PropertyImageUploadProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue: (defaultValue || []) as PathValue<T, Path<T>>,
  });

  const ensureValidArray = () => {
    if (!field.value) {
      field.onChange([]);
      return;
    }
    
    if (Array.isArray(field.value)) {
      const validUrls = field.value.filter((url: string) => url && typeof url === 'string');
      if (validUrls.length !== field.value.length) {
        field.onChange(validUrls);
      }
    } else {
      field.onChange([]);
    }
  };

  useEffect(() => {
    ensureValidArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res?.length > 0) {
      const currentValue = Array.isArray(field.value) ? field.value : [];
      const newUrls = [...currentValue, ...res.map(r => r.url)];
      field.onChange(newUrls);
      onUploadComplete?.(newUrls);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Property image upload error:', error);
  };

  const handleRemoveImage = (index: number) => {
    if (!Array.isArray(field.value)) {
      return;
    }
    
    const newUrls = [...field.value];
    newUrls.splice(index, 1);
    field.onChange(newUrls);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (!Array.isArray(field.value)) {
      return;
    }

    const items = Array.from(field.value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    field.onChange(items);
  };

  const images = Array.isArray(field.value) ? field.value : [];

  return (
    <FormItem className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {label}
        </FormLabel>
        {images.length > 0 && (
          <span className="text-sm text-gray-500">{images.length}/{maxImages} images</span>
        )}
      </div>

      <div className="space-y-4">
        {/* Image Grid */}
        {images.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="property-images" direction="horizontal">
              {(provided: any) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {images.map((url: string, index: number) => (
                    <Draggable key={url || `image-${index}`} draggableId={url || `image-${index}`} index={index}>
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative group aspect-square ${
                            snapshot.isDragging ? 'z-50 shadow-2xl' : ''
                          }`}
                        >
                          <div className="relative w-full h-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                            <img
                              src={url}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {/* Primary image indicator */}
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                Primary
                              </div>
                            )}
                            {/* Remove button */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {/* Drag indicator */}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs text-center py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Drag to reorder
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Upload Button */}
        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
            <FormControl>
              <div className="flex flex-col items-center justify-center text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                <UploadButton<OurFileRouter, 'propertyImages'>
                  endpoint="propertyImages"
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:transition-colors ut-button:rounded-md ut-button:px-6 ut-button:py-3"
                />
                <FormDescription className="mt-4 text-sm text-gray-500">
                  {description}
                </FormDescription>
              </div>
            </FormControl>
          </div>
        )}

        {/* Tips */}
        {images.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Photography Tips:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• The first image will be the primary image shown in search results</li>
              <li>• Use high-resolution images (max 4MB each)</li>
              <li>• Include photos of all rooms, exterior, and key features</li>
              <li>• Ensure good lighting and clean, uncluttered spaces</li>
            </ul>
          </div>
        )}
      </div>

      {fieldState.error?.message && (
        <FormMessage className="text-sm font-medium text-red-500">
          {fieldState.error.message}
        </FormMessage>
      )}
    </FormItem>
  );
}