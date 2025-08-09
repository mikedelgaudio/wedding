import { useCallback, useEffect, useRef, useState } from 'react';

interface CarouselProps {
  images: string[];
}

export function AutoScrollCarousel({ images }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const scrollPositionRef = useRef(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Calculate responsive scroll speed
  const getScrollSpeed = useCallback(() => {
    const width = window.innerWidth;

    // Optimal speeds for different breakpoints
    if (width < 480) return 20; // Small mobile
    if (width < 768) return 30; // Large mobile
    if (width < 1024) return 40; // Tablet
    return 45; // Desktop
  }, []);

  const [currentScrollSpeed, setCurrentScrollSpeed] = useState(getScrollSpeed);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Check if mobile and update scroll speed on resize
    const updateDeviceType = () => {
      setCurrentScrollSpeed(getScrollSpeed());
    };

    updateDeviceType(); // Initial check

    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, [getScrollSpeed]);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return; // Don't start timer if motion is reduced

    const startTimer = setTimeout(() => setIsStarted(true), 1000);
    return () => clearTimeout(startTimer);
  }, [prefersReducedMotion]);

  const animate = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isStarted || isPaused) return;

    scrollPositionRef.current += currentScrollSpeed / 60;

    const containerWidth = scrollContainer.offsetWidth;
    const resetPoint = containerWidth * images.length;

    if (scrollPositionRef.current >= resetPoint) {
      scrollPositionRef.current = 0;
    }

    scrollContainer.scrollLeft = scrollPositionRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, [images.length, currentScrollSpeed, isStarted, isPaused]);

  useEffect(() => {
    if (isStarted && !isPaused) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isStarted, isPaused]);

  const tripleImages = [...images, ...images, ...images];

  return (
    <div className="w-full h-[calc(100dvh-72px)] md:h-[calc(100dvh-172px)] flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <span className="text-7xl sm:text-9xl text-white opacity-95 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 whitespace-nowrap">
          <span>L </span>
          <span
            className="text-6xl md:text-9xl"
            style={{ fontFamily: 'Tangerine' }}
          >
            &
          </span>{' '}
          <span>M</span>
        </span>
        <div
          ref={scrollRef}
          className="h-[calc(100dvh-72px)] md:h-[calc(100dvh-172px)] overflow-x-scroll overflow-y-hidden scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            className="flex h-full"
            style={{ width: `${tripleImages.length * 100}vw` }}
          >
            {tripleImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-screen h-full relative"
              >
                <img
                  src={image}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
