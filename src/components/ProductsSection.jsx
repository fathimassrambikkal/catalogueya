import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
import {
  createCustomerConversation,
  getHighlights,
  getHomeProducts,
} from "../api";
import { warn, error as logError } from "../utils/logger";

import {
  ChevronLeft,
  ChevronRight,
  ArrowOutwardIcon,
   EmptyProductsIcon
} from "./SvgIcon";

import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./Skeletons";
import { useCardWidth } from "../hooks/useCardWidth";

function ProductsSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favouriteItems = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { i18n } = useTranslation();
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const [apiProducts, setApiProducts] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const cardWidth = useCardWidth();

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastItemRef = useRef(null);


  const tabs = useMemo(() => {
    return [
      { key: "all", label: fw.all_products || "All Products" },
      ...highlights
    ];
  }, [highlights, fw.all_products]);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if tabs overflow and set arrow visibility
  const checkOverflow = useCallback(() => {
    if (!isMobile) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    const container = tabsContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const hasOverflow = scrollWidth > clientWidth;
    
    if (hasOverflow) {
      const isRTL = i18n.language === "ar";
      
      if (isRTL) {
        // RTL: scrollLeft is negative
        setShowLeftArrow(scrollLeft < -5); // Can scroll right (shows left arrow)
        setShowRightArrow(Math.abs(scrollLeft) < scrollWidth - clientWidth - 5); // Can scroll left (shows right arrow)
      } else {
        // LTR
        setShowLeftArrow(scrollLeft > 5); // Can scroll left
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Can scroll right
      }
    } else {
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }
  }, [isMobile, i18n.language]);

  // Check overflow on mount, resize, and scroll
  useEffect(() => {
    checkOverflow();
    
    const handleResize = () => {
      checkOverflow();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkOverflow]);

  // Handle scroll events to update arrows
  const handleScroll = useCallback(() => {
    if (isMobile) {
      checkOverflow();
    }
  }, [isMobile, checkOverflow]);

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Update slider position
useEffect(() => {
  const index = tabs.findIndex(t => t.key === activeTab);
  const el = tabRefs.current[index];

  if (!el) return;

  requestAnimationFrame(() => {
    const { offsetLeft, offsetWidth } = el;
    const container = tabsContainerRef.current;

    if (!container) return;

    setSliderStyle({
      width: offsetWidth,
      left: offsetLeft,
    });

    // FIXED auto scroll
    if (isMobile) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  });
}, [activeTab, tabs, i18n.language, isMobile]);

  // Move to previous tab
  const moveTabLeft = () => {
    const index = tabs.findIndex(t => t.key === activeTab);
    if (index > 0) {
      setActiveTab(tabs[index - 1].key);
    }
  };

  // Move to next tab
  const moveTabRight = () => {
    const index = tabs.findIndex(t => t.key === activeTab);
    if (index < tabs.length - 1) {
      setActiveTab(tabs[index + 1].key);
    }
  };

  useEffect(() => {
    tabRefs.current = [];
  }, [tabs]);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const res = await getHighlights();
        const highlightsData = res.data?.data?.heighlight || [];

        const tabsList = highlightsData.map((h) => ({
          key: h.key,
          label: h.name,
        }));

        setHighlights(tabsList);
      } catch (err) {
        console.error("Critical error loading highlights", err);
      }
    };

    loadHighlights();
  }, []);


  const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsFetchingMore(true);

      const res = await getHomeProducts(pageNum);
      
      const rawProducts = res.data?.data?.products?.data || [];
      const pagination = res.data?.data?.products || {};
      
      const mapped = rawProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        rating: parseFloat(p.rating) || 0,
        description: p.description,
        company_id: p.company?.id,
        company_name: p.company?.name || "Company",
        whatsapp: p.company?.whatsapp || p.company?.watsapp || null,
        type: p.type || (p.sale ? "sales" : p.type),
        specialMarks: p.specialMarks || [],
        sale: p.sale || null,
        highlight: p.specialMarks?.[0]?.key || (p.type === "sales" || p.sale ? "on_sales" : null),
      }));

      if (isInitial) {
        setApiProducts(mapped);
      } else {
        setApiProducts((prev) => [...prev, ...mapped]);
      }
      
      setHasMore(pagination.current_page < pagination.last_page);
    } catch (err) {
      logError("ProductsSection: failed to load products", err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1, true);
    setPage(1);
  }, [fetchProducts]);

  const displayProducts = useMemo(() => {
    if (activeTab === "all") return apiProducts;
    return apiProducts.filter(
      product => product.highlight === activeTab
    );
  }, [apiProducts, activeTab]);

  // Observer for Infinite Scroll
  useEffect(() => {
    if (isLoading || isFetchingMore || !hasMore) return;

    // Check if we need more products to fill the screen for the current tab
    // If the filtered list is short but there are more products on the server, fetch more
    const MIN_REQUIRED_ITEMS = 6;
    if (displayProducts.length < MIN_REQUIRED_ITEMS && hasMore && !isFetchingMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage);
        }
      },
      { threshold: 0.1, root: scrollContainerRef.current }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, isFetchingMore, hasMore, page, fetchProducts, displayProducts.length]);



  const isProductFav = useCallback(
    (productId) => favouriteItems.some((p) => p.id === productId),
    [favouriteItems]
  );

  const handleToggleFav = useCallback(
    (product) => {
      const isAlreadyFav = favouriteItems.some((p) => p.id === product.id);

      dispatch(
        toggleFavourite({
          ...product,
          source: "products",
        })
      );

      if (auth.user && !isAlreadyFav) {
        dispatch(
          openListPopup({
            ...product,
            source: "products",
          })
        );
      }
    },
    [auth.user, favouriteItems, dispatch]
  );

  const handleNavigate = useCallback(
    (product) => {
      navigate(`/product/${product.id}`);
    },
    [navigate]
  );

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

      const conversationId =
        res.data?.data?.id || res.data?.conversation?.id || res.data?.id;

      if (conversationId) {
        navigate(`/customer-login/chat/${conversationId}`);
      }
    } catch (err) {
      warn("ProductsSection: chat creation failed", err);
    }
  };

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
        }, 16);
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, []);

  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.8 : 400;
      scrollContainerRef.current.scrollBy({
        left: i18n.language === "ar" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  }, [i18n.language]);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? window.innerWidth * 0.8 : 400;
      scrollContainerRef.current.scrollBy({
        left: i18n.language === "ar" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, [i18n.language]);




  const showSkeleton = isLoading && apiProducts.length === 0;


  return (
    <section
      ref={sectionRef}
     className="
bg-white overflow-hidden
py-14
sm:py-20
md:py-24
lg:py-28
xl:py-32
2xl:py-36
px-4
sm:px-8
md:px-12
lg:px-20
xl:px-28
2xl:px-36
"
      style={{ contentVisibility: "auto" }}
    >
      <div className="max-w-[1600px] mx-auto mb-10 sm:mb-14 lg:mb-16">
        {/* Top row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2  className="
text-3xl
sm:text-4xl
md:text-5xl
lg:text-6xl
font-light
tracking-tight
text-gray-900
leading-tight
">
            {fw.products_services || "Products & Services"}
          </h2>
          <Link
            to={
              activeTab === "all" 
                ? "/productviewmore"  
                : `/heighlights${activeTab}viewmore` 
            }
            className="text-[12px] md:text-sm font-medium text-gray-600 hover:text-gray-900 tracking-wide transition flex items-center gap-1.5 group"
          >
            {fw.view_more}
            <ArrowOutwardIcon className={`w-4 h-4 text-gray-400 group-hover:text-gray-900 transition ${
              i18n.language === "ar" ? "group-hover:-translate-x-0.5 rotate-180" : "group-hover:translate-x-0.5"
            }`} />
          </Link>
        </div>

        {/*  tabs with arrows INSIDE the pill */}
        <div
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          className="relative"
        >
          {/* Outer pill container - full gray background */}
          <div className="relative bg-gray-100 rounded-full p-[1px] md:p-[2px] inline-flex items-center max-w-full">
            {/* LEFT ARROW - inside the pill */}
            {showLeftArrow && (
              <button
                onClick={moveTabLeft}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 shrink-0 md:hidden"
                aria-label={i18n.language === "ar" ? "السابق" : "Previous"}
              >
               {i18n.language === "ar" ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
              </button>
            )}

            {/* Tabs Container */}
            <div
              ref={tabsContainerRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ 
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                maxWidth: showLeftArrow || showRightArrow ? 'calc(100% - 64px)' : '100%'
              }}
            >
              <div className="flex gap-1 min-w-max relative">
                {/* Sliding blue pill */}
                <div
                  className="absolute top-[1px] bottom-[1px] bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                  style={sliderStyle}
                />

                {/* Tab buttons */}
                {tabs.map((tab, index) => (
                  <button
                    key={tab.key}
                    ref={(el) => (tabRefs.current[index] = el)}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      relative z-10 whitespace-nowrap
                      px-[18px] py-[10px] sm:px-[22px] sm:py-[12px]
                      text-sm font-medium rounded-full
                      transition-colors duration-300
                      ${
                        activeTab === tab.key
                          ? "text-white"
                          : "text-gray-700 hover:text-gray-900"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT ARROW - inside the pill */}
            {showRightArrow && (
              <button
                onClick={moveTabRight}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 shrink-0 md:hidden"
                aria-label={i18n.language === "ar" ? "التالي" : "Next"}
              >
                 {i18n.language === "ar" ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 scroll-pl-3 scroll-pr-0 sm:scroll-pr-0 scrollbar-hide scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-3 sm:gap-4 items-stretch">
            <div className="shrink-0 w-px" />
{showSkeleton ? (
  Array.from({ length: 4 }).map((_, index) => (
    <ProductCardSkeleton key={`skeleton-${index}`} width={cardWidth} />
  ))
) : displayProducts.length === 0 ? (
  <div className="w-full flex items-center justify-center py-24">
    <div className="flex flex-col items-center text-center max-w-xs">
      
      <div className="w-16 h-16 mb-4 text-gray-400">
        <EmptyProductsIcon className="w-full h-full" />
      </div>

      <p className="text-sm font-medium text-gray-700">
        {fw.no_products_found || "No products found"}
      </p>

  

    </div>
  </div>
) : (
  displayProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  ref={index === displayProducts.length - 1 ? lastItemRef : null}
                  className="flex-none"
                  style={{ width: cardWidth, minWidth: cardWidth }}
                >
                  <ProductCard
                    product={product}
                    activeTab={activeTab}

                    isFav={isProductFav(product.id)}
                    onToggleFavourite={handleToggleFav}
                    onNavigate={handleNavigate}
                    onChat={handleChatClick}
                    currency={fw.qar}
                    priceSlot={null}
                    imageSlot={
                      <picture>
                        {product.image?.avif && (
                          <source
                            srcSet={`https://catalogueyanew.com.awu.zxu.temporary.site/${product.image.avif}`}
                            type="image/avif"
                          />
                        )}
                        {product.image?.webp && (
                          <source
                            srcSet={`https://catalogueyanew.com.awu.zxu.temporary.site/${product.image.webp}`}
                            type="image/webp"
                          />
                        )}
                        <img
                          src={`https://catalogueyanew.com.awu.zxu.temporary.site/${
                            product.image?.webp || product.image?.avif
                          }`}
                          alt={product.name}
                          width="320"
                          height="400"
                          loading="eager"
                          fetchPriority="high"
                          decoding="sync"
                          className="w-full h-full object-cover rounded-t-2xl"
                        />
                      </picture>
                    }


                    
                  />
                </div>
              ))
            )}

            {/* Infinite Loader at end */}
            {isFetchingMore && (
              <div className="shrink-0 flex items-center justify-center px-12">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-sm" />
              </div>
            )}
          </div>
        </div>

        {!showSkeleton && displayProducts.length > 0 && (
       <div className="flex justify-end mt-4 gap-3">

<button
  onClick={i18n.language === "ar" ? handleScrollRight : handleScrollLeft}
  className="
  w-8 h-8 sm:w-9 sm:h-9 
  flex items-center justify-center
  rounded-full
  bg-gray-200/70
  text-gray-500
  shadow-sm
  transition
  duration-200
  hover:bg-gray-300
  hover:text-gray-700
  active:scale-95
  "
>
  {i18n.language === "ar" ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
</button>

<button
  onClick={i18n.language === "ar" ? handleScrollLeft : handleScrollRight}
  className="
  w-8 h-8 sm:w-9 sm:h-9 
  flex items-center justify-center
  rounded-full
  bg-gray-200/70
  text-gray-500
  shadow-sm
  transition
  duration-200
  hover:bg-gray-300
  hover:text-gray-700
  active:scale-95
  "
>
  {i18n.language === "ar" ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
</button>

</div>
        )}
      </div>
    </section>
  );
}

export default memo(ProductsSection);