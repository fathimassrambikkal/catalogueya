import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
import {
  getArrivalsProducts,
  getSalesProducts,
  createCustomerConversation,
  getHighlights,
  getHighlightProducts,
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
import { useIsInViewport } from "../hooks/useIsInViewport";
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
  const [highlightMap, setHighlightMap] = useState({});
  const [highlights, setHighlights] = useState([]);
  const cardWidth = useCardWidth();

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);
  const [activeTab, setActiveTab] = useState("all");
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);

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
      left: i18n.language === "ar" ? undefined : offsetLeft,
      right:
        i18n.language === "ar"
          ? container.offsetWidth - offsetLeft - offsetWidth
          : undefined,
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

        const map = {};
        const tabsList = highlightsData.map((h) => ({
          key: h.key,
          label: h.name,
        }));

        await Promise.all(
          highlightsData.map(async (h) => {
            try {
              const productsRes = await getHighlightProducts(h.id);
              const products = productsRes.data?.products || [];
              products.forEach((p) => {
                map[p.id] = h.key;
              });
            } catch (err) {
              console.warn(`Failed to fetch products for highlight ${h.name}`, err);
            }
          })
        );

        setHighlightMap(map);
        setHighlights(tabsList);
      } catch (err) {
        console.error("Critical error loading highlights", err);
      }
    };

    loadHighlights();
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const [arrivalsRes, salesRes] = await Promise.all([
          getArrivalsProducts(1),
          getSalesProducts(1),
        ]);

        const arrivalsData = arrivalsRes?.data?.data?.products?.data || [];
        const salesData = salesRes?.data?.data?.products?.data || [];

        const mappedArrivals = arrivalsData.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          old_price: null,
          hasDiscount: false,
          discountPercentage: 0,
          image: product.image,
          rating: parseFloat(product.rating) || 0,
          description: product.description,
          company_id: product.company_id?.id,
          company_name: product.company_name?.name || "Company",
          category_id: product.category_id,
          whatsapp: product.whatsapp || null,
          sourceType: "arrival",
          type: product.type,
          highlight: highlightMap[product.id] || null,
        }));

        const mappedSales = salesData.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.discount_price || product.price,
          old_price: product.discount_price ? product.price : null,
          hasDiscount:
            !!product.discount_price && product.discount_price < product.price,
          discountPercentage: product.discount_price
            ? Math.round(
                ((product.price - product.discount_price) / product.price) * 100
              )
            : 0,
          image: product.image,
          rating: parseFloat(product.rating) || 0,
          description: product.description,
          company_id: product.company_id?.id,
          company_name: product.company_name?.name || "Company",
          category_id: product.category_id,
          whatsapp: product.whatsapp || null,
          sourceType: "sale",
          type: product.type,
          highlight: "on_sales",
        }));

        const merged = [...mappedSales, ...mappedArrivals];

        const uniqueProducts = Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );

        if (mounted) {
          setApiProducts(uniqueProducts);
        }
      } catch (err) {
        logError("ProductsSection: failed to load products", err);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [highlightMap]);

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
    if (scrollContainerRef.current && isInViewport) {
      const scrollAmount = window.innerWidth < 640 ? window.innerWidth / 2 : 220;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  }, [isInViewport]);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current && isInViewport) {
      const scrollAmount = window.innerWidth < 640 ? window.innerWidth / 2 : 220;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [isInViewport]);

  const displayProducts = useMemo(() => {
    if (activeTab === "all") return apiProducts;
    return apiProducts.filter(
      product => product.highlight === activeTab
    );
  }, [apiProducts, activeTab]);

  const showSkeleton = apiProducts.length === 0;

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 bg-white px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24 overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
      <div className="mb-8 sm:mb-12">
        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-4xl sm:text-5xl md:text-5xl font-light tracking-tight text-gray-900">
            {fw.products || "Products"}
          </h2>
          <Link
            to={
              activeTab === "all" 
                ? "/productviewmore"  
                : `/heighlights${activeTab}viewmore` 
            }
            className="text-sm font-medium text-gray-600 hover:text-gray-900 tracking-wide transition flex items-center gap-1.5 group"
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
                    priceSlot={
                      product.old_price ? (
                        <div className="mt-[clamp(2px,0.5vw,4px)] flex items-baseline gap-[clamp(3px,0.2vw,6px)]">
                          <span className="font-semibold text-gray-900 tracking-tight leading-[1.2] text-[clamp(10px,1vw,11px)]">
                            {i18n.language === "ar"
                              ? `${fw.qar} ${product.price}`
                              : `${product.price} ${fw.qar}`}
                          </span>
                          <span className="text-gray-500 line-through tracking-tight leading-[1.1] text-[clamp(7px,0.8vw,10px)]">
                            {product.old_price}
                          </span>
                        </div>
                      ) : null
                    }
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