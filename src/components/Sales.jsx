import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSalesProducts, createCustomerConversation } from "../api";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";

// Import shared components
import { 
  ArrowOutwardIcon,
  ChevronLeft,
  ChevronRight 
} from "../components/SvgIcon";
import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useIsInViewport } from "../hooks/useIsInViewport";
import { useCardWidth } from "../hooks/useCardWidth";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// MAIN SALES COMPONENT
function SalesComponent() {
  const { fixedWords } = useFixedWords();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);

  // ✅ IMMEDIATE skeleton display - no initial loading state
  const [apiProducts, setApiProducts] = useState([]);
  const cardWidth = useCardWidth();
  
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);

  // ✅ Fetch data immediately - non-blocking
  useEffect(() => {
    let mounted = true;
    let isFetching = false;
    
    const fetchSales = async () => {
      if (isFetching) return;
      isFetching = true;
      
      try {
        const res = await getSalesProducts(1);
        const paginated = res?.data?.data?.products;

        if (!mounted || !paginated?.data) return;

        const mapped = paginated.data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.discount_price || product.price,
          oldPrice: product.discount_price ? product.price : null,
          img: product.image,
          rating: parseFloat(product.rating) || 0,
          description: product.description,
          company_id: product.company_id?.id,
          company_name: product.company_name || "Company",
          category_id: product.category_id,
        }));

        setApiProducts(mapped);
        
        // Preload images in background
        mapped.forEach(product => {
          if (product?.img) {
            const img = new Image();
            const imageUrl = product.img.startsWith('http') ? product.img : `${API_BASE_URL}/${product.img}`;
            img.src = imageUrl;
            img.fetchPriority = 'high';
          }
        });
      } catch (err) {
        console.error("Failed to load sales products", err);
      } finally {
        isFetching = false;
      }
    };

    fetchSales();
    return () => { mounted = false; };
  }, []);

  const handleToggleFav = useCallback((product) => {
    const isAlreadyFav = favourites.some((p) => p.id === product.id);
    
    dispatch(toggleFavourite({
      ...product,
      source: "sales",
    }));

    if (auth.user && !isAlreadyFav) {
      dispatch(
        openListPopup({
          ...product,
          source: "sales",
        })
      );
    }
  }, [auth.user, favourites, dispatch]);

  const handleChatClick = async (product) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const companyId = product.company_id;

    if (!token || userType !== "customer") {
      navigate(`/sign?redirect=/chat-intent/company/${companyId}`);
      return;
    }

    try {
      const res = await createCustomerConversation({
        is_group: false,
        participant_ids: [Number(companyId)],
      });

      const conversationId = res.data?.data?.id || res.data?.conversation?.id || res.data?.id;
      if (conversationId) {
        navigate(`/customer-login/chat/${conversationId}`);
      }
    } catch (err) {
      console.error("Chat creation failed", err);
    }
  };

  const handleNavigate = useCallback((product) => navigate(`/salesproduct/${product.id}`), [navigate]);

  // Scroll wheel handling
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

  const fw = fixedWords?.fixed_words || {};
  
  // ✅ Always show skeleton initially, then replace with products
  const displayProducts = apiProducts.length > 0 ? apiProducts : [];
  const showSkeleton = apiProducts.length === 0;

  return (
    <section 
      ref={sectionRef}
      className="py-6 sm:py-10 bg-amber-300 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
      <div className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight text-gray-900">
          {fw.sales}
        </h2>
        <div className="flex justify-end">
          <Link
            to="/salesproducts"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 
               tracking-wide transition-all duration-300 
               flex items-center gap-1.5 group"
            aria-label="View all sales products"
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
          <div className="flex gap-3 sm:gap-4 items-stretch">
            {showSkeleton ? (
              // ✅ Show shimmering skeletons immediately (4 cards)
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} width={cardWidth} />
              ))
            ) : (
              // ✅ Show real products when loaded
              displayProducts.map((product) => {
                const cardHeight = window.innerWidth < 640 ? '224px' : 
                                  window.innerWidth < 768 ? '244px' : '264px';
                
                return (
                  <div
                    key={product.id}
                    className="flex-none"
                    style={{ 
                      width: cardWidth, 
                      minWidth: cardWidth,
                      height: cardHeight
                    }}
                  >
                    <ProductCard
                      product={product}
                      isFav={favourites.some(item => item.id === product.id)}
                      onToggleFavourite={handleToggleFav}
                      onNavigate={() => handleNavigate(product)}
                      onChat={handleChatClick}
                      currency={fw.qar}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {!showSkeleton && displayProducts.length > 0 && (
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
              className="bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600 rounded-full p-1.5 sm:p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.06] active:scale-[0.95] backdrop-blur-sm hover:shadow-2xl group"
              aria-label={i18n.language === "ar" ? "المنتجات التالية" : "Previous products"}
            >
              {i18n.language === "ar" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
              className="bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600 rounded-full p-1.5 sm:p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.06] active:scale-[0.95] group"
              aria-label={i18n.language === "ar" ? "المنتجات السابقة" : "Next products"}
            >
              {i18n.language === "ar" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>
    </section> 
  );
}

export const Sales = memo(SalesComponent);
export default Sales;