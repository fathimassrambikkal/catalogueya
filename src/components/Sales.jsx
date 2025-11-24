import { MdArrowOutward } from "react-icons/md";
import React, { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaWhatsapp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";
import { useFavourites } from "../context/FavouriteContext";
import { getSalesProducts } from "../api";
import { useTranslation } from "react-i18next";

const whatsappNumber = "97400000000";

const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate }) => (
  <div
    className="flex-none w-[280px] sm:w-[320px] rounded-3xl overflow-hidden group cursor-pointer
               bg-white/10 border border-white/30 backdrop-blur-2xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
               hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
               transition-all duration-700 mr-6"
    onClick={() => onNavigate(product.id)}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavourite(product);
      }}
      className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition backdrop-blur-md border 
        ${isFav ? "bg-red-100 text-red-600 border-red-200" : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}`}
    >
      <FaHeart className={`text-xs sm:text-sm md:text-base ${isFav ? "text-red-500" : "hover:text-red-400"}`} />
    </button>

    <div className="relative w-full h-[240px] xs:h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden rounded-t-3xl">
      <img
        src={product.img}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-cover object-top rounded-t-3xl border-b border-white/20 
                 transition-transform duration-500 ease-out transform group-hover:scale-105"
      />
      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating ?? 0) ? "text-white" : "text-gray-400"}`} />
        ))}
        <span className="text-[10px] text-white/90 ml-1">{(product.rating ?? 0).toFixed(1)}</span>
      </div>
    </div>

    <div
      className="relative w-full rounded-b-2xl p-3 sm:p-4 border-t border-white/20 
                 bg-white/70 backdrop-blur-xl
                 shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                 flex items-center justify-between overflow-hidden"
    >
      <div className="flex flex-col w-[80%] z-10">
        <h3 className="font-semibold text-[11px] xs:text-xs sm:text-sm truncate text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-[11px] xs:text-[12px] sm:text-sm font-bold text-gray-900">QAR {product.price}</span>
          {product.oldPrice && (
            <span className="text-[9px] xs:text-[10px] sm:text-xs line-through text-gray-500">QAR {product.oldPrice}</span>
          )}
        </div>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-2 bg-green-500/80 backdrop-blur-sm rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
      </a>
    </div>
  </div>
));

function SalesComponent() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const { i18n } = useTranslation();
  const [apiProducts, setApiProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  // FIXED API FETCH — always returns an array 
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getSalesProducts();
        if (!mounted) return;

        let arr = [];

        if (Array.isArray(res)) arr = res;
        else if (Array.isArray(res?.data)) arr = res.data;
        else if (Array.isArray(res?.products)) arr = res.products;
        else console.warn("Unexpected API response format:", res);

        setApiProducts(arr);
      } catch (err) {
        console.warn("Failed to fetch sales products:", err);
        setApiProducts([]); 
      }
    })();

    return () => (mounted = false);
  }, []);

  // SAFE MERGE (prevents crash)
  const combinedProducts = useMemo(() => {
    const api = Array.isArray(apiProducts) ? apiProducts : [];
    const local = Array.isArray(unifiedData.salesProducts)
      ? unifiedData.salesProducts
      : [];

    return [...api, ...local];
  }, [apiProducts]);

  // Don't limit products for horizontal scroll
  const handleToggleFav = useCallback((product) => toggleFavourite(product), [toggleFavourite]);
  const handleNavigate = useCallback((id) => navigate(`/salesproduct/${id}`), [navigate]);

  // Horizontal scroll with wheel
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY * 0.8;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Navigation button handlers
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-6 sm:py-10 bg-neutral-100 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
      {/* Header */}
      <div className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal md:font-light tracking-tighter text-gray-900">
          Sales
        </h1>
        <div className="flex justify-end">
          <Link
            to="/salesproducts"
            className="relative font-medium text-gray-800 overflow-hidden group h-6 sm:h-7 flex items-center text-xs sm:text-base mt-1"
          >
            <span className="flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full  md:text-lg tracking-tighter">
              View more
              <span className="inline-block text-gray-500 transition-transform duration-300 group-hover:translate-x-1">
                <MdArrowOutward className="text-lg" />
              </span>
            </span>
            <span className="absolute left-0 top-full flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full text-sm md:text-lg tracking-tighter">
              View more
              <span className="inline-block text-gray-500 transition-transform duration-300 group-hover:translate-x-1">
                <MdArrowOutward className="text-lg" />
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24
                     scrollbar-hide scroll-smooth
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6">
            {combinedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={favourites.some(item => item.id === product.id)}
                onToggleFavourite={handleToggleFav}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Positioned at bottom right - Only icons swap in Arabic */}
        <div className="flex justify-end mt-4 gap-3">
          <button
            onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
            className="
              bg-white/10 hover:bg-white 
              rounded-full p-3 sm:p-4
              shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-900
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              backdrop-blur-sm
              hover:shadow-2xl
              group
            "
            aria-label={i18n.language === "ar" ? "المنتجات التالية" : "Previous products"}
            style={{ willChange: 'transform' }}
          >
            {i18n.language === "ar" ? (
              <FaChevronRight className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-0.5" />
            ) : (
              <FaChevronLeft className="text-sm sm:text-base transition-transform duration-300 group-hover:-translate-x-0.5" />
            )}
          </button>

          <button
            onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
            className="
              bg-white/10 hover:bg-white 
              rounded-full p-3 sm:p-4
              shadow-xl border border-gray-300/80 hover:bg-white/20 text-gray-900
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              backdrop-blur-sm
              hover:shadow-2xl
              group
            "
            aria-label={i18n.language === "ar" ? "المنتجات السابقة" : "Next products"}
            style={{ willChange: 'transform' }}
          >
            {i18n.language === "ar" ? (
              <FaChevronLeft className="text-sm sm:text-base transition-transform duration-300 group-hover:-translate-x-0.5" />
            ) : (
              <FaChevronRight className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export const Sales = memo(SalesComponent);
export default Sales;