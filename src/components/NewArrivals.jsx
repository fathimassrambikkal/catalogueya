import React, { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { getArrivalsProducts } from "../api";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// SVG Icons
const StarIcon = ({ filled, className = "" }) => (
  <svg 
    className={`${className}`}
    width="8" 
    height="8" 
    viewBox="0 0 576 512"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "currentColor" : "#9CA3AF"}
    strokeWidth="30"
  >
    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
  </svg>
);

const HeartIcon = ({ filled = false, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ChevronLeftIcon = ({ className = "" }) => (
  <svg 
    className={`${className}`}
    width="16" 
    height="16" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({ className = "" }) => (
  <svg 
    className={`${className}`}
    width="16" 
    height="16" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ArrowOutwardIcon = ({ className = "" }) => (
  <svg 
    className={`${className}`}
    width="16" 
    height="16" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);


const ChatIcon = ({ className = "" }) => (
  <svg 
    className={`${className}`}
    width="17" 
    height="17" 
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    {/* Chat bubble outline with tail */}
    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.520.263-1.639.742-3.468 1.105z" />
    
    {/* Three dots */}
    <circle cx="4" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="12" cy="8" r="1" />
  </svg>
);


// Pre-fetch data immediately when module loads
let preloadedData = {
  arrivalsProducts: null
};

// Start fetching immediately
(async () => {
  try {
    const res = await getArrivalsProducts();
    
    let arr = [];
    const products = res?.data?.data?.products;
    if (Array.isArray(products)) {
      arr = products;
      
      // Transform the data to match your component's expected format
      arr = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: null,
        img: product.image,
        rating: parseFloat(product.rating) || 0,
        description: product.description,
        isNewArrival: true,
        company_id: product.company_id,
        company_name: product.company_name || "Company",
        category_id: product.category_id,
        category_name: product.category_name || "Product"
      }));
    }

    preloadedData.arrivalsProducts = arr;
  } catch {
    preloadedData.arrivalsProducts = [];
  }
})();

// Preload images immediately with high priority
const preloadImages = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  products.forEach((product) => {
    if (product?.img) {
      const img = new Image();
      const imageUrl = product.img.startsWith('http') ? product.img : `${API_BASE_URL}/${product.img}`;
      img.src = imageUrl;
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

const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate, currency, isRTL }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { i18n } = useTranslation();

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE_URL}/${imgPath}`;
  };

  const imageUrl = getImageUrl(product?.img);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  return (
    <div
      className="flex-none rounded-2xl overflow-hidden group cursor-pointer
               bg-white/10 border border-white/30 backdrop-blur-2xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
               hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
               transition-all duration-700"
      onClick={() => onNavigate(product.id)}
    >
      {/* FAV BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(product);
        }}
        className={`absolute top-2 right-2 sm:top-2 sm:right-2 z-20 p-1.5 rounded-full shadow-md transition backdrop-blur-md border
          ${isFav ? "bg-red-100 text-red-600 border-red-200" : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}`}
      >
        <HeartIcon
        filled={isFav}
        className={`w-3 h-3 ${
          isFav ? "text-red-500" : "text-gray-600 hover:text-red-400"
        }`}
      />
      </button>

      <div className="relative w-full h-[160px] xs:h-[180px] sm:h-[200px] overflow-hidden rounded-t-2xl">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover object-top rounded-t-2xl border-b border-white/20 
                       transition-all duration-300 ease-out group-hover:scale-105
                       ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-2xl flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {imageError ? 'Failed to load image' : 'No Image'}
            </span>
          </div>
        )}
        
        {!imageLoaded && imageUrl && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl flex items-center justify-center">
            <span className="text-gray-400 text-xs">Loading...</span>
          </div>
        )}

        {/* RATING */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              filled={i < Math.floor(product.rating ?? 0)}
              className={`w-2 h-2 ${i < Math.floor(product.rating ?? 0) ? "text-white" : ""}`}
            />
          ))}

          <span className="text-[9px] text-white/90 ml-1">
            {(product.rating ?? 0).toFixed(1)}
          </span>
        </div>
      </div>

      <div
        className="relative w-full rounded-b-2xl p-3 border-t border-white/20 
                   bg-white/70 backdrop-blur-xl
                   shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                   flex items-center justify-between overflow-hidden"
      >
        <div className="flex flex-col w-[90%] z-10">
          <h3 className="font-semibold text-[10px] md:text-xs truncate text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-900">
              {/* Updated: For Arabic (currency then price), for English (price then currency) */}
              {i18n.language === "ar" ? `${currency} ${product.price}` : `${product.price} ${currency}`}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] line-through text-gray-500">
                {/* Updated: Same formatting for old price */}
                {i18n.language === "ar" ? `${currency} ${product.oldPrice}` : `${product.oldPrice} ${currency}`}
              </span>
            )}
          </div>
        </div>

        {/* MODERN CHAT BUTTON */}
        <button
          onClick={(e) => e.stopPropagation()}
          title="Chat"
          className="
            relative
            px-2 py-1.5
            rounded-[16px]
            bg-white/40
            backdrop-blur-2xl
            border border-[rgba(255,255,255,0.28)]
            shadow-[0_8px_24px_rgba(0,0,0,0.18)]
            hover:bg-white/55
            transition-all duration-300
          "
        >
          {/* Chrome liquid highlight */}
          <span
            className="
              absolute inset-0 rounded-[16px]
              bg-gradient-to-br from-white/70 via-white/10 to-transparent
              opacity-40
              pointer-events-none
            "
          />

          {/* Glass ribbon streak */}
          <span
            className="
              absolute inset-0 rounded-[16px]
              bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
              opacity-35
              pointer-events-none
            "
          />

          {/* Titanium black bottom depth */}
          <span
            className="
              absolute inset-0 rounded-[16px]
              bg-gradient-to-t from-black/20 to-transparent
              opacity-20
              pointer-events-none
            "
          />

          {/* Chat Icon */}
          <ChatIcon
            className="
              text-[rgba(18,18,18,0.88)]
              drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]
              relative z-10
            "
          />
        </button>
      </div>
    </div>
  );
});

function NewArrivalsComponent() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const { i18n } = useTranslation();
  const { fixedWords } = useFixedWords();
  
  const [apiProducts, setApiProducts] = useState(() => preloadedData.arrivalsProducts || []);
  const [isLoading, setIsLoading] = useState(() => preloadedData.arrivalsProducts === null);
  
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);
  const [cardWidth, setCardWidth] = useState('220px');
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    if (preloadedData.arrivalsProducts !== null) {
      setApiProducts(preloadedData.arrivalsProducts);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await getArrivalsProducts();
        if (!mounted) return;

        let arr = [];
        const products = res?.data?.data?.products;
        if (Array.isArray(products)) {
          arr = products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: null,
            img: product.image,
            rating: parseFloat(product.rating) || 0,
            description: product.description,
            isNewArrival: true,
            company_id: product.company_id,
            company_name: product.company_name || "Company",
            category_id: product.category_id,
            category_name: product.category_name || "Product"
          }));
        }

        setApiProducts(arr);
        setIsLoading(false);
        preloadedData.arrivalsProducts = arr;
        preloadImages(arr);
      } catch {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

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

  const combinedProducts = useMemo(() => {
    return Array.isArray(apiProducts) ? apiProducts : [];
  }, [apiProducts]);

  const handleToggleFav = useCallback((product) => toggleFavourite(product), [toggleFavourite]);
  const handleNavigate = useCallback((id) => navigate(`/newarrivalprofile/${id}`), [navigate]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let wheelTimeout;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        if (wheelTimeout) return;
        scrollContainer.scrollLeft += e.deltaY * 0.8;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 16);
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, []);

  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current && isInViewport) {
      const scrollAmount = window.innerWidth < 640 ? (window.innerWidth / 2) : 220;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }, [isInViewport]);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current && isInViewport) {
      const scrollAmount = window.innerWidth < 640 ? (window.innerWidth / 2) : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [isInViewport]);

  const skeletonLoader = useMemo(() => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex-none rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
        style={{ width: cardWidth, minWidth: cardWidth }}
      >
        <div className="w-full h-[140px] xs:h-[160px] sm:h-[180px] bg-gray-300 rounded-t-2xl" />
        <div className="p-3 bg-gray-200 rounded-b-2xl">
          <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ));
  }, [cardWidth]);

  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
      <div className="text-gray-400 text-6xl mb-4">📦</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No New Arrivals Available</h3>
      <p className="text-gray-500 max-w-md">Check back later for new products!</p>
    </div>
  ), []);
 
    // for fixed word
  const fw = fixedWords?.fixed_words || {};

  useEffect(() => {
    console.log("✅ NewArrivals FixedWords:", {
      new_arrivals: fw.new_arrivals,
      view_more: fw.view_more,
      full_fixedWords: fixedWords,
    });
  }, [fw, fixedWords]);

  return (
    <section 
      ref={sectionRef}
      className="py-6 sm:py-10 bg-white px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden"
    >
      <div className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
       <h2 className="text-4xl sm:text-5xl md:text-5xl font-light tracking-tight leading-tight text-gray-900">
        {fw.products}
      </h2>
        <div className="flex justify-end">
       <Link
          to="/newarrivalproducts"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 
                    tracking-wide transition-all duration-300 
                    flex items-center gap-1.5 group"
            >
          {fw.view_more}
          <ArrowOutwardIcon 
              className={`w-4 h-4 text-gray-400 
                        group-hover:text-gray-900 
                        transition-all duration-300
                        ${i18n.language === "ar" 
                          ? "group-hover:-translate-x-0.5 rotate-180" 
                          : "group-hover:translate-x-0.5"}`} 
            />
        </Link>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24
                     scrollbar-hide scroll-smooth
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-3 sm:gap-4">
            {isLoading ? skeletonLoader : combinedProducts.length > 0 ? (
              combinedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-none"
                  style={{ width: cardWidth, minWidth: cardWidth }}
                >
                  <ProductCard
                    product={product}
                    isFav={favourites.some(item => item.id === product.id)}
                    onToggleFavourite={handleToggleFav}
                    onNavigate={handleNavigate}
                    currency={fw.qar}
                  />
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center">{emptyState}</div>
            )}
          </div>
        </div>

        {!isLoading && combinedProducts.length > 0 && (
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
              className="bg-white/10 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-600 transition-all duration-300 ease-out hover:scale-110 active:scale-95 backdrop-blur-sm hover:shadow-2xl group"
              aria-label={i18n.language === "ar" ? "المنتجات التالية" : "Previous products"}
            >
              {i18n.language === "ar" ? (
                <ChevronRightIcon className="text-sm md:text-base  transition-transform duration-300 group-hover:translate-x-0.5" />
              ) : (
                <ChevronLeftIcon className="text-sm md:text-base   transition-transform duration-300 group-hover:-translate-x-0.5" />
              )}
            </button>

            <button
              onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
              className="bg-white/10 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-600 transition-all duration-300 ease-out hover:scale-110 active:scale-95 backdrop-blur-sm hover:shadow-2xl group"
              aria-label={i18n.language === "ar" ? "المنتجات السابقة" : "Next products"}
            >
              {i18n.language === "ar" ? (
                <ChevronLeftIcon className="text-sm md:text-base  transition-transform duration-300 group-hover:-translate-x-0.5" />
              ) : (
                <ChevronRightIcon className="text-sm md:text-base   transition-transform duration-300 group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </section> 
  );
}

export const NewArrivals = memo(NewArrivalsComponent);
export default NewArrivals;