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
  return (
    <figure className={`relative w-auto max-w-2xl mx-auto ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        style={{ height }}
        className={
          'w-full rounded-lg shadow-lg object-cover transition-opacity duration-300'
        }
      />
      {caption && (
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
