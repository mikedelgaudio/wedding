// Gallery.tsx
import { useEffect, useState } from 'preact/hooks';

interface ImageItem {
  id: string;
  src: string;
}

interface GalleryProps {
  images: ImageItem[];
}

export function Gallery({ images }: GalleryProps) {
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1280) setColumns(4);
      else setColumns(6);
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const handleImageLoad = (id: string, img: HTMLImageElement) => {
    const ratio = img.naturalWidth / img.naturalHeight || 1;
    setImageRatios(prev => ({ ...prev, [id]: ratio }));
    setLoadedIds(prev => new Set(prev).add(id));
  };

  const handleImageError = (id: string) => {
    setFailedIds(prev => new Set(prev).add(id));
    setLoadedIds(prev => new Set(prev).add(id));
  };

  const validImages = images.filter(img => !failedIds.has(img.id));
  const allLoaded = validImages.length + failedIds.size >= images.length;

  const gridClasses = `grid gap-4 auto-rows-auto`;
  const columnStyle = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  };

  return (
    <div class="overflow-auto h-screen px-2 py-4">
      {!allLoaded ? (
        // Shimmer Skeleton
        <div class={gridClasses} style={columnStyle}>
          {Array.from({ length: images.length }).map((_, idx) => (
            <div
              key={idx}
              class="animate-pulse bg-gray-200 rounded-lg aspect-[4/3]"
            />
          ))}
        </div>
      ) : (
        // Actual Gallery
        <div class={gridClasses} style={columnStyle}>
          {validImages.map(img => {
            const ratio = imageRatios[img.id] ?? 1;
            const paddingTop = `${100 / ratio}%`;

            const colSpan = ratio > 1.5 ? 2 : 1;
            const rowSpan = ratio < 0.7 ? 2 : 1;

            return (
              <div
                key={img.id}
                class={`relative w-full overflow-hidden rounded-lg bg-gray-100 col-span-${colSpan} row-span-${rowSpan}`}
              >
                <div style={{ paddingTop }} class="w-full" />
                <img
                  src={img.src}
                  loading="lazy"
                  class="absolute top-0 left-0 w-full h-full object-cover"
                  onLoad={e => handleImageLoad(img.id, e.currentTarget)}
                  onError={() => handleImageError(img.id)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
