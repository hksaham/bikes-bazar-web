import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { listBikeImages } from "@/lib/storage";

interface BikeGalleryProps {
  bikeId: string;
  mainImage: string;
  localGallery: string[];
  sold: boolean;
}

export default function BikeGallery({
  bikeId,
  mainImage,
  localGallery,
  sold,
}: BikeGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function fetchImages() {
      setLoading(true);
      try {
        const supabaseImages = await listBikeImages(bikeId);
        if (cancelled) return;

        if (supabaseImages.length > 0) {
          setImages(supabaseImages);
        } else {
          // Fallback to local images
          const fallback = [mainImage, ...localGallery].filter(Boolean);
          setImages(fallback.length > 0 ? fallback : [mainImage]);
        }
      } catch {
        const fallback = [mainImage, ...localGallery].filter(Boolean);
        setImages(fallback.length > 0 ? fallback : [mainImage]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchImages();
    return () => { cancelled = true; };
  }, [bikeId, mainImage, localGallery]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => new Set(prev).add(index));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-full aspect-[4/3] rounded-lg" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="w-20 h-16 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex] || mainImage;

  return (
    <div className="space-y-3">
      {/* Main hero image */}
      <div className="relative rounded-lg overflow-hidden bg-card group cursor-zoom-in">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {!imagesLoaded.has(activeIndex) && (
              <Skeleton className="absolute inset-0 w-full aspect-[4/3]" />
            )}
            <motion.img
              src={activeImage}
              alt="Bike gallery"
              className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              width={800}
              height={600}
              onLoad={() => handleImageLoad(activeIndex)}
              style={{ opacity: imagesLoaded.has(activeIndex) ? 1 : 0 }}
            />
          </motion.div>
        </AnimatePresence>

        {/* SOLD banner — top-right corner diagonal */}
        {sold && (
          <div className="absolute top-0 right-0 z-20">
            <div className="relative">
              <div className="absolute top-4 -right-8 bg-destructive text-destructive-foreground text-xs font-bold uppercase tracking-widest px-10 py-1.5 rotate-45 shadow-lg">
                Sold
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 ${
                i === activeIndex
                  ? "ring-2 ring-accent opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              {!imagesLoaded.has(i) && (
                <Skeleton className="absolute inset-0 w-20 h-16" />
              )}
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-20 h-16 object-cover"
                loading="lazy"
                onLoad={() => handleImageLoad(i)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
