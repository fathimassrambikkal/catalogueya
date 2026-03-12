import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { createCustomerConversation } from "../api";
import { error as logError } from "../utils/logger";
import { showToast } from "../utils/showToast";
import { useFixedWords } from "../hooks/useFixedWords";
import CallToAction from "../components/CallToAction";
import { ProductCard } from "../components/ProductCard";
import { getHighlights } from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

function ProductViewMorePageComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};
  const params = useParams();
  
  // Extract highlight key correctly by removing "ViewMore" suffix
  const rawHighlightKey = params.highlightKey;
  const highlightKey = useMemo(() => {
    if (!rawHighlightKey) return null;
    // Remove "ViewMore" from the end if present
    return rawHighlightKey.replace("ViewMore", "");
  }, [rawHighlightKey]);
  
  // State management
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHighlight, setLoadingHighlight] = useState(false);
  const [error, setError] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [highlightName, setHighlightName] = useState(null);
  const [highlightLabels, setHighlightLabels] = useState({});
  const [newArrivalId, setNewArrivalId] = useState(null);

  // Mobile detection and infinite scroll
  const [isMobile, setIsMobile] = useState(false);
  const loadMoreRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initialize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to get highlight color based on key
  const getHighlightColor = useCallback((key) => {
    const colors = {
      'on_sales': 'bg-red-500',
      'New_Arrival': 'bg-green-500',
      'featured': 'bg-purple-500',
      'trending': 'bg-orange-500',
      'best_seller': 'bg-blue-500',
    };
    return colors[key] || 'bg-gray-500';
  }, []);

  // Load all highlights and create a map of highlight IDs to names/labels
  useEffect(() => {
    const loadAllHighlights = async () => {
      try {
        const res = await getHighlights();
        const list = res?.data?.data?.heighlight || [];
        
        // Find New Arrival ID
        const newArrival = list.find(h => h.key === "New_Arrival");
        if (newArrival) {
          setNewArrivalId(newArrival.id);
        }
        
        // Create a map of highlight ID to highlight info
        const labelsMap = {};
        list.forEach(h => {
          labelsMap[h.id] = {
            name: h.name,
            key: h.key,
            color: getHighlightColor(h.key)
          };
        });
        
        setHighlightLabels(labelsMap);
      } catch (err) {
        console.error("Failed to load highlights", err);
      }
    };

    loadAllHighlights();
  }, [getHighlightColor]);

  // Load specific highlight details if it's a highlight route
  useEffect(() => {
    if (!highlightKey) return;

    const loadHighlight = async () => {
      setLoadingHighlight(true);
      try {
        const res = await getHighlights();
        const list = res?.data?.data?.heighlight || [];
        const found = list.find(h => h.key === highlightKey);
        
        if (found) {
          setHighlightId(found.id);
          setHighlightName(found.name);
        }
      } catch (err) {
        console.error("Highlight fetch failed", err);
      } finally {
        setLoadingHighlight(false);
      }
    };

    loadHighlight();
  }, [highlightKey]);

  // Fetch products based on route
  useEffect(() => {
    const fetchProducts = async () => {
      // Don't fetch if we're waiting for highlightId
      if (highlightKey && highlightKey !== "New_Arrival" && !highlightId && !loadingHighlight) {
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        let url;

        // CASE 1: All products (no highlightKey)
        if (!highlightKey) {
          url = `${API_BASE_URL}/en/api/showProducts?page=${page}`;
        } 
        // CASE 2: New Arrivals
        else if (highlightKey === "new_arrivals") {
          const id = newArrivalId || 3; // Fallback to 3 if not found
          url = `${API_BASE_URL}/en/api/heighlightProduct/${id}?page=${page}`;
        }
        // CASE 3: Other highlights
        else {
          if (!highlightId) return;
          url = `${API_BASE_URL}/en/api/heighlightProduct/${highlightId}?page=${page}`;
        }

        const response = await fetch(url, {
          signal: abortControllerRef.current.signal
        });

        const data = await response.json();

        // Handle different response structures
        const apiProducts = data?.data?.products?.data || [];
        const pagination = data?.data?.products;

        setLastPage(pagination?.last_page || 1);

        const mapped = apiProducts.map(product => {
          // Determine product highlight
          let productHighlight = highlightKey || null;


if (product.highlight_id && highlightLabels[product.highlight_id]) {
  productHighlight = highlightLabels[product.highlight_id].key;
}
          
          return {
            id: product.id,
            name: product.name,
            name_en: product.name,
            price: product.price,
            old_price: product.old_price || null,
            image: product.image,
            rating: parseFloat(product.rating) || 0,
            description: product.description,
            company_id: product.company_id?.id,
            company_name: product.company_name || product.company_id?.name || "Company",
            category_id: product.category_id,
            whatsapp: product.whatsapp || null,
            highlight: productHighlight,
            highlight_id: product.highlight_id,
            highlight_name: product.highlight_name || highlightLabels[product.highlight_id]?.name,
            source: "products"
          };
        });

        setProducts(prev =>
          page === 1 ? mapped : [...prev, ...mapped]
        );

      } catch (err) {
        if (err.name === "AbortError") return;
        logError("Products fetch failed", err);
        setError(fw.failed_to_load || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page, highlightKey, highlightId, highlightLabels, fw, newArrivalId, loadingHighlight]);

  // Desktop scroll to top on page change
  useEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, isMobile]);

  // Apple-style IntersectionObserver for mobile infinite scroll
  useEffect(() => {
    if (!isMobile) return;
    if (page >= lastPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage(p => p + 1);
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [isMobile, page, lastPage, loading]);

  // Handle chat click
  const handleChatClick = useCallback(async (product) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const companyId = Number(product.company_id);

    if (!companyId) {
      logError("Chat: invalid company ID", product);
      showToast(
        fw.chat_unavailable || "Chat unavailable",
        { rtl: fw?.direction === "rtl" }
      );
      return;
    }

    if (!token || userType !== "customer") {
      navigate(`/sign?redirect=/chat-intent/company/${companyId}`);
      return;
    }

    try {
      const res = await createCustomerConversation({
        is_group: false,
        participant_ids: [companyId],
      });

      const conversationId =
        res.data?.data?.id ||
        res.data?.conversation?.id ||
        res.data?.id;

      if (!conversationId) {
        logError("Chat: conversation ID missing", res);
        showToast(
          fw.chat_failed || "Unable to start chat",
          { rtl: fw?.direction === "rtl" }
        );
        return;
      }

      navigate(`/customer-login/chat/${conversationId}`);
    } catch (err) {
      logError("Chat creation failed", err);
      showToast(
        fw.chat_failed || "Unable to start chat",
        { rtl: fw?.direction === "rtl" }
      );
    }
  }, [navigate, fw]);

  // Handle favourite toggle
  const handleToggleFavourite = useCallback((product) => {
    const isAlreadyFav = favourites.some((item) => item.id === product.id);

    dispatch(
      toggleFavourite({
        ...product,
        source: product.source || "products",
      })
    );

    if (auth.user && !isAlreadyFav) {
      dispatch(
        openListPopup({
          ...product,
          source: product.source || "products",
        })
      );
    }
  }, [auth.user, favourites, dispatch]);

  // Handle navigation to product detail
  const handleNavigate = useCallback((product) => {
    navigate(`/product/${product.id}`);
  }, [navigate]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "low_to_high":
          return (a.price || 0) - (b.price || 0);
        case "high_to_low":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  // Loading skeleton with highlight label placeholder
  const skeletonLoader = useMemo(() => 
    Array.from({ length: 8 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
      >
        {/* Highlight label skeleton */}
        <div className="absolute top-3 left-3 z-10">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        <div className="w-full h-[160px] xs:h-[180px] sm:h-[200px] bg-gray-100 rounded-t-3xl animate-pulse" />
        <div className="p-3 sm:p-4 bg-white rounded-b-3xl">
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-16 mb-2 animate-pulse"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )), []);

  // Page title based on route
  const pageTitle = useMemo(() => {
    if (!highlightKey) return fw.products || "Products";
    if (highlightKey === "New_Arrival") return "New Arrival Products";
    return `${highlightName || highlightKey.replace(/_/g, ' ')} ${fw.products || "Products"}`;
  }, [highlightKey, highlightName, fw]);

  // Helper function to get highlight label for a product
  const getProductHighlightLabel = useCallback((product) => {
    // If product has a highlight_id, try to get from highlightLabels
    if (product.highlight_id && highlightLabels[product.highlight_id]) {
      return {
        name: highlightLabels[product.highlight_id].name,
        key: highlightLabels[product.highlight_id].key,
        color: highlightLabels[product.highlight_id].color
      };
    }
    
    // Otherwise use the highlight from the product
    if (product.highlight) {
      return {
        name: product.highlight_name || product.highlight,
        key: product.highlight,
        color: getHighlightColor(product.highlight)
      };
    }
    
    return null;
  }, [highlightLabels, getHighlightColor]);

  // Show loading state while waiting for highlight info
  if (highlightKey && highlightKey !== "New_Arrival" && loadingHighlight && !highlightId) {
    return (
      <section className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Fixed top loading indicator */}
      {loading && page === 1 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      <section className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 bg-white">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-gray-900 mb-10 text-center capitalize">
          {pageTitle}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            {error}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600 space-y-4">
          <p className="text-[15px] sm:text-base md:text-lg">
            {loading && page === 1 
              ? "Loading..." 
              : `${sortedProducts.length} ${fw.products_found || 'products found'}`
            }
          </p>
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="font-medium text-sm sm:text-base md:text-base text-gray-700">
              {fw.store_by || 'Sort by'}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-gray-200 text-sm sm:text-base md:text-base rounded-full px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-2 focus:outline-none text-gray-700"
            >
              <option value="relevance">{fw.name || 'Relevance'}</option>
              <option value="low_to_high">{fw.low_to_hight || 'Price: Low to High'}</option>
              <option value="high_to_low">{fw.hight_to_low || 'Price: High to Low'}</option>
              <option value="rating">{fw.rating || 'Rating'}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center">
            {skeletonLoader}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {fw.no_products || "No Products Available"}
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center">
              {sortedProducts.map((product) => {
                const isFav = favourites.some((item) => item.id === product.id);
                const isSales = product.highlight === "on_sales" || 
                  (product.highlight_id && highlightLabels[product.highlight_id]?.key === "on_sales");
                const highlightLabel = getProductHighlightLabel(product);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFav={isFav}
                    currency={fw.qar || 'QAR'}
                    onNavigate={handleNavigate}
                    onToggleFavourite={handleToggleFavourite}
                    onChat={handleChatClick}
                    imageSlot={
                      <div className="relative w-full h-full">
                        {/* Highlight Label - Top Left */}
                        {highlightLabel && (
                          <div className="absolute top-2 left-2 z-20">
                            <span className={`${highlightLabel.color} text-white text-xs font-medium px-2 py-1 rounded-full shadow-md`}>
                              {highlightLabel.name}
                            </span>
                          </div>
                        )}
                        
                        {/* Discount Badge - Top Right (if on sale) */}
                        {isSales && product.old_price && (
                          <div className="absolute top-2 right-2 z-20">
                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
                              {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
                            </span>
                          </div>
                        )}
                        
                        <picture>
                          {product.image?.avif && (
                            <source
                              srcSet={`${API_BASE_URL}/${product.image.avif}`}
                              type="image/avif"
                            />
                          )}
                          {product.image?.webp && (
                            <source
                              srcSet={`${API_BASE_URL}/${product.image.webp}`}
                              type="image/webp"
                            />
                          )}
                          <img
                            src={
                              product.image?.webp
                                ? `${API_BASE_URL}/${product.image.webp}`
                                : "/placeholder-image.jpg"
                            }
                            alt={product.name_en || product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                    }
                    priceSlot={
                      isSales && product.old_price ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-[clamp(10px,1vw,11px)]">
                            {fw.qar || 'QAR'} {product.price}
                          </span>
                          <span className="text-gray-500 line-through text-[clamp(7px,0.8vw,10px)]">
                            {product.old_price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900 text-[clamp(10px,1vw,11px)]">
                          {fw.qar || 'QAR'} {product.price}
                        </span>
                      )
                    }
                  />
                );
              })}

              {/* Sentinel element for infinite scroll (Mobile only) */}
              {isMobile && page < lastPage && (
                <div 
                  ref={loadMoreRef} 
                  className="h-20 flex justify-center items-center col-span-full"
                  aria-label="Loading more products"
                >
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Desktop/Tablet Pagination */}
            {!isMobile && lastPage > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-full border border-gray-300 
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-100 transition"
                >
                  {fw.previous || 'Previous'}
                </button>

                <span className="text-sm text-gray-600">
                  {fw.page || 'Page'} {page} {fw.of || 'of'} {lastPage}
                </span>

                <button
                  disabled={page === lastPage}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-full border border-gray-300 
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-100 transition"
                >
                  {fw.next || 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <CallToAction />
    </>
  );
}

export const ProductViewMorePage = memo(ProductViewMorePageComponent);
export default ProductViewMorePage;