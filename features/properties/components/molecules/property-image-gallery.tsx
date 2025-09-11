'use client';

import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import './embla.css';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
  variant?: 'grid' | 'carousel' | 'hero';
  maxHeight?: string;
}

export function PropertyImageGallery({ 
  images, 
  title, 
  className, 
  variant = 'grid',
  maxHeight = 'h-48'
}: PropertyImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center'
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const goToSlide = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        'bg-gray-100 rounded-lg flex items-center justify-center text-gray-400',
        variant === 'hero' ? 'h-96' : maxHeight,
        className
      )}>
        <div className="text-center">
          <div className="text-4xl mb-2">🏠</div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={cn('relative', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main image carousel */}
          <div className="lg:col-span-3 relative">
            <div className={cn(
              'relative rounded-lg overflow-hidden transition-all duration-300',
              isExpanded ? 'h-[60vh]' : 'h-96'
            )}>
              <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full">
                  {images.map((image, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                      <Image
                        src={image}
                        alt={`${title} ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 60vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={scrollPrev}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={scrollNext}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Expand button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>

          {/* Thumbnail grid */}
          {images.length > 1 && (
            <div className="space-y-4">
              {images.slice(0, 4).map((image, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative h-28 rounded-lg overflow-hidden cursor-pointer group border-2 transition-all",
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  )}
                  onClick={() => goToSlide(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                </motion.div>
              ))}
              {images.length > 4 && (
                <div 
                  className="h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">+{images.length - 4}</div>
                    <p className="text-sm">more photos</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expanded view with all thumbnails */}
        <AnimatePresence>
          {isExpanded && images.length > 4 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  )}
                  onClick={() => goToSlide(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Image
                    src={image}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'carousel') {
    return (
      <div className={cn('relative', className)}>
        <div className={cn(
          'embla rounded-lg overflow-hidden transition-all duration-300',
          isExpanded ? 'h-80' : maxHeight
        )} ref={emblaRef}>
          <div className="embla__container">
            {images.map((image, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                <div className="relative h-full">
                  <Image
                    src={image}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Expand button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ZoomIn className="w-4 h-4 mr-2" />
          {isExpanded ? 'Collapse' : `${images.length} photos`}
        </Button>

        {/* Thumbnail strip when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex space-x-2 overflow-x-auto pb-2"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  )}
                  onClick={() => goToSlide(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Image
                    src={image}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'relative rounded-lg overflow-hidden transition-all duration-300',
        isExpanded ? 'h-80' : maxHeight
      )}>
        <Image
          src={images[selectedImageIndex]}
          alt={`${title} ${selectedImageIndex + 1}`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
              onClick={() => goToSlide(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
              onClick={() => goToSlide(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image count button */}
        {images.length > 1 && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            {images.length}
          </Button>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                )}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip when expanded */}
      <AnimatePresence>
        {isExpanded && images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                  selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                )}
                onClick={() => setSelectedImageIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image}
                  alt={`${title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}