import { useCallback, useEffect, useRef, useState } from 'react';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

const images = [
  `${CDN_URL}/home.jpg`,
  `${CDN_URL}/day.jpg`,
  `${CDN_URL}/redField.jpg`,
  `${CDN_URL}/heda.jpg`,
  `${CDN_URL}/photos.jpg`,
];

const tripleImages = [...images, ...images, ...images];

export function AutoScrollCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const scrollPositionRef = useRef(0);
  const [isStarted, setIsStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [secondImageLoaded, setSecondImageLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Calculate responsive scroll speed
  const getScrollSpeed = useCallback(() => {
    const width = window.innerWidth;

    // Optimal speeds for different breakpoints
    if (width < 480) return 25; // Small mobile
    if (width < 1024) return 30; // Tablet
    return 35; // Desktop
  }, []);

  const [currentScrollSpeed, setCurrentScrollSpeed] = useState(getScrollSpeed);

  // Handle window scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    // Preload the second image and track when it loads
    if (images.length > 1) {
      const img = new Image();
      img.onload = () => setSecondImageLoaded(true);
      img.src = images[1]; // Load the second image
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !secondImageLoaded) return;

    const startTimer = setTimeout(() => setIsStarted(true), 1000);
    return () => clearTimeout(startTimer);
  }, [prefersReducedMotion, secondImageLoaded]);

  const animate = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isStarted) return;

    // Always continue auto-scrolling regardless of scroll position
    scrollPositionRef.current += currentScrollSpeed / 60;

    const containerWidth = scrollContainer.offsetWidth;
    const resetPoint = containerWidth * images.length;

    if (scrollPositionRef.current >= resetPoint) {
      scrollPositionRef.current = 0;
    }

    scrollContainer.scrollLeft = scrollPositionRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, [currentScrollSpeed, isStarted]);

  useEffect(() => {
    if (isStarted) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isStarted]);

  // Calculate parallax offset
  const getParallaxOffset = (index: number) => {
    if (prefersReducedMotion) return 0;

    // Create different parallax speeds for different images
    const baseSpeed = 0.2;
    const layerSpeed = baseSpeed + (index % images.length) * 0.05;
    return scrollY * layerSpeed;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100dvh-72px)] md:h-[calc(100dvh-172px)] flex flex-col"
    >
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
        >
          <div
            className="flex h-full"
            style={{ width: `${tripleImages.length * 100}vw` }}
          >
            {tripleImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-screen h-full relative overflow-hidden"
              >
                <img
                  src={image}
                  className="w-full h-full object-cover transition-transform duration-75 ease-out"
                  style={{
                    transform: `translateY(${getParallaxOffset(
                      index,
                    )}px) scale(1.05)`,
                  }}
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
