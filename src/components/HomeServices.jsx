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
    }
  });
};

// Preload images if categories are available
if (preloadedData.categories) {
  preloadImages(preloadedData.categories);
}

export default function HomeServices() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

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

  // Optimized resize handler
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1600) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else setCardsPerView(4);
    };

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(() => {
      updateCardsPerView();
    });

    resizeObserver.observe(document.body);
    updateCardsPerView();

    return () => {
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
  const isPaused = useRef(false);
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
    isPaused.current = false;
  }, []);

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
        className="flex-shrink-0 px-1 sm:px-2 flex justify-center items-center"
        style={{ flexBasis: `${100 / cardsPerView}%` }}
      >
        <div
          className={`relative aspect-square ${circleSize} p-[2px] bg-gray-200 animate-pulse`}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-300">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 via-gray-300/30 to-transparent flex items-center justify-center">
              <div className="h-4 bg-gray-400 rounded w-16"></div>
            </div>
          </div>
        </div>
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
        className="flex-shrink-0 px-1 sm:px-2 flex justify-center items-center"
        style={{ flexBasis: `${100 / cardsPerView}%` }}
      >
        <div
          className={`relative group aspect-square ${circleSize} p-[2px]
                      bg-gradient-to-br from-white/40 via-white/10 to-transparent
                      shadow-lg border border-white/30 hover:scale-105 transition-transform duration-300
                      cursor-pointer transform-gpu`}
          onClick={() => navigate(`/category/${service?.id}`)}
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {/* ULTRA FAST IMAGE - No lazy loading, eager loading, immediate display */}
            <img
              src={service?.image}
              alt={service?.title_en || service?.title}
              loading="eager"  // Changed from 'lazy' to 'eager'
              decoding="sync"  // Changed from 'async' to 'sync'
              width={160}
              height={160}
              className="w-full h-full object-cover rounded-full opacity-100 group-hover:opacity-100 transition duration-300 transform-gpu"
              style={{ 
                contentVisibility: 'auto',
                // Force immediate rendering
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              onLoad={(e) => {
                // Force immediate display
                e.target.style.opacity = '1';
              }}
              onError={(e) => {
                // Fallback to prevent broken images
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
              <h3 className="text-white text-[10px] sm:text-xs md:text-sm font-medium text-center px-3 py-[4px] leading-tight bg-black/10 rounded-sm transition duration-300">
                {service?.title_en || service?.title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    ));
  }, [duplicatedCategories, cardsPerView, circleSize, navigate, isLoading, skeletonLoader, imagesLoaded]);

  return (
    <section
      dir="ltr"
      className="relative mx-auto py-8 sm:py-12 lg:py-10 overflow-visible bg-neutral-100"
      style={{ 
        contain: 'layout style paint',
        contentVisibility: 'auto'
      }}
    >
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
          {fixedWords?.homeServicesTitle || "Home Services"}
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          {fixedWords?.homeServicesSubtitle ||
            "Explore trusted service categories for your home and garden"}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">

        {/* Premium Apple-style Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="
            absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10
            bg-white/10 hover:bg-white/20 text-gray-800
            rounded-full p-3 sm:p-4
            shadow-xl border border-gray-300/80
            transition-all duration-200 ease-out
            hover:scale-110 active:scale-95
            backdrop-blur-sm
            hover:shadow-2xl
          "
          aria-label="Previous categories"
          style={{ willChange: 'transform' }}
        >
          <FaChevronLeft className="text-sm sm:text-base" />
        </button>

        <div
          className="overflow-visible w-full"
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex flex-nowrap" 
            ref={containerRef}
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            {renderCategoryCards}
          </div>
        </div>

        {/*  Navigation Buttons */}
        <button
          onClick={handleNext}
          className="
            absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10
            bg-white/10 hover:bg-white/20 text-gray-900
            rounded-full p-3 sm:p-4
            shadow-xl border border-gray-300/80
            transition-all duration-200 ease-out
            hover:scale-110 active:scale-95
            backdrop-blur-sm
            hover:shadow-2xl
          "
          aria-label="Next categories"
          style={{ willChange: 'transform' }}
        >
          <FaChevronRight className="text-sm sm:text-base" />
        </button>

      </div>
    </section>
  );
}