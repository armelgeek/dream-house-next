'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';
import './embla.css';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
  variant?: 'grid' | 'carousel' | 'hero';
}

export function PropertyImageGallery({ 
  images, 
  title, 
  className, 
  variant = 'grid' 
}: PropertyImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollLightboxPrev = useCallback(() => {
    if (lightboxApi) lightboxApi.scrollPrev();
  }, [lightboxApi]);

  const scrollLightboxNext = useCallback(() => {
    if (lightboxApi) lightboxApi.scrollNext();
  }, [lightboxApi]);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
    // Scroll to selected image in lightbox after a brief delay
    setTimeout(() => {
      if (lightboxApi) lightboxApi.scrollTo(index);
    }, 100);
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        'bg-gray-100 rounded-lg flex items-center justify-center text-gray-400',
        variant === 'hero' ? 'h-96' : 'h-48',
        className
      )}>
        <div className="text-center">
          <div className="text-4xl mb-2">🏠</div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const primaryImage = images[0];

  if (variant === 'hero') {
    return (
      <div className={cn('relative', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main image */}
          <div className="lg:col-span-3 relative">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={primaryImage}
                alt={title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 60vw"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => openLightbox(0)}
              >
                <Expand className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
            </div>
          </div>

          {/* Thumbnail grid */}
          {images.length > 1 && (
            <div className="space-y-4">
              {images.slice(1, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative h-28 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index + 1)}
                >
                  <Image
                    src={image}
                    alt={`${title} ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
              ))}
              {images.length > 4 && (
                <div 
                  className="h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => openLightbox(4)}
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

        {/* Lightbox */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
            <div className="relative h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="embla h-full" ref={lightboxRef}>
                <div className="embla__container h-full">
                  {images.map((image, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                      <Image
                        src={image}
                        alt={`${title} ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={scrollLightboxPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={scrollLightboxNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (variant === 'carousel') {
    return (
      <div className={cn('relative', className)}>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {images.map((image, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                <div className="relative h-64 rounded-lg overflow-hidden">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={scrollNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4"
          onClick={() => openLightbox(0)}
        >
          <Expand className="w-4 h-4 mr-2" />
          View All
        </Button>

        {/* Lightbox */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
            <div className="relative h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="embla h-full" ref={lightboxRef}>
                <div className="embla__container h-full">
                  {images.map((image, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                      <Image
                        src={image}
                        alt={`${title} ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={scrollLightboxPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={scrollLightboxNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={cn('grid gap-2', className)}>
      <div className="relative">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src={primaryImage}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {images.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => openLightbox(0)}
            >
              <Expand className="w-4 h-4 mr-1" />
              {images.length}
            </Button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="embla h-full" ref={lightboxRef}>
              <div className="embla__container h-full">
                {images.map((image, index) => (
                  <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                    <Image
                      src={image}
                      alt={`${title} ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={scrollLightboxPrev}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={scrollLightboxNext}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}