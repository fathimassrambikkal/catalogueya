import React, { useState, useEffect, useRef, memo, useMemo  } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { createCustomerConversation } from "../api";

import { ProductCard } from "../components/ProductCard";

import { error as logError } from "../utils/logger";
import { showToast } from "../utils/showToast";

import { useFixedWords } from "../hooks/useFixedWords";

import CallToAction from "../components/CallToAction";
import { getArrivalsProducts } from "../api"; 

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";



function NewArrivalProductPageComponent() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("relevance");
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  // ✅ 1. Detect mobile correctly (once)
  const [isMobile, setIsMobile] = useState(false);
  const loadMoreRef = useRef(null); // ✅ 4. IntersectionObserver ref

  // Initialize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Apple treats tablet as desktop
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Fetch products from backend using same API as arrivals component
  useEffect(() => {
    const fetchProducts = async () => {
       if (page > lastPage) return;
      try {
        setLoading(true);
        setError(null);

        const res = await getArrivalsProducts(page);
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
  old_price: null,

  // ✅ KEEP RAW BACKEND IMAGE OBJECT
  image: product.image,

  rating: parseFloat(product.rating) || 0,
  description: product.description,
  isNewArrival: true,
  company_id: product.company_id?.id,
  company_name: product.company_name || "Company",
  category_id: product.category_id,
  category_name: product.category_name || "New Arrival",
   whatsapp: product.whatsapp || null,
}));


        // ✅ 2. STOP replacing products on mobile (CRITICAL)
       setProducts(prev => {
  const merged =
    page === 1 ? mapped : isMobile ? [...prev, ...mapped] : mapped;

  // 🔥 Apple-style DOM cap
  if (isMobile && merged.length > 400) {
    return merged.slice(-300); // keep latest items
  }

  return merged;
});


        setLastPage(paginated.last_page);
      } catch (err) {
         logError("NewArrival: fetch products failed", err);
        setError(fw.failed_to_load || "Failed to load new arrival products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, isMobile]); // Added isMobile dependency

  useEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, isMobile]);

  
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
      rootMargin: "300px", // Apple prefetch zone
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


  const handleChatClick = async (product) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const companyId = Number(product.company_id);

    //  Guard (VERY important)
    if (!companyId) {
  logError("Chat: invalid company ID", product);
  showToast(
    fw.chat_unavailable || "Chat unavailable",
    { rtl: fw?.direction === "rtl" }
  );
  return;
}


    // 🚫 Guest → sign-in with intent
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
  logError("Chat: conversation ID missing", res);
  showToast(
    fw.chat_failed || "Unable to start chat",
    { rtl: fw?.direction === "rtl" }
  );
  return;
}


      navigate(`/customer-login/chat/${conversationId}`);
    }  catch (err) {
  logError("Chat creation failed", err);
  showToast(
    fw.chat_failed || "Unable to start chat",
    { rtl: fw?.direction === "rtl" }
  );
}

  };



 


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


  // Loading skeleton - UPDATED to match profile page level
  const skeletonLoader = Array.from({ length: 8 }).map((_, index) => (
    <div
      key={`skeleton-${index}`}
      className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm "
    >
      {/* Image skeleton with same style as profile page */}
      <div className="w-full h-[160px] xs:h-[180px] sm:h-[200px] bg-gray-100 rounded-t-3xl animate-pulse " />
      
      {/* Content skeleton with same structure as profile page */}
      <div className="p-3 sm:p-4 bg-white rounded-b-3xl ">
        {/* Product name skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse "></div>
          <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse "></div>
        </div>
        
        {/* Price skeleton */}
        <div className="h-4 bg-gray-100 rounded w-16 mb-2 animate-pulse "></div>
        
        {/* Rating and button skeleton - same layout as product cards */}
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-1 ">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-100 rounded animate-pulse " />
            ))}
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse " />
        </div>
      </div>
    </div>
  ));
const handleToggleFavourite = (product) => {
  const isAlreadyFav = favourites.some((item) => item.id === product.id);

  dispatch(
    toggleFavourite({
      ...product,
      source: "new_arrivals",
    })
  );

  if (auth.user && !isAlreadyFav) {
    dispatch(
      openListPopup({
        ...product,
        source: "new_arrivals",
      })
    );
  }
};

const handleNavigate = (product) => {
  navigate(`/newarrivalprofile/${product.id}`);
};




  return (
    <>
      {/* Fixed top loading indicator - same as profile page */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      <section className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 bg-white">
       
 
  

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-gray-900 mb-10 text-center ">
          {fw.new_arrivals}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm ">
            {error}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600 space-y-4 ">
          <p className="text-[15px] sm:text-base md:text-lg ">
            {loading 
              ? "Loading..." 
              : `${sortedProducts.length} ${fw.products_found}`
            }
          </p>
          <div className="flex items-center gap-3 text-sm sm:text-base ">
            <span className="font-medium  text-sm sm:text-base md:text-base text-gray-700 ">{fw.store_by}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-gray-200  text-sm sm:text-base md:text-base rounded-full px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-2 focus:outline-none text-gray-700"
            >
              <option value="relevance">{fw.name}</option>
              <option value="low_to_high">{fw.low_to_hight}</option>
              <option value="high_to_low">{fw.hight_to_low}</option>
              <option value="rating">{fw.rating}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center ">
            {skeletonLoader}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full ">
            <h3 className="text-xl font-semibold text-gray-600 mb-2 ">{fw.no_products || "No Products Available"}</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center ">
           {sortedProducts.map((product) => {
  const isFav = favourites.some((item) => item.id === product.id);

  return (
    <ProductCard
      key={product.id}
      product={product}
      isFav={isFav}
      currency={fw.qar}
      onNavigate={handleNavigate}
      onToggleFavourite={handleToggleFavourite}
      onChat={handleChatClick}
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
            src={
              product.image?.webp
                ? `${API_BASE_URL}/${product.image.webp}`
                : "/placeholder-image.jpg"
            }
            alt={product.name_en || product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover "
          />
        </picture>
      }
    />
  );
})}


              {/* ✅ 5. Sentinel element for infinite scroll (Apple-style) */}
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
                  className="px-4 py-2 rounded-full border border-gray-300 
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-100 transition"
                >
                  {fw.previous}
                </button>

                <span className="text-sm text-gray-600">
                  {fw.page} {page} {fw.of} {lastPage}
                </span>

                <button
                  disabled={page === lastPage}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-full border border-gray-300 
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-100 transition"
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

export const NewArrivalProductPage = memo(NewArrivalProductPageComponent);
export default NewArrivalProductPage;