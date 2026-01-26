import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { getArrivalsProducts, createCustomerConversation } from "../api";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
import { resolveProductRoute } from "../utils/productNavigation";
import SmartImage from "../components/SmartImage";
import { warn, error } from "../utils/logger";

// Import shared components
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowOutwardIcon 
} from "../components/SvgIcon";

import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useIsInViewport } from "../hooks/useIsInViewport";
import { useCardWidth } from "../hooks/useCardWidth";





function NewArrivalsComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);

  const { i18n } = useTranslation();
  const { fixedWords } = useFixedWords();
  
  // Use shared hooks
  const [apiProducts, setApiProducts] = useState([]);
  const cardWidth = useCardWidth();
  
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);

  // ✅ Fetch data immediately on mount - non-blocking
  useEffect(() => {
    let mounted = true;
    let isFetching = false;
    
    const fetchData = async () => {
      if (isFetching) return;
      isFetching = true;
      
      try {
        const res = await getArrivalsProducts(1);
        const paginated = res?.data?.data?.products;

        if (!mounted || !paginated?.data) return;

      const mapped = paginated.data.map(product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  oldPrice: null,

  // ✅ keep raw backend image object
  image: product.image,

  description: product.description,
  isNewArrival: true,
  company_id: product.company_id?.id,
  company_name: product.company_name?.name || "Company",
  category_id: product.category_id,
}));


        setApiProducts(mapped);
        
      
    
      } catch (err) {
        error("NewArrivals: failed to load products", err);
      } finally {
        isFetching = false;
      }
    };

    // Start fetch immediately but don't block UI
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, []);

  const isProductFav = useCallback(
    (productId) => favouriteItems.some((p) => p.id === productId),
    [favouriteItems]
  );

  const handleToggleFav = useCallback((product) => {
    const isAlreadyFav = favouriteItems.some((p) => p.id === product.id);
    dispatch(toggleFavourite(product));

    if (auth.user && !isAlreadyFav) {
      dispatch(
        openListPopup({
          ...product,
          source: "new_arrivals",
        })
      );
    }
  }, [auth.user, favouriteItems, dispatch]);

  const handleNavigate = useCallback(
    (product) => navigate(resolveProductRoute({
      ...product,
      source: "new_arrivals",
    })),
    [navigate]
  );

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
      warn("NewArrivals: chat creation failed", err);
    }
  };

  const fw = fixedWords?.fixed_words || {};
  
  // ✅ Always show skeleton initially, then replace with products
  const displayProducts = apiProducts.length > 0 ? apiProducts : [];
  const showSkeleton = apiProducts.length === 0;
 



  return (
    <section 
      ref={sectionRef}
      className="py-6 sm:py-10 bg-white px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden"
      style={{ contentVisibility: "auto" }}
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
          scroll-pl-3 scroll-pr-0 sm:scroll-pr-0

                     scrollbar-hide scroll-smooth
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-3 sm:gap-4">
            <div className="shrink-0 w-px" />
            {showSkeleton ? (
              // ✅ Show shimmering skeletons immediately (4 cards)
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} width={cardWidth} />
              ))
            ) : (
              // ✅ Show real products when loaded
              displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-none"
                  style={{ width: cardWidth, minWidth: cardWidth }}
                >
              <ProductCard
  product={product}
  isFav={isProductFav(product.id)}
  onToggleFavourite={handleToggleFav}
  onNavigate={handleNavigate}
  onChat={handleChatClick}
  currency={fw.qar}

  imageSlot={
    <SmartImage
      image={product.image}   // 👈 raw { avif, webp }
      alt={product.name}
      loading="lazy"
      className="w-full h-full object-cover rounded-t-2xl
                 transition-transform duration-300 group-hover:scale-105"
    />
  }
/>

                </div>
              ))
            )}
          </div>
        </div>

        {!showSkeleton && displayProducts.length > 0 && (
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
              className=" bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600
            rounded-full p-1.5 sm:p-2.5
            shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.06] active:scale-[0.95] backdrop-blur-sm hover:shadow-2xl group"
              aria-label={i18n.language === "ar" ? "المنتجات التالية" : "Previous products"}
            >
              {i18n.language === "ar" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
              className=" bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600
            rounded-full p-1.5 sm:p-2.5
            shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.06] active:scale-[0.95] group"
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

export const NewArrivals = memo(NewArrivalsComponent);
export default NewArrivals;