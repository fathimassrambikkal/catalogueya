import { MdArrowOutward } from "react-icons/md";
import React, { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { useFavourites } from "../context/FavouriteContext";
import { getSalesProducts } from "../api";
import { useTranslation } from "react-i18next";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

let preloadedData = {
  salesProducts: null
};

// Pre-fetch
(async () => {
  try {
    const res = await getSalesProducts();
    
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
        isOnSale: true,
        company_id: product.company_id,
        company_name: product.company_name || "Company",
        category_id: product.category_id,
        category_name: product.category_name || "Product"
      }));
    }
    preloadedData.salesProducts = arr;
  } catch (err) {
    preloadedData.salesProducts = [];
  }
})();

// Preload images
const preloadImages = (products) => {
  if (!products) return;
  products.forEach((p) => {
    if (p?.img) {
      const imageUrl = p.img.startsWith("http") ? p.img : `${API_BASE_URL}/${p.img}`;
      const img = new Image();
      img.src = imageUrl;
      img.fetchPriority = "high";
    }
  });
};

if (preloadedData.salesProducts) {
  preloadImages(preloadedData.salesProducts);
}

const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1 });

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [ref]);

  return isIntersecting;
};

// CARD COMPONENT
const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    return imgPath.startsWith("http") ? imgPath : `${API_BASE_URL}/${imgPath}`;
  };

  const imageUrl = getImageUrl(product?.img);

  return (
    <div
      className="flex-none rounded-2xl overflow-hidden group cursor-pointer
                 bg-white/10 border border-white/30 backdrop-blur-2xl 
                 shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]
                 transition-all duration-700 transform-gpu"
      onClick={() => onNavigate(product.id)}
    >
      {/* FAV */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(product);
        }}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-md backdrop-blur-md border transition transform-gpu
        ${isFav ? "bg-red-100 border-red-200 text-red-600" : "bg-white/80 border-white/50 text-gray-600 hover:bg-red-50"}`}
      >
        <FaHeart className={`text-xs ${isFav ? "text-red-500" : "hover:text-red-400"}`} />
      </button>

      {/* IMAGE */}
      <div className="relative w-full h-[160px] xs:h-[180px] sm:h-[200px] overflow-hidden rounded-t-2xl">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-top transition duration-300 rounded-t-2xl border-b border-white/20
            ${imageLoaded ? "opacity-100" : "opacity-0"} group-hover:scale-105 transform-gpu`}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-2xl flex items-center justify-center">
            <span className="text-gray-500 text-sm">{imageError ? "Failed to load image" : "No Image"}</span>
          </div>
        )}

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl" />
        )}

        {/* RATING */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`w-2 h-2 ${i < Math.floor(product.rating ?? 0) ? "text-white" : "text-gray-400"}`}
            />
          ))}
          <span className="text-[9px] text-white/90 ml-1">{(product.rating ?? 0).toFixed(1)}</span>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="relative w-full p-3 rounded-b-2xl bg-white/70 backdrop-blur-xl border-t border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.15)] flex items-center justify-between">
        <div className="flex flex-col w-[80%]">
          <h3 className="font-semibold text-xs truncate text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-900">QAR {product.price}</span>
            {product.oldPrice && <span className="text-[10px] text-gray-500 line-through">QAR {product.oldPrice}</span>}
          </div>
        </div>

        {/* ⭐ UPDATED MODERN CHAT BUTTON ⭐ */}
        <button
          onClick={(e) => e.stopPropagation()}
          title="Chat"
          className="
            relative px-2 py-1.5 rounded-[16px]
            bg-white/40 backdrop-blur-2xl
            border border-white/40
            shadow-[0_8px_24px_rgba(0,0,0,0.18)]
            hover:bg-white/60
            transition-all duration-300
            overflow-hidden
          "
        >
          <span className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-white/70 to-transparent opacity-40 pointer-events-none" />
          <LuMessageSquareMore className="text-[17px] text-neutral-900/90 drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)] relative z-10" />
        </button>
      </div>
    </div>
  );
});

// MAIN SALES COMPONENT
function SalesComponent() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const { i18n } = useTranslation();

  const [apiProducts, setApiProducts] = useState(() => preloadedData.salesProducts || []);
  const [isLoading, setIsLoading] = useState(() => preloadedData.salesProducts === null);

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);

  const [cardWidth, setCardWidth] = useState("220px");

  // Card width logic
  useEffect(() => {
    const updateCardWidth = () => {
      const w = window.innerWidth;
      if (w < 640) setCardWidth("calc(45vw - 20px)");
      else if (w < 768) setCardWidth("220px");
      else setCardWidth("240px");
    };
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Load data
  useEffect(() => {
    if (preloadedData.salesProducts !== null) {
      setApiProducts(preloadedData.salesProducts);
      setIsLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await getSalesProducts();
        if (!mounted) return;

        let arr = [];
        const products = res?.data?.data?.products;

        if (Array.isArray(products)) {
          arr = products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: null,
            img: product.image,
            rating: parseFloat(product.rating) || 0,
            description: product.description,
            company_id: product.company_id,
            company_name: product.company_name || "Company",
            category_id: product.category_id,
            category_name: product.category_name || "Product"
          }));
        }

        setApiProducts(arr);
        setIsLoading(false);
        preloadedData.salesProducts = arr;
        preloadImages(arr);
      } catch (err) {
        setIsLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const combinedProducts = useMemo(() => apiProducts || [], [apiProducts]);

  const handleToggleFav = useCallback((product) => toggleFavourite(product), [toggleFavourite]);
  const handleNavigate = useCallback((id) => navigate(`/salesproduct/${id}`), [navigate]);

  // horizontal scroll wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const wheelHandler = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 0.8;
      }
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, []);

  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const amount = window.innerWidth < 640 ? window.innerWidth / 2 : 220;
    scrollContainerRef.current.scrollBy({ left: -amount, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    const amount = window.innerWidth < 640 ? window.innerWidth / 2 : 220;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // skeleton
  const skeletonLoader = Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
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

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
      <div className="text-gray-400 text-6xl mb-4">🏷️</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Sales Products Available</h3>
      <p className="text-gray-500 max-w-md">Check back later for exciting sales and discounts!</p>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-6 sm:py-10 bg-amber-300 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex flex-row items-end justify-between mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">
          Sales
        </h1>
        <Link
          to="/salesproducts"
          className="relative font-medium text-gray-800 overflow-hidden group h-6 sm:h-7 flex items-center text-xs sm:text-base mt-1"
        >
          <span className="flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full md:text-lg tracking-tighter">
            View more
            <MdArrowOutward className="text-lg" />
          </span>

          <span className="absolute left-0 top-full flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full text-sm md:text-lg tracking-tighter">
            View more
            <MdArrowOutward className="text-lg" />
          </span>
        </Link>
      </div>

      {/* SCROLLER */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 
                     scrollbar-hide scroll-smooth"
        >
          <div className="flex gap-3 sm:gap-4">
            {isLoading
              ? skeletonLoader
              : combinedProducts.length > 0
              ? combinedProducts.map((product) => (
                  <div
                    key={product.id}
                    style={{ width: cardWidth, minWidth: cardWidth }}
                  >
                    <ProductCard
                      product={product}
                      isFav={favourites.some((item) => item.id === product.id)}
                      onToggleFavourite={toggleFavourite}
                      onNavigate={handleNavigate}
                    />
                  </div>
                ))
              : emptyState}
          </div>
        </div>

        {/* ARROWS */}
        {!isLoading && combinedProducts.length > 0 && (
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
              className="bg-white/10 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300/80 text-gray-900 transition-all hover:scale-110 active:scale-95 backdrop-blur-sm hover:shadow-2xl group"
            >
              {i18n.language === "ar" ? (
                <FaChevronRight className="text-sm group-hover:translate-x-0.5" />
              ) : (
                <FaChevronLeft className="text-sm group-hover:-translate-x-0.5" />
              )}
            </button>

            <button
              onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
              className="bg-white/10 hover:bg-white rounded-full p-3 shadow-xl border border-gray-300/80 text-gray-900 transition-all hover:scale-110 active:scale-95 backdrop-blur-sm hover:shadow-2xl group"
            >
              {i18n.language === "ar" ? (
                <FaChevronLeft className="text-sm group-hover:-translate-x-0.5" />
              ) : (
                <FaChevronRight className="text-sm group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export const Sales = memo(SalesComponent);
export default Sales;
