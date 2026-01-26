import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api";
import { useSettings } from "../hooks/useSettings";
import SmartImage from "../components/SmartImage";
import { warn } from "../utils/logger";

const ChevronLeft = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 320 512"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M34.9 239L228.9 45c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L131.5 256l153.9 153.5c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L34.9 273c-9.4-9.4-9.4-24.6 0-34z"/>
  </svg>
);

const ChevronRight = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 320 512"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M285.1 273L91.1 467c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9L188.5 256 34.6 102.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l194 194c9.4 9.4 9.4 24.6 0 34z"/>
  </svg>
);

// ==================== PERFORMANCE UTILITIES ====================

// Apple-like throttle (120fps max)
const throttle = (func, limit = 8) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Optimized Intersection Observer
const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      requestAnimationFrame(() => {
        setIsIntersecting(entry.isIntersecting);
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px' // Early detection
    });

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

// Optimized image loader


// ==================== DATA MANAGEMENT ====================

let preloadedData = {
  categories: null,
  loading: false
};

// Non-blocking prefetch
if (typeof window !== 'undefined' && !preloadedData.loading) {
  preloadedData.loading = true;
  
  // Use microtask for immediate but non-blocking load
  Promise.resolve().then(async () => {
    try {
      const [catRes] = await Promise.allSettled([getCategories()]);
      preloadedData.categories = catRes.status === 'fulfilled' 
        ? (catRes.value?.data?.data || []) 
        : [];
    } catch (err) {
      warn("HomeServices pre-fetch failed", err);
      preloadedData.categories = [];
    }
  });
}

// Optimized image preloader
const preloadImages = (categories, limit = 6) => {
  if (!Array.isArray(categories)) return;

  categories.slice(0, limit).forEach((category) => {
    const src = category?.image?.avif || category?.image?.webp;
    if (!src) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src.startsWith("http")
      ? src
      : `https://catalogueyanew.com.awu.zxu.temporary.site/${src.replace(/^\//, "")}`;
    link.fetchPriority = "high";
    document.head.appendChild(link);
  });
};


// ==================== MAIN COMPONENT ====================

export default function HomeServices() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);

  const [categories, setCategories] = useState(preloadedData.categories || []);
  const [isLoading, setIsLoading] = useState(preloadedData.categories === null);
  const [cardsPerView, setCardsPerView] = useState(6);

  // 1. OPTIMIZED DATA LOADING WITH ABORT CONTROLLER
  useEffect(() => {
    if (preloadedData.categories !== null) {
      setCategories(preloadedData.categories);
      setIsLoading(false);
      preloadImages(preloadedData.categories, 6);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [catRes] = await Promise.allSettled([
          getCategories(),
        ]);

        if (!mounted) return;

        const categoriesArray = catRes.status === 'fulfilled' 
          ? (catRes.value?.data?.data || []) 
          : [];

        if (mounted) {
          setCategories(categoriesArray);
          setIsLoading(false);
          preloadedData.categories = categoriesArray;
          preloadImages(categoriesArray, 6);
        }
      } catch (err) {
        if (mounted && err.name !== 'AbortError') {
           warn("HomeServices fetch failed", err);
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // 2. OPTIMIZED RESIZE HANDLER WITH THROTTLE
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1600) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else setCardsPerView(4);
    };

    const throttledResize = throttle(updateCardsPerView, 16);
    
    // Initial calculation
    updateCardsPerView();
    
    // Passive event listener
    window.addEventListener('resize', throttledResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', throttledResize);
    };
  }, []);

  // 3. PERFORMANCE OPTIMIZED DUPLICATION - FIXED FOR SEAMLESS INFINITE SCROLL
  const duplicatedCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    
    // Create enough duplicates for truly infinite scroll without gaps
    // We need at least 3 full sets for smooth transition
    const baseCount = categories.length;
    const repeats = Math.max(3, Math.ceil((cardsPerView * 3) / baseCount)) * 2;
    
    return Array.from({ length: repeats }, () => [...categories]).flat();
  }, [categories, cardsPerView]);

  // 4. OPTIMIZED RAF ANIMATION WITH SEAMLESS INFINITE SCROLL
  const scrollRef = useRef(0);
  const requestRef = useRef(null);
  const isPaused = useRef(!isInViewport);
  const lastTimeRef = useRef(0);
  const SCROLL_SPEED = 0.25;
  
  // Track the total container width for modulo operation
  const containerWidthRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || duplicatedCategories.length === 0) return;

    // Calculate the total scrollable width (half of total since we duplicated)
    const containerWidth = containerRef.current.scrollWidth / 2;
    containerWidthRef.current = containerWidth;

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = Math.min(time - lastTimeRef.current, 32);
      lastTimeRef.current = time;

      // Check visibility and page visibility
      if (!isInViewport || isPaused.current || document.hidden) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      // Increment scroll position
      scrollRef.current += SCROLL_SPEED * (deltaTime / 16);
      
      // Use modulo for seamless infinite scrolling - NO RESET DELAY
      const scrollPosition = scrollRef.current % containerWidth;
      
      // Apply the transform - this creates the infinite effect
      containerRef.current.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    
    // Handle page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      } else if (isInViewport && !isPaused.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [duplicatedCategories, isInViewport]);

  // 5. PAUSE LOGIC OPTIMIZATION
  useEffect(() => {
    isPaused.current = !isInViewport;
    
    if (isInViewport && lastTimeRef.current === 0) {
      lastTimeRef.current = performance.now();
    }
  }, [isInViewport]);

  // 6. OPTIMIZED SMOOTH SCROLL WITH INFINITE SUPPORT
  const smoothScroll = useCallback((distance) => {
    if (!containerRef.current || !containerWidthRef.current) return;
    
    const start = scrollRef.current;
    // Apply modulo to ensure we stay within bounds
    const end = (scrollRef.current + distance) % containerWidthRef.current;
    const startTime = performance.now();
    const duration = 300;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apple's easing function (cubic-bezier(0.25, 0.46, 0.45, 0.94))
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current position
      const current = start + (end - start) * ease;
      
      // Apply modulo for infinite effect
      const scrollPosition = current % containerWidthRef.current;
      scrollRef.current = current;
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const handlePrev = useCallback(() => {
    if (!containerRef.current || !containerWidthRef.current) return;
    const moveDistance = containerRef.current.offsetWidth / cardsPerView;
    smoothScroll(-moveDistance);
  }, [smoothScroll, cardsPerView]);

  const handleNext = useCallback(() => {
    if (!containerRef.current || !containerWidthRef.current) return;
    const moveDistance = containerRef.current.offsetWidth / cardsPerView;
    smoothScroll(moveDistance);
  }, [smoothScroll, cardsPerView]);

  // 7. OPTIMIZED TOUCH HANDLERS WITH PASSIVE LISTENERS
  const touchStartX = useRef(0);
  const scrollStartX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    scrollStartX.current = scrollRef.current;
    isPaused.current = true;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !isDragging.current) return;
    e.preventDefault();
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    
    // Apply modulo for infinite dragging
    const newScroll = (scrollStartX.current + diff) % containerWidthRef.current;
    scrollRef.current = scrollStartX.current + diff;
    
    containerRef.current.style.transform = `translate3d(-${newScroll}px, 0, 0)`;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    isPaused.current = !isInViewport;
  }, [isInViewport]);

  // 8. MEMOIZED VALUES
  const circleSize = useMemo(() => 
    "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full",
    []
  );

  // 9. OPTIMIZED SKELETON LOADER
  const skeletonLoader = useMemo(() => {
    const count = Math.min(12, cardsPerView * 2);
    return Array.from({ length: count }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex-shrink-0 px-1 sm:px-2 flex flex-col items-center"
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
        <div className="h-4 bg-gray-300 rounded w-20 mt-3"></div>
      </div>
    ));
  }, [cardsPerView, circleSize]);

  // 10. OPTIMIZED CATEGORY CARD COMPONENT
const CategoryCard = useCallback(({ service, index, cardsPerView }) => {
  return (
    <div
      key={`${service?.id}-${index}`}
      className="flex-shrink-0 px-1 sm:px-2 flex flex-col items-center"
      style={{ flexBasis: `${100 / cardsPerView}%` }}
    >
      <div
  role="button"
  tabIndex={0}
  onClick={() => navigate(`/category/${service?.id}`)}
  onKeyDown={(e) => e.key === "Enter" && navigate(`/category/${service?.id}`)}
  className={`relative group aspect-square ${circleSize} p-[2px]
              bg-gradient-to-br from-white/40 via-white/10 to-transparent
              shadow-lg border border-white/30 hover:scale-105
              transition-transform duration-300 cursor-pointer`}
  aria-label={`Browse ${service?.title_en || service?.title}`}
>
  <div className="relative w-full h-full rounded-full overflow-hidden">
    <SmartImage
      image={service.image}
      alt={service?.title_en || service?.title}
      loading={index < 12 ? "eager" : "lazy"}
      fetchPriority={index < 6 ? "high" : "low"}
      decoding={index < 12 ? "sync" : "async"}
      className="w-full h-full object-cover rounded-full"
    />
  </div>
</div>


      <h3 className="text-gray-900 text-[13px] sm:text-base md:text-[15px] font-medium text-center mt-5 px-2 leading-tight max-w-full truncate">
        {service?.title_en || service?.title}
      </h3>
    </div>
  );
}, [circleSize, navigate]);



  // 11. OPTIMIZED RENDER CATEGORY CARDS
  const renderCategoryCards = useMemo(() => {
    if (isLoading || duplicatedCategories.length === 0) {
      return skeletonLoader;
    }

    return duplicatedCategories.map((service, index) => (
      <CategoryCard
        key={`${service?.id}-${index}`}
        service={service}
        index={index}
        cardsPerView={cardsPerView}
      />
    ));
  }, [duplicatedCategories, cardsPerView, isLoading, skeletonLoader, CategoryCard]);

  return (
    <section
      ref={sectionRef}
      dir="ltr"
      className="relative mx-auto py-8 sm:py-12 lg:py-10 overflow-visible bg-white"
      style={{ 
        contain: 'layout style paint',
        contentVisibility: 'auto'
      }}
    >
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
          {settings?.service_title}
        </h2>

        <p className="text-gray-600 mt-2 text-[10px]  md:text-sm sm:text-base tracking-normal">
          {settings?.service_sub_title}
        </p>
      </div>

      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">

        {/* ✅ Navigation button - Only element that animates on hover */}
        <button
          onClick={handlePrev}
          className="
            absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10
            bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600
            rounded-full p-1.5 sm:p-2.5
            shadow-[0_1px_4px_rgba(0,0,0,0.15)]
            transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
            hover:scale-[1.06] active:scale-[0.95]
          "
          aria-label="Previous categories"
          style={{ willChange: "transform" }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* ✅ Container wrapper - Only this area animates */}
        <div
          className="overflow-visible w-full"
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = !isInViewport)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {/* ✅ Scroll container - Only this element gets continuous animation */}
          <div 
            className="flex flex-nowrap" 
            ref={containerRef}
            style={{ 
              willChange: 'transform'
            }}
          >
            {renderCategoryCards}
          </div>
        </div>

        {/* ✅ Navigation button - Only element that animates on hover */}
        <button
          onClick={handleNext}
          className="
            absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10
            bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600
            rounded-full p-1.5 sm:p-2.5
            shadow-[0_1px_4px_rgba(0,0,0,0.15)]
            transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
            hover:scale-[1.06] active:scale-[0.95]
          "
          aria-label="Next categories"
          style={{ willChange: "transform" }} 
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}