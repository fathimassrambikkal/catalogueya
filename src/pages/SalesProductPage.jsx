import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFixedWords } from "../hooks/useFixedWords";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";

import CallToAction from "../components/CallToAction";
import { getSalesProducts } from "../api"; 
import { createCustomerConversation } from "../api";

import {
  HeartIcon,
  StarIcon,
  ChatIcon,
} from "../components/SvgIcon";
import { log, error as logError } from "../utils/logger";
import { ProductCard } from "../components/ProductCard";


const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

function SalesProductPageComponent() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("relevance");
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};
  
  // ✅ Mobile detection
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

  // ✅ Fetch products from backend using same API as sales component
  useEffect(() => {
    const fetchProducts = async () => {
      if (page > lastPage) return;
      
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      try {
        setLoading(true);
        setError(null);

        const res = await getSalesProducts(page, abortControllerRef.current.signal);
        const paginated = res?.data?.data?.products;

        if (!paginated?.data) {
          setProducts([]);
          return;
        }

        const mapped = paginated.data.map(product => ({
          id: product.id,
          name: product.name,
          name_en: product.name,
          price: product.price,
          sale: product.sale || null,
          image: product.image,
          rating: parseFloat(product.rating) || 0,
          description: product.description,
          company_id: product.company_id?.id ?? product.company_id,
          company_name: product.company_name || product.company_id?.name || "Company",
          category_id: product.category_id,
          category_name: product.category_name || "Sale",
          whatsapp: product.whatsapp || null,
          type: product.type || "sales",
        }));

        setProducts(prev => {
          const merged = 
            page === 1 ? mapped : 
            isMobile ? [...prev, ...mapped] : mapped;

          // 🔥 Apple-style DOM cap for mobile
          if (isMobile && merged.length > 400) {
            return merged.slice(-300);
          }

          return merged;
        });

        setLastPage(paginated.last_page);
      }  catch (err) {
  if (err.name === "AbortError") {
    log("Request was aborted");
    return;
  }

  logError("Failed to load sales products", err);
  setError("Failed to load sales products");
}
 finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page, isMobile]);

  const handleChatClick = useCallback(async (product) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const companyId = Number(product.company_id);

    // 🛑 Safety check
    if (!companyId) {
      logError("Invalid company ID for chat", product);
      return;
    }

    // 🚫 Guest → redirect to login with intent
    if (!token || userType !== "customer") {
      navigate(`/sign?redirect=/chat-intent/company/${companyId}`);
      return;
    }

    // ✅ Logged-in customer → create/open chat
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
        logError("Conversation ID missing");
        return;
      }

      navigate(`/customer-login/chat/${conversationId}`);
    } catch (err) {
      logError("Chat creation failed", err);
    }
  }, [navigate]);

  // ✅ Desktop-only scroll to top
  useEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, isMobile]);

  // ✅ Apple-style IntersectionObserver for mobile
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

  // ✅ Sorting logic with useMemo
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

const handleToggleFavourite = useCallback((product) => {
  const isAlreadyFav = favourites.some(
    (item) => item.id === product.id
  );

  dispatch(
    toggleFavourite({
      ...product,
      source: "sales",
    })
  );

  if (auth.user && !isAlreadyFav) {
    dispatch(
      openListPopup({
        ...product,
        source: "sales",
      })
    );
  }
}, [auth.user, favourites, dispatch]);


  // Loading skeleton
  const skeletonLoader = useMemo(() => 
    Array.from({ length: 8 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="
          relative w-full max-w-[280px] sm:max-w-[300px]
          rounded-3xl overflow-hidden
          bg-white border border-gray-100
          shadow-sm
          animate-pulse
        "
      >
        <div className="w-full h-[180px] sm:h-[220px] bg-gray-100 rounded-t-3xl" />
        <div className="p-3 sm:p-4 space-y-2">
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded mt-2" />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-100 rounded" />
              ))}
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    )), []);

  return (
    <>
      {/* Fixed top loading indicator */}
      {loading && page === 1 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      <section className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        

        {/* Page Title */}
        <div className="mb-10 text-center">
          {loading && page === 1 ? (
            <div className="h-10 w-64 mx-auto bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-gray-900">
              {fw.sales} {fw.products}
            </h1>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            {error}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600 space-y-4">
          {loading && page === 1 ? (
            <>
              <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />
            </>
          ) : (
            <>
              <p className="text-[15px] sm:text-base md:text-lg">
                {loading ? "Loading..." : `${sortedProducts.length} ${fw.products_found}`}
              </p>
              <div className="flex items-center gap-3 text-sm sm:text-base">
                <span className="font-medium text-sm sm:text-base md:text-base text-gray-700">
                  {fw.store_by}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/60 backdrop-blur-md border border-gray-200 text-sm sm:text-base md:text-base rounded-full px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-2 focus:outline-none text-gray-700"
                >
                  <option value="relevance">{fw.name}</option>
                  <option value="low_to_high">{fw.low_to_hight}</option>
                  <option value="high_to_low">{fw.hight_to_low}</option>
                  <option value="rating">{fw.rating}</option>
                </select>
              </div>
            </>
          )}
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

  return (
    <ProductCard
      key={product.id}
      product={product}
      isFav={isFav}
      currency={fw.qar}

      /* ❤️ Favourite */
      onToggleFavourite={handleToggleFavourite}

      /* ➡ Navigation */
      onNavigate={() => navigate(`/salesproduct/${product.id}`)}

      /* 💬 Chat */
      onChat={handleChatClick}

      /* 🖼 Image */
      imageSlot={
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
            src={`${API_BASE_URL}/${product.image.webp || product.image.avif}`}
            alt={product.name_en || product.name}
            loading="lazy"
            decoding="async"
            draggable="false"
            className="w-full h-full object-cover"
          />
        </picture>
      }

      /* 💰 Price */
      priceSlot={null}
    />
  );
})}


              {/* ✅ Sentinel element for infinite scroll (Mobile only) */}
              {isMobile && page < lastPage && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center col-span-full">
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
                  className="px-6 py-2 rounded-full border border-gray-300 bg-white
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-50 transition duration-200
                             text-sm sm:text-base"
                >
                  {fw.previous}
                </button>

                <span className="text-sm sm:text-base text-gray-600">
                  {fw.page} {page} {fw.of} {lastPage}
                </span>

                <button
                  disabled={page === lastPage}
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2 rounded-full border border-gray-300 bg-white
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-50 transition duration-200
                             text-sm sm:text-base"
                >
                  {fw.next}
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

export const SalesProductPage = memo(SalesProductPageComponent);
export default SalesProductPage;