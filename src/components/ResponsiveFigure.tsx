import { useState } from 'react';

interface ResponsiveFigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: 'lazy' | 'eager';
  caption?: string;
  className?: string;
}

export function ResponsiveFigure({
  src,
  alt,
  width,
  height,
  loading,
  caption,
  className = '',
}: ResponsiveFigureProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const showImage = isLoaded && !hasError;

  return (
    <figure className={`relative w-auto max-w-2xl mx-auto ${className}`}>
      {!showImage && (
        <div
          role="status"
          className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
          style={{ height }}
        >
          <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-sm m-0 dark:bg-gray-700">
            <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
          showImage ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {caption && showImage && (
        <figcaption
          className="
            absolute bottom-0 w-full 
            bg-black bg-opacity-60 text-white italic text-sm 
            text-center px-4 py-2
            sm:bottom-4 sm:left-1/2 sm:w-auto sm:transform sm:-translate-x-1/2 sm:rounded-2xl
          "
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
