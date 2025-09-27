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
        onError={e => {
          e.currentTarget.parentElement!.style.display = 'none';
        }}
        className={
          'w-full rounded-lg shadow-lg object-cover transition-opacity duration-300'
        }
      />
      {caption && (
        <figcaption
          className="
            absolute bottom-0 w-full 
            bg-black text-white  text-sm 
            text-center px-2 py-1
            sm:bottom-4 sm:left-1/2 sm:w-auto sm:transform sm:-translate-x-1/2 sm:rounded-xl
          "
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
