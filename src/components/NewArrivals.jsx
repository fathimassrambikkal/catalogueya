import { MdArrowOutward } from "react-icons/md";
import React, { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { useFavourites } from "../context/FavouriteContext";
import { getArrivalsProducts } from "../api";
import { useTranslation } from "react-i18next";

const whatsappNumber = "97400000000";

// Use the same base URL as your API
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// Pre-fetch data immediately when module loads
let preloadedData = {
  arrivalsProducts: null
};

// Start fetching immediately
(async () => {
  try {
    console.log("🔄 Starting pre-fetch of arrivals products...");
    const res = await getArrivalsProducts();
    
    let arr = [];
    const products = res?.data?.data?.products;
    if (Array.isArray(products)) {
      console.log("✅ API returned data.data.products array");
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

    console.log("✅ Pre-fetch successful. Products found:", arr.length);
    preloadedData.arrivalsProducts = arr;
  } catch (err) {
    console.warn("❌ Pre-fetch failed:", err);
    preloadedData.arrivalsProducts = [];
  }
})();

// Preload images immediately with high priority
const preloadImages = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  console.log("🖼️ Preloading images for", products.length, "products");
  products.forEach((product) => {
    if (product?.img) {
      const img = new Image();
      const imageUrl = product.img.startsWith('http') ? product.img : `${API_BASE_URL}/${product.img}`;
      img.src = imageUrl;
      img.fetchPriority = 'high';
      console.log(`🖼️ Preloading image: ${imageUrl}`);
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

const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE_URL}/${imgPath}`;
  };

  const imageUrl = getImageUrl(product?.img);

  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully:", imageUrl);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.warn('❌ Failed to load product image:', imageUrl);
    setImageLoaded(true);
    setImageError(true);
  };

  return (
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
      {/* FAV BUTTON */}
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
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover object-top rounded-t-2xl border-b border-white/20 
                       transition-all duration-300 ease-out group-hover:scale-105 transform-gpu
                       ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              contentVisibility: 'auto',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
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

        {/* ✅ MODERN CHAT BUTTON  */}
<button
  onClick={(e) => e.stopPropagation()}
  title="Chat"
  className="
    relative
    px-2 py-1.5
    rounded-[16px]

    /* Base glass layer */
    bg-white/40
    backdrop-blur-2xl
    
    /* Titanium  */
    border border-[rgba(255,255,255,0.28)]

    /* VisionOS floating  */
    shadow-[0_8px_24px_rgba(0,0,0,0.18)]

    /* Smooth hover */
    hover:bg-white/55
    transition-all duration-300
  "
>
  {/* Chrome liquid highlight */}
  <span className="
    absolute inset-0 rounded-[16px]
    bg-gradient-to-br from-white/70 via-white/10 to-transparent
    opacity-40
    pointer-events-none
  " />

  {/* Glass ribbon streak */}
  <span className="
    absolute inset-0 rounded-[16px]
    bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
    opacity-35
    pointer-events-none
  " />

  {/* Titanium black bottom depth */}
  <span className="
    absolute inset-0 rounded-[16px]
    bg-gradient-to-t from-black/20 to-transparent
    opacity-20
    pointer-events-none
  " />
  <LuMessageSquareMore 
    className="
      text-[17px]
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
      } catch (err) {
        console.warn("❌ Failed to fetch new arrivals products:", err);
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
        className="flex-none rounded-2xl overflow-hidden bg-gray-200 animate-pulse transform-gpu"
        style={{ width: cardWidth, minWidth: cardWidth, willChange: 'transform' }}
      >
        <div className="w-full h-[140px] xs:h-[160px] sm:h-[180px] bg-gray-300 rounded-t-2xl transform-gpu" />
        <div className="p-3 bg-gray-200 rounded-b-2xl transform-gpu">
          <div className="h-3 bg-gray-300 rounded mb-2 w-3/4 transform-gpu"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 transform-gpu"></div>
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

  return (
    <section 
      ref={sectionRef}
      className="py-6 sm:py-10 bg-neutral-100 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden transform-gpu"
      style={{ contentVisibility: 'auto', willChange: 'transform' }}
    >
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

      <div className="relative transform-gpu">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24
                     scrollbar-hide scroll-smooth transform-gpu
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', willChange: 'transform' }}
        >
          <div className="flex gap-3 sm:gap-4 transform-gpu">
            {isLoading ? skeletonLoader : combinedProducts.length > 0 ? (
              combinedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-none transform-gpu"
                  style={{ width: cardWidth, minWidth: cardWidth, willChange: 'transform' }}
                >
                  <ProductCard
                    product={product}
                    isFav={favourites.some(item => item.id === product.id)}
                    onToggleFavourite={handleToggleFav}
                    onNavigate={handleNavigate}
                  />
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center">{emptyState}</div>
            )}
          </div>
        </div>

        {!isLoading && combinedProducts.length > 0 && (
          <div className="flex justify-end mt-4 gap-3 transform-gpu">
            <button
              onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
              className="bg-white/10 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-900 transition-all duration-300 ease-out hover:scale-110 active:scale-95 backdrop-blur-sm hover:shadow-2xl group transform-gpu"
              aria-label={i18n.language === "ar" ? "المنتجات التالية" : "Previous products"}
            >
              {i18n.language === "ar" ? (
                <FaChevronRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 transform-gpu" />
              ) : (
                <FaChevronLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-0.5 transform-gpu" />
              )}
            </button>

            <button
              onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
              className="bg-white/10 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-900 transition-all duration-300 ease-out hover:scale-110 active:scale-95 backdrop-blur-sm hover:shadow-2xl group transform-gpu"
              aria-label={i18n.language === "ar" ? "المنتجات السابقة" : "Next products"}
            >
              {i18n.language === "ar" ? (
                <FaChevronLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-0.5 transform-gpu" />
              ) : (
                <FaChevronRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 transform-gpu" />
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
