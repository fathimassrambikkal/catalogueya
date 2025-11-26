import { MdArrowOutward } from "react-icons/md";
import React, { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaWhatsapp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";
import { useFavourites } from "../context/FavouriteContext";
import { getArrivalsProducts } from "../api";
import { useTranslation } from "react-i18next";

const whatsappNumber = "97400000000";

// Pre-fetch data immediately when module loads
let preloadedData = {
  arrivalsProducts: null
};

// Start fetching immediately
(async () => {
  try {
    const res = await getArrivalsProducts();
    
    let arr = [];
    if (Array.isArray(res)) arr = res;
    else if (Array.isArray(res?.data)) arr = res.data;
    else if (Array.isArray(res?.products)) arr = res.products;

    preloadedData.arrivalsProducts = arr;
  } catch (err) {
    console.warn("Pre-fetch failed:", err);
  }
})();

// Preload images immediately with high priority
const preloadImages = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  products.forEach(product => {
    if (product?.img) {
      const img = new Image();
      img.src = product.img;
      img.fetchPriority = 'high';
    }
  });
};

// Preload images if products are available
if (preloadedData.arrivalsProducts) {
  preloadImages(preloadedData.arrivalsProducts);
}

// Intersection Observer Hook for performance
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

const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate }) => (
  <div
    className="flex-none rounded-2xl overflow-hidden group cursor-pointer
               bg-white/10 border border-white/30 backdrop-blur-2xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
               hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
               transition-all duration-700 transform-gpu"
    onClick={() => onNavigate(product.id)}
    style={{ 
      willChange: 'transform',
      contentVisibility: 'auto'
    }}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavourite(product);
      }}
      className={`absolute top-2 right-2 sm:top-2 sm:right-2 z-20 p-1.5 rounded-full shadow-md transition backdrop-blur-md border transform-gpu
        ${isFav ? "bg-red-100 text-red-600 border-red-200" : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}`}
      style={{ willChange: 'transform' }}
    >
      <FaHeart className={`text-xs ${isFav ? "text-red-500" : "hover:text-red-400"}`} />
    </button>

    <div className="relative w-full h-[160px] xs:h-[180px] sm:h-[200px] overflow-hidden rounded-t-2xl">
      <img
        src={product.img}
        alt={product.name}
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        width={240}
        height={200}
        className="w-full h-full object-cover object-top rounded-t-2xl border-b border-white/20 
                 transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu"
        style={{ 
          contentVisibility: 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
        onLoad={(e) => {
          e.target.style.opacity = '1';
        }}
        onError={(e) => {
          console.error('Failed to load product image:', product.img);
          e.target.style.display = 'none';
        }}
      />
      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg transform-gpu">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className={`w-2 h-2 transform-gpu ${i < Math.floor(product.rating ?? 0) ? "text-white" : "text-gray-400"}`} />
        ))}
        <span className="text-[9px] text-white/90 ml-1 transform-gpu">{(product.rating ?? 0).toFixed(1)}</span>
      </div>
    </div>

    <div
      className="relative w-full rounded-b-2xl p-3 border-t border-white/20 
                 bg-white/70 backdrop-blur-xl
                 shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                 flex items-center justify-between overflow-hidden transform-gpu"
      style={{ willChange: 'transform' }}
    >
      <div className="flex flex-col w-[80%] z-10 transform-gpu">
        <h3 className="font-semibold text-xs truncate text-gray-900 mb-1 transform-gpu">{product.name}</h3>
        <div className="flex items-center gap-1 transform-gpu">
          <span className="text-xs font-bold text-gray-900 transform-gpu">QAR {product.price}</span>
          {product.oldPrice && (
            <span className="text-[10px] line-through text-gray-500 transform-gpu">QAR {product.oldPrice}</span>
          )}
        </div>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 bg-green-500/80 backdrop-blur-sm rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10 transform-gpu"
        title="Chat on WhatsApp"
        style={{ willChange: 'transform' }}
      >
        <FaWhatsapp className="text-sm transform-gpu" />
      </a>
    </div>
  </div>
));

function NewArrivalsComponent() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const { i18n } = useTranslation();
  const [apiProducts, setApiProducts] = useState(preloadedData.arrivalsProducts || []);
  const [isLoading, setIsLoading] = useState(!preloadedData.arrivalsProducts);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);
  const [cardWidth, setCardWidth] = useState('220px');
  const resizeTimeoutRef = useRef(null);

  // Ultra-fast data loading with preloaded data
  useEffect(() => {
    if (preloadedData.arrivalsProducts !== null) {
      setApiProducts(preloadedData.arrivalsProducts);
      setIsLoading(false);
      preloadImages(preloadedData.arrivalsProducts);
      return;
    }

    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await getArrivalsProducts();
        if (!mounted) return;

        let arr = [];
        if (Array.isArray(res)) arr = res;
        else if (Array.isArray(res?.data)) arr = res.data;
        else if (Array.isArray(res?.products)) arr = res.products;

        setApiProducts(arr);
        setIsLoading(false);
        preloadedData.arrivalsProducts = arr;
        preloadImages(arr);
      } catch (err) {
        console.warn("Failed to fetch new arrivals products:", err);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  // Optimized card width calculation with debouncing
  useEffect(() => {
    const updateCardWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardWidth('calc(45vw - 20px)');
      } else if (width < 768) {
        setCardWidth('220px');
      } else {
        setCardWidth('240px');
      }
    };

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateCardWidth, 50);
    };

    updateCardWidth();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // SAFE MERGE (prevents crash)
  const combinedProducts = useMemo(() => {
    const api = Array.isArray(apiProducts) ? apiProducts : [];
    const local = Array.isArray(unifiedData.newArrivalProducts) ? unifiedData.newArrivalProducts : [];
    return [...api, ...local];
  }, [apiProducts]);

  const handleToggleFav = useCallback((product) => toggleFavourite(product), [toggleFavourite]);
  const handleNavigate = useCallback((id) => navigate(`/newarrivalprofile/${id}`), [navigate]);

  // Optimized horizontal scroll with wheel and throttling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let wheelTimeout;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        
        if (wheelTimeout) return;
        
        scrollContainer.scrollLeft += e.deltaY * 0.8;
        
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 16); // 60fps throttle
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, []);

  // Optimized scroll handlers with intersection check
  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current && isInViewport) {
      const scrollAmount = window.innerWidth < 640 ? 
        (window.innerWidth / 2) : 220;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [isInViewport]);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current && isInViewport) {
      const scrollAmount = window.innerWidth < 640 ? 
        (window.innerWidth / 2) : 220;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [isInViewport]);

  // Skeleton loader for initial load
  const skeletonLoader = useMemo(() => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex-none rounded-2xl overflow-hidden bg-gray-200 animate-pulse transform-gpu"
        style={{
          width: cardWidth,
          minWidth: cardWidth,
          willChange: 'transform'
        }}
      >
        <div className="w-full h-[140px] xs:h-[160px] sm:h-[180px] bg-gray-300 rounded-t-2xl transform-gpu" />
        <div className="p-3 bg-gray-200 rounded-b-2xl transform-gpu">
          <div className="h-3 bg-gray-300 rounded mb-2 w-3/4 transform-gpu"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 transform-gpu"></div>
        </div>
      </div>
    ));
  }, [cardWidth]);

  return (
    <section 
      ref={sectionRef}
      className="py-6 sm:py-10 bg-neutral-100 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden transform-gpu"
      style={{ 
        contentVisibility: 'auto',
        willChange: 'transform'
      }}
    >
      {/* Header */}
      <div className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4 transform-gpu">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal md:font-light tracking-tighter text-black transform-gpu">
          Products
        </h1>
        <div className="flex justify-end transform-gpu">
          <Link
            to="/newarrivalproducts"
            className="relative font-medium text-black overflow-hidden group h-6 sm:h-7 flex items-center text-xs sm:text-base mt-1 transform-gpu"
            style={{ willChange: 'transform' }}
          >
            <span className="flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full md:text-lg tracking-tighter transform-gpu">
              View more
              <span className="inline-block text-gray-700 transition-transform duration-300 group-hover:translate-x-1 transform-gpu">
                <MdArrowOutward className="text-lg transform-gpu" />
              </span>
            </span>
            <span className="absolute left-0 top-full flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full text-sm md:text-lg tracking-tighter transform-gpu">
              View more
              <span className="inline-block text-gray-700 transition-transform duration-300 group-hover:translate-x-1 transform-gpu">
                <MdArrowOutward className="text-lg transform-gpu" />
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative transform-gpu">
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24
                     scrollbar-hide scroll-smooth transform-gpu
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform'
          }}
        >
          <div className="flex gap-3 sm:gap-4 transform-gpu">
            {isLoading ? skeletonLoader : combinedProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none transform-gpu"
                style={{
                  width: cardWidth,
                  minWidth: cardWidth,
                  willChange: 'transform'
                }}
              >
                <ProductCard
                  product={product}
                  isFav={favourites.some(item => item.id === product.id)}
                  onToggleFavourite={handleToggleFav}
                  onNavigate={handleNavigate}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-4 gap-3 transform-gpu">
          <button
            onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
            className="
              bg-white/10 hover:bg-white 
              rounded-full p-3
              shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-900
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              backdrop-blur-sm
              hover:shadow-2xl
              group
              transform-gpu
            "
            aria-label={i18n.language === "ar" ? "المنتجات التالية" : "Previous products"}
            style={{ willChange: 'transform' }}
          >
            {i18n.language === "ar" ? (
              <FaChevronRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 transform-gpu" />
            ) : (
              <FaChevronLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-0.5 transform-gpu" />
            )}
          </button>

          <button
            onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
            className="
              bg-white/10 hover:bg-white 
              rounded-full p-3
              shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-900
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              backdrop-blur-sm
              hover:shadow-2xl
              group
              transform-gpu
            "
            aria-label={i18n.language === "ar" ? "المنتجات السابقة" : "Next products"}
            style={{ willChange: 'transform' }}
          >
            {i18n.language === "ar" ? (
              <FaChevronLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-0.5 transform-gpu" />
            ) : (
              <FaChevronRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 transform-gpu" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export const NewArrivals = memo(NewArrivalsComponent);
export default NewArrivals;