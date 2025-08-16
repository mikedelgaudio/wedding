import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

const images = [
  `${CDN_URL}/home.jpg`,
  `${CDN_URL}/day.jpg`,
  `${CDN_URL}/stare.jpg`,
  `${CDN_URL}/photos.jpg`,
  `${CDN_URL}/facing.jpg`,
];

// Memoize the tripled images array to prevent recreation on every render
const tripleImages = [...images, ...images, ...images];

export function AutoScrollCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const scrollPositionRef = useRef(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // New refs for manual scroll handling
  const isUserScrollingRef = useRef(false);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserScrollLeft = useRef(0);

  const [isStarted, setIsStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [secondImageLoaded, setSecondImageLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [chevronOpacity, setChevronOpacity] = useState(1);

  const currentScrollSpeed = 30;

  // Handle manual scroll detection
  const handleManualScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Check if this is a user-initiated scroll
    const currentScrollLeft = scrollContainer.scrollLeft;
    const isManualScroll =
      Math.abs(currentScrollLeft - scrollPositionRef.current) > 2;

    if (isManualScroll && !isUserScrollingRef.current) {
      // User started scrolling
      isUserScrollingRef.current = true;

      // Cancel auto-scroll animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    // Update our internal position to match user scroll
    if (isUserScrollingRef.current) {
      scrollPositionRef.current = currentScrollLeft;
      lastUserScrollLeft.current = currentScrollLeft;
    }

    // Clear existing timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // Set timeout to resume auto-scroll after user stops
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;

      // Resume auto-scroll from current position
      if (isStarted && !prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }, 1000); // Resume after 1 second of no manual scrolling

    // eslint-disable-next-line
  }, [isStarted, prefersReducedMotion]);

  // Add scroll event listener to carousel
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleManualScroll, {
      passive: true,
    });

    return () => {
      scrollContainer.removeEventListener('scroll', handleManualScroll);
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, [handleManualScroll]);

  // Update chevron opacity based on scroll position
  const updateChevronOpacity = useCallback(() => {
    const scrollPosition = window.scrollY;
    const fadeStart = 100; // Start fading after 100px
    const fadeEnd = 300; // Fully hidden after 300px

    if (scrollPosition <= fadeStart) {
      setChevronOpacity(1);
    } else if (scrollPosition >= fadeEnd) {
      setChevronOpacity(0);
    } else {
      // Calculate opacity between fadeStart and fadeEnd
      const fadeProgress = (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
      setChevronOpacity(1 - fadeProgress);
    }
  }, []);

  // Throttled scroll handler using requestAnimationFrame for better performance
  const updateScrollY = useCallback(() => {
    setScrollY(lastScrollY.current);
    updateChevronOpacity(); // Update chevron opacity along with scroll position
    ticking.current = false;
  }, [updateChevronOpacity]);

  const handleScroll = useCallback(() => {
    lastScrollY.current = window.scrollY;

    if (!ticking.current) {
      requestAnimationFrame(updateScrollY);
      ticking.current = true;
    }
  }, [updateScrollY]);

  // Handle window scroll for parallax effect with optimized throttling
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ticking.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll]);

  // Memoize reduced motion check
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Optimized image preloading
  useEffect(() => {
    if (images.length > 1) {
      const img = new Image();
      img.onload = () => setSecondImageLoaded(true);
      img.onerror = () => setSecondImageLoaded(true); // Still start even if image fails
      img.src = images[1];
    } else {
      setSecondImageLoaded(true);
    }
  }, []);

  // Start animation with proper cleanup
  useEffect(() => {
    if (prefersReducedMotion || !secondImageLoaded) return;

    const startTimer = setTimeout(() => setIsStarted(true), 1000);
    return () => clearTimeout(startTimer);
  }, [prefersReducedMotion, secondImageLoaded]);

  // Optimized animation loop with better frame timing
  const animate = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isStarted || isUserScrollingRef.current) return;

    // Use consistent timing for smooth animation
    scrollPositionRef.current += currentScrollSpeed / 60;

    const containerWidth = scrollContainer.offsetWidth;
    const resetPoint = containerWidth * images.length;

    // More efficient reset logic
    if (scrollPositionRef.current >= resetPoint) {
      scrollPositionRef.current = scrollPositionRef.current - resetPoint;
    }

    scrollContainer.scrollLeft = scrollPositionRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, [currentScrollSpeed, isStarted]);

  useEffect(() => {
    if (isStarted && !isUserScrollingRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isStarted]);

  // Memoized parallax calculation for better performance
  const parallaxOffsets = useMemo(() => {
    if (prefersReducedMotion) return tripleImages.map(() => 0);

    const baseSpeed = 0.2;
    return tripleImages.map((_, index) => {
      const layerSpeed = baseSpeed + (index % images.length) * 0.05;
      return scrollY * layerSpeed;
    });
  }, [scrollY, prefersReducedMotion]);

  // Memoized transform styles to prevent recalculation
  const transformStyles = useMemo(() => {
    return parallaxOffsets.map(offset => ({
      transform: `translate3d(0, ${offset}px, 0) scale(1.05)`,
      // Use translate3d and will-change for hardware acceleration
      willChange: 'transform',
    }));
  }, [parallaxOffsets]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh-72px)] md:h-[calc(100vh-172px)] flex flex-col relative"
    >
      <div className="flex-1 relative overflow-hidden">
        <span
          className="text-7xl sm:text-9xl text-white opacity-95 absolute top-1/2 left-1/2 z-10 whitespace-nowrap pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
        >
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
          className="h-[calc(100vh-72px)] md:h-[calc(100vh-172px)] overflow-x-scroll overflow-y-hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          }}
        >
          <div
            className="flex h-full"
            style={{
              width: `${tripleImages.length * 100}vw`,
              willChange: 'scroll-position', // Hint for scroll optimization
            }}
          >
            {tripleImages.map((image, index) => (
              <div
                key={`${image}-${index}`} // More specific key for better reconciliation
                className="flex-shrink-0 w-screen h-full relative overflow-hidden"
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                  style={transformStyles[index]}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: chevronOpacity,
        }}
      >
        <div
          className={`text-white text-4xl drop-shadow-lg ${
            !prefersReducedMotion ? 'animate-[bounce_2s_infinite]' : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              fill="#fff"
              d="M4.293 8.293a1 1 0 0 1 1.414 0L12 14.586l6.293-6.293a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
