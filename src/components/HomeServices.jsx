import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getCategories, getFixedWords } from "../api";

// Pre-fetch data immediately when module loads
let preloadedData = {
  categories: null,
  fixedWords: null
};

// Start fetching immediately
(async () => {
  try {
    const [catRes, wordsRes] = await Promise.allSettled([
      getCategories(),
      getFixedWords()
    ]);
    
    preloadedData.categories = catRes.status === 'fulfilled' ? (catRes.value?.data?.data || []) : [];
    preloadedData.fixedWords = wordsRes.status === 'fulfilled' ? (wordsRes.value?.data?.data || {}) : {};
  } catch (err) {
    console.warn("Pre-fetch failed:", err);
  }
})();

// Preload images immediately
const preloadImages = (categories) => {
  if (!categories || !Array.isArray(categories)) return;
  
  categories.forEach(category => {
    if (category?.image) {
      const img = new Image();
      img.src = category.image;
      img.fetchPriority = 'high';
    }
  });
};

// Preload images if categories are available
if (preloadedData.categories) {
  preloadImages(preloadedData.categories);
}

// Intersection Observer Hook for pausing animations when not visible
const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1 });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isIntersecting;
};

export default function HomeServices() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);

  const [categories, setCategories] = useState(preloadedData.categories || []);
  const [fixedWords, setFixedWords] = useState(preloadedData.fixedWords || {});
  const [isLoading, setIsLoading] = useState(!preloadedData.categories);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [cardsPerView, setCardsPerView] = useState(6);

  // Ultra-fast data loading with preloaded data
  useEffect(() => {
    // If preloaded data exists, use it immediately
    if (preloadedData.categories !== null) {
      setCategories(preloadedData.categories);
      setFixedWords(preloadedData.fixedWords);
      setIsLoading(false);
      // Preload images
      preloadImages(preloadedData.categories);
      setImagesLoaded(true);
      return;
    }

    // Fallback: fetch if preload didn't complete
    let mounted = true;
    const fetchData = async () => {
      try {
        const [catRes, wordsRes] = await Promise.allSettled([
          getCategories(),
          getFixedWords()
        ]);

        if (mounted) {
          const categoriesArray = catRes.status === 'fulfilled' ? (catRes.value?.data?.data || []) : [];
          const fixedWordsObj = wordsRes.status === 'fulfilled' ? (wordsRes.value?.data?.data || {}) : {};

          setCategories(categoriesArray);
          setFixedWords(fixedWordsObj);
          setIsLoading(false);
          
          // Update preloaded data for future renders
          preloadedData.categories = categoriesArray;
          preloadedData.fixedWords = fixedWordsObj;
          
          // Preload images
          preloadImages(categoriesArray);
          setImagesLoaded(true);
        }
      } catch (err) {
        console.warn("Failed to fetch home services data:", err);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Force immediate image display
  useEffect(() => {
    if (categories.length > 0 && !imagesLoaded) {
      setImagesLoaded(true);
    }
  }, [categories, imagesLoaded]);

  // Optimized resize handler with debouncing
  useEffect(() => {
    let resizeTimeout;
    
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1600) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else setCardsPerView(4);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCardsPerView, 16); 
    };

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);
    updateCardsPerView();

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, []);

  // Performance optimized duplication
  const duplicatedCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    return [...categories, ...categories];
  }, [categories]);

  // Ultra-smooth continuous scroll with optimized RAF
  const scrollRef = useRef(0);
  const requestRef = useRef(null);
  const isPaused = useRef(!isInViewport);
  const lastTimeRef = useRef(0);
  const SCROLL_SPEED = 0.25;

  useEffect(() => {
    if (!containerRef.current || duplicatedCategories.length === 0) return;

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = Math.min(time - lastTimeRef.current, 32); // Cap at 30fps min
      lastTimeRef.current = time;

      if (!isPaused.current && containerRef.current) {
        const containerWidth = containerRef.current.scrollWidth / 2 || 0;
        scrollRef.current += SCROLL_SPEED * (deltaTime / 16);

        if (scrollRef.current >= containerWidth) scrollRef.current = 0;

        // GPU accelerated transform with will-change
        containerRef.current.style.transform = `translate3d(-${scrollRef.current}px, 0, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [duplicatedCategories]);

  // Pause animation when not in viewport
  useEffect(() => {
    isPaused.current = !isInViewport;
  }, [isInViewport]);

  // Optimized smooth scroll for arrows
  const smoothScroll = useCallback((distance) => {
    if (!containerRef.current) return;
    
    const start = scrollRef.current;
    const end = scrollRef.current + distance;
    let startTime = null;
    const duration = 300;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apple-like easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      scrollRef.current = start + (end - start) * easeOut;
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(-${scrollRef.current}px, 0, 0)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  const handlePrev = useCallback(() => {
    if (!containerRef.current) return;
    smoothScroll(-(containerRef.current.offsetWidth / cardsPerView));
  }, [smoothScroll, cardsPerView]);

  const handleNext = useCallback(() => {
    if (!containerRef.current) return;
    smoothScroll(containerRef.current.offsetWidth / cardsPerView);
  }, [smoothScroll, cardsPerView]);

  // Optimized touch/swipe support
  const touchStartX = useRef(0);
  const scrollStartX = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    scrollStartX.current = scrollRef.current;
    isPaused.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;

    scrollRef.current = scrollStartX.current + diff;
    containerRef.current.style.transform = `translate3d(-${scrollRef.current}px, 0, 0)`;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isPaused.current = !isInViewport;
  }, [isInViewport]);

  // Memoized circle size calculation
  const circleSize = useMemo(() => 
    "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full",
    []
  );

  // Skeleton loader for initial load
  const skeletonLoader = useMemo(() => {
    return Array.from({ length: 12 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex-shrink-0 px-1 sm:px-2 flex flex-col items-center transform-gpu"
        style={{ 
          flexBasis: `${100 / cardsPerView}%`,
          willChange: 'transform'
        }}
      >
        <div
          className={`relative aspect-square ${circleSize} p-[2px] bg-gray-200 animate-pulse transform-gpu`}
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-300 transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 via-gray-300/30 to-transparent flex items-center justify-center transform-gpu">
              <div className="h-4 bg-gray-400 rounded w-16 transform-gpu"></div>
            </div>
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-20 mt-3 transform-gpu"></div>
      </div>
    ));
  }, [cardsPerView, circleSize]);

  // Memoized category cards rendering 
  const renderCategoryCards = useMemo(() => {
    if (isLoading || duplicatedCategories.length === 0) {
      return skeletonLoader;
    }

    return duplicatedCategories.map((service, index) => (
      <div
        key={`${service?.id}-${index}`}
        className="flex-shrink-0 px-1 sm:px-2 flex flex-col items-center transform-gpu"
        style={{ 
          flexBasis: `${100 / cardsPerView}%`,
          willChange: 'transform'
        }}
      >
        <div
          className={`relative group aspect-square ${circleSize} p-[2px]
                      bg-gradient-to-br from-white/40 via-white/10 to-transparent
                      shadow-lg border border-white/30 hover:scale-105 transition-transform duration-300
                      cursor-pointer transform-gpu`}
          onClick={() => navigate(`/category/${service?.id}`)}
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden transform-gpu">
            {/* ULTRA FAST IMAGE - No lazy loading, eager loading, immediate display */}
            <img
              src={service?.image}
              alt={service?.title_en || service?.title}
              loading="eager"
              decoding="sync"
              width={160}
              height={160}
              className="w-full h-full object-cover rounded-full opacity-100 group-hover:opacity-100 transition duration-300 transform-gpu"
              style={{ 
                contentVisibility: 'auto',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              onLoad={(e) => {
                e.target.style.opacity = '1';
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
        {/* Increased text size and spacing */}
        <h3 className="text-gray-900 text-[13px] sm:text-base md:text-[15px] font-medium text-center mt-5 px-2 leading-tight max-w-full truncate transform-gpu">
          {service?.title_en || service?.title}
        </h3>
      </div>
    ));
  }, [duplicatedCategories, cardsPerView, circleSize, navigate, isLoading, skeletonLoader, imagesLoaded]);

  return (
    <section
      ref={sectionRef}
      dir="ltr"
      className="relative mx-auto py-8 sm:py-12 lg:py-10 overflow-visible bg-neutral-100 transform-gpu"
      style={{ 
        contain: 'layout style paint',
        contentVisibility: 'auto'
      }}
    >
      <div className="text-center mb-8 sm:mb-12 transform-gpu">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight transform-gpu">
          {fixedWords?.homeServicesTitle || "Home Services"}
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base transform-gpu">
          {fixedWords?.homeServicesSubtitle ||
            "Explore trusted service categories for your home and garden"}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 transform-gpu">

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="
            absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10
            bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600
            rounded-full p-1.5 sm:p-2.5
            shadow-[0_1px_4px_rgba(0,0,0,0.15)]
            transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
            hover:scale-[1.06] active:scale-[0.95]
            transform-gpu
          "
          aria-label="Previous categories"
          style={{ willChange: 'transform' }}
        >
          <FaChevronLeft size={16} />
        </button>

        <div
          className="overflow-visible w-full transform-gpu"
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = !isInViewport)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ willChange: 'transform' }}
        >
          <div 
            className="flex flex-nowrap transform-gpu" 
            ref={containerRef}
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            {renderCategoryCards}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="
            absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10
            bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600
            rounded-full p-1.5 sm:p-2.5
            shadow-[0_1px_4px_rgba(0,0,0,0.15)]
            transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
            hover:scale-[1.06] active:scale-[0.95]
            transform-gpu
          "
          aria-label="Next categories"
          style={{ willChange: 'transform' }}
        >
          <FaChevronRight size={16} />
        </button>

      </div>
    </section>
  );
}