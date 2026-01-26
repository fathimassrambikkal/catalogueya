import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate ,useLocation } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";
import SimilarProducts from "../components/SimilarProducts";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { createCustomerConversation,getProductReviews,addProductReview} from "../api";
import { error as logError, warn } from "../utils/logger";
import { showToast } from "../utils/showToast";

import { getProduct, getCompany } from "../api";
import { useDispatch, useSelector } from "react-redux";

import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";
import BackButton from "../components/BackButton";
import SmartImage from "../components/SmartImage";
import {
  HeartIcon,
  StarIcon,
  ShareIcon,
  ChatIcon,
} from "../components/SvgIcon";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// ✅ Helper to normalize image data
const normalizeImage = (image) => {
  if (!image) return null;
  
  // If image is an object with avif/webp, return as-is
  if (typeof image === 'object' && !Array.isArray(image)) {
    return image;
  }
  
  // If it's already a string, return as-is
  if (typeof image === 'string') return image;
  
  return null;
};

// ✅ Helper to get fallback URL for error handling
const getFallbackUrl = (imgData) => {
  if (!imgData) return "/api/placeholder/400/400";
  
  if (typeof imgData === 'string') {
    return imgData.startsWith("http") 
      ? imgData 
      : `${API_BASE_URL}/${imgData.replace(/^\//, "")}`;
  }
  
  if (typeof imgData === 'object') {
    const webp = imgData.webp || imgData.url || imgData.path;
    if (webp) {
      return webp.startsWith("http") 
        ? webp 
        : `${API_BASE_URL}/${webp.replace(/^\//, "")}`;
    }
  }
  
  return "/api/placeholder/400/400";
};

//  Reusable VisionOS-style glass / titanium icon button
const PremiumIconButton = ({ onClick, title, children, disabled = false }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (onClick && !disabled) onClick(e);
    }}
    title={title}
    disabled={disabled}
    className={`
      relative flex items-center justify-center
      w-[clamp(38px,4vw,44px)]
h-[clamp(38px,4vw,44px)]
rounded-[16px]
      bg-white/40 backdrop-blur-2xl
      border border-[rgba(255,255,255,0.28)]
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      hover:bg-white/55 transition-all duration-300
      transform-gpu
      active:scale-95
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-br from-white/70 via-white/10 to-transparent
      opacity-40 pointer-events-none transform-gpu"
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
      opacity-35 pointer-events-none transform-gpu"
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-t from-black/20 to-transparent
      opacity-20 pointer-events-none transform-gpu"
    />
    <span className="relative z-10 flex items-center justify-center transform-gpu">
      {children}
    </span>
  </button>
);

//  Safe rating helper
const getSafeRating = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return 0;
  if (num > 5) return 5;
  return num;
};

//  Function to get country from IP
const getCountryFromIP = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const res = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      return data.country_name;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (e) {
    // Try alternative API as fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const res = await fetch("https://ipwho.is/", {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        return data.country;
      } catch (fallbackError) {
        clearTimeout(timeoutId);
        throw fallbackError;
      }
    } catch (fallbackError) {
      return null;
    }
  }
};

//  Build payload for showProduct API
const buildShowProductPayload = async () => {
  let country = null;
  
  try {
    country = await getCountryFromIP();
  } catch (error) {
    // Silently fail
  }

  const device = navigator.userAgent;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || null;

  const payload = {
    device,
    ...(country && { country }),
    ...(token && { token }),
  };

  return payload;
};

export default function SalesProductProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);
  const { companyId, id: routeProductId, productId, pid } = params;
  const resolvedProductId = routeProductId || productId || pid;
  const { fixedWords } = useFixedWords();
  const { i18n } = useTranslation();
const location = useLocation();
  // shortcut like Sales component
  const fw = fixedWords?.fixed_words || {};

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const [showAllReviews, setShowAllReviews] = useState(false);


  const isFavourite = product ? favourites.some((f) => f.id === product.id) : false;

  //  Function to refresh product data
  const refreshProductData = useCallback(async () => {
    if (!resolvedProductId) return;
    
    try {
      setLoading(true);
      
      let productResponse;
      try {
        const payload = await buildShowProductPayload();
        productResponse = await getProduct(resolvedProductId, payload);
      } catch (apiError) {
        const simplePayload = { device: navigator.userAgent };
        productResponse = await getProduct(resolvedProductId, simplePayload);
      }
      
      const productData = productResponse?.data?.data?.product || productResponse?.data?.product;

      if (!productData) {
        setError("Product not found in API response");
        return;
      }

      const sale = productData.sale || null;

      const transformedProduct = {
        id: productData.id,
        name: productData.name,
        
        // Use sale.price_after for current price, fallback to productData.price
        price: sale?.price_after
          ? Number(sale.price_after).toFixed(2)
          : Number(productData.price).toFixed(2),

        // Use sale.price_before for old price
        oldPrice: sale?.price_before
          ? Number(sale.price_before).toFixed(2)
          : null,

        discount_percent: sale?.discount_value || null,

        image: normalizeImage(productData.image), // ✅ Store object format
        rating: parseFloat(productData.rating) || 0,
        description: productData.description,

        company_id: productData.company_id,
        company_name: productData.company_name || "Company",
        category_id: productData.category_id,
        category_name: "SALE",

        albums: Array.isArray(productData.albums)
          ? productData.albums.map(a => normalizeImage(a)).filter(Boolean) // ✅ Normalize album images
          : [],

        isOnSale: Boolean(sale),
        // Store the full sale object for additional details
        sale: sale,
      };

      setProduct(transformedProduct);
      
      const mainImage = normalizeImage(productData.image) || transformedProduct.albums?.[0] || null;
      setSelectedImage(mainImage);

      // Reload similar products
      if (productData.company_id) {
        try {
          const companyRes = await getCompany(productData.company_id);
          const company = companyRes?.data?.data?.company || companyRes?.data?.company || companyRes?.data;

          let list = company?.products || [];
          list = list.filter((p) => p.id !== productData.id);
          list = list.map((p) => ({
            ...p,
            image: normalizeImage(p.image), // ✅ Normalize similar product images
            company_name: p.company_name || productData.company_name || "Company",
            company_id: p.company_id || productData.company_id,
          }));

          setSimilarProducts(list);
        } catch (err) {
          setSimilarProducts([]);
        }
      }
    } catch (err) {
      setError(`Failed to refresh product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [resolvedProductId]);

  //  Listen for product updates from Dashboard
  useEffect(() => {
    const handleProductsUpdated = (event) => {
      if (event.detail && event.detail.products) {
        const updatedProduct = event.detail.products.find((p) => p.id === resolvedProductId);
        
        if (updatedProduct) {
          refreshProductData();
        } else if (event.detail.companyId === product?.company_id) {
          refreshProductData();
        }
      }
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    window.addEventListener('companyProductsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('companyProductsUpdated', handleProductsUpdated);
    };
  }, [resolvedProductId, product?.company_id, refreshProductData]);

  //  Fetch product + similar products - Optimized for instant loading
  useEffect(() => {
    let mounted = true;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try simple payload first for instant loading
        let productResponse;
        try {
          const simplePayload = { device: navigator.userAgent };
          productResponse = await getProduct(resolvedProductId, simplePayload);
        } catch (error1) {
          try {
            const payload = await buildShowProductPayload();
            productResponse = await getProduct(resolvedProductId, payload);
          } catch (error2) {
            productResponse = await getProduct(resolvedProductId, {});
          }
        }

        const productData = productResponse?.data?.data?.product || productResponse?.data?.product;

        if (!productData) {
          if (mounted) setError("Product not found in API response");
          return;
        }

        const sale = productData.sale || null;

        const transformedProduct = {
          id: productData.id,
          name: productData.name,
          
          // Use sale data for prices
          price: sale?.price_after
            ? Number(sale.price_after).toFixed(2)
            : Number(productData.price).toFixed(2),

          oldPrice: sale?.price_before
            ? Number(sale.price_before).toFixed(2)
            : null,

          image: normalizeImage(productData.image), // ✅ Store object format
          rating: parseFloat(productData.rating) || 0,
          description: productData.description,
          company_id: productData.company_id,
          company_name: productData.company_name || "Company",
          category_id: productData.category_id,
          category_name: "SALE",
          discount_percent: sale?.discount_value || null,
          albums: Array.isArray(productData.albums)
            ? productData.albums
                .map(a => normalizeImage(a)) // ✅ Normalize album images
                .filter(Boolean)
            : [],
          isOnSale: Boolean(sale),
          sale: sale,
        };

        if (!mounted) return;

        // Set product IMMEDIATELY for instant rendering
        setProduct(transformedProduct);
        
        const mainImage = normalizeImage(productData.image) || transformedProduct.albums?.[0] || null;
        setSelectedImage(mainImage);

        // Fetch similar products IN BACKGROUND (non-blocking)
        if (productData.company_id) {
          setTimeout(async () => {
            try {
              const companyRes = await getCompany(productData.company_id);
              const company = companyRes?.data?.data?.company || companyRes?.data?.company || companyRes?.data;

              let list = company?.products || [];
              list = list.filter((p) => p.id !== productData.id);
              list = list.map((p) => ({
                ...p,
                image: normalizeImage(p.image), // ✅ Normalize similar product images
                company_name: p.company_name || productData.company_name || "Company",
                company_id: p.company_id || productData.company_id,
              }));

              if (mounted) setSimilarProducts(list);
            } catch (err) {
              if (mounted) setSimilarProducts([]);
            }
          }, 300); // Small delay so main content appears first
        } else {
          if (mounted) setSimilarProducts([]);
        }
      } catch (err) {
        if (mounted) {
          if (err.response?.status === 422) {
            setError(`API validation error (422). Please check the product ID: ${resolvedProductId}`);
          } else if (err.response?.status === 404) {
            setError(`Product not found (404). ID: ${resolvedProductId}`);
          } else {
            setError(`Failed to load product: ${err.message || "Network error"}`);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    if (resolvedProductId) fetchProductData();

    return () => {
      mounted = false;
    };
  }, [resolvedProductId]);

  //  COMPANY NAME CLICK HANDLER
  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (product?.company_id) {
      navigate(`/company/${product.company_id}`);
    }
  };

  //  Chat handler
  const handleChat = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!product) return;

      const token =
   localStorage.getItem("token") ||
   sessionStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      // Normalize company ID (VERY IMPORTANT)
      const companyId =
        typeof product.company_id === "object"
          ? product.company_id?.id
          : product.company_id;

      if (!companyId) {
        logError("SalesProductProfile: invalid company ID", product);

        return;
      }

      // 🚫 Guest → login with intent
      if (!token || userType !== "customer") {
        navigate(`/sign?redirect=/chat-intent/company/${companyId}`);
        return;
      }

      // ✅ Logged-in customer → create/open chat
      try {
        const res = await createCustomerConversation({
          is_group: false,
          participant_ids: [Number(companyId)],
        });

        const conversationId =
          res.data?.data?.id ||
          res.data?.conversation?.id ||
          res.data?.id;

        if (!conversationId) {
          logError("SalesProductProfile: conversation ID missing", res?.data);
          return;
        }

        navigate(`/customer-login/chat/${conversationId}`);
      } catch (err) {
        logError("SalesProductProfile: chat creation failed", err);
      }
    },
    [product, navigate]
  );

  useEffect(() => {
    if (!resolvedProductId) return;

    const fetchReviews = async () => {
      try {
        const res = await getProductReviews(resolvedProductId);

        const apiData = res?.data?.data || {};
        const apiReviews = apiData.reviews || [];

        // ✅ MAP API → UI FORMAT
        const mappedReviews = apiReviews.map((r) => ({
          id: r.review_id,                          
          name: r.user?.name || "Anonymous",        
          rating: Number(r.rating) || 0,            
          comment: r.comment || "",                 
          date: new Date(r.created_at).toLocaleDateString(),
          userImage: r.user?.image || null,       
        }));

        setReviews(mappedReviews);

      } catch (error) {
        logError("SalesProductProfile: reviews fetch failed", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [resolvedProductId]);

  

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + getSafeRating(r.rating), 0) / reviews.length
      : product?.rating || 0;

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out this sale product: ${product.name} from ${product.company_name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast(fw.link_copied || "Link copied");
      }
    } catch (err) {
      warn("SalesProductProfile: share failed", err);
    }
  };

  const handleReviewSubmit = async () => {
  if (!reviewText || reviewRating === 0) {
    showToast(fw.fill_all_fields || "Please enter rating and comment", { type: "warning" });
    return;
  }

  try {
    await addProductReview(
      resolvedProductId,
      reviewRating,
      reviewText.trim()
    );

    // ✅ Optimistic UI update
    const newRev = {
      id: Date.now(),
      name: auth?.user?.name || "You",
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toLocaleDateString(),
    };

    setReviews((prev) => [...prev, newRev]);
    setShowReviewModal(false);
    setReviewText("");
    setReviewRating(0);

    showToast(fw.review_success || "Review submitted", { type: "success" });

  } catch (error) {
   showToast(
   error?.response?.data?.message || fw.review_failed || "Review failed",
   { type: "error" }
 );
  }
};
useEffect(() => {
  if (!auth?.user) return;
  if (!product) return;

  const params = new URLSearchParams(location.search);
  const action = params.get("action");

  if (action === "review") {
    setShowReviewModal(true);

    // 🧹 clean URL after opening modal
    navigate(location.pathname, { replace: true });
  }
}, [auth?.user, product]);


  const handleImageClick = (imgData) => {
    setSelectedImage(imgData);
  };

  // ✅ Compute reviews to display
  const visibleReviews = showAllReviews
    ? reviews
    : reviews.slice(0, 2);

  

  // Only show error if we have no product AND an error occurred
  if (error && !product) {
    return (
      <div className="flex justify-center items-center min-h-screen transform-gpu">
        <div className="text-center py-20 text-lg text-gray-600 transform-gpu">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          {error || "Sale product not found."}
          <div className="text-sm text-gray-500 mb-4 transform-gpu">
            Product ID: {resolvedProductId}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition transform-gpu"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 ml-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform-gpu"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const productImages = [
    product?.image,
    ...(product?.albums || []),
  ].filter(Boolean);

  return (
    <>
      {/*  Tiny non-blocking loading indicator (Apple Safari style) */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Back button */}
    {/* Back Button – Reusable */}
 <BackButton   variant="absolute" className="top-20"/>


      {/* Main layout */}
      <section
        key={product?.id || 'loading'}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm transform-gpu animate-fade-in"
      >
        {/* LEFT: Image viewer */}
        <div className="relative flex flex-col md:sticky md:top-24 h-fit w-full transform-gpu">
          {/* MAIN IMAGE WRAPPER */}
          <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm transform-gpu">
            
            {/* ✅ MAIN IMAGE with SmartImage */}
            {product ? (
              <SmartImage
                key={selectedImage ? JSON.stringify(selectedImage) : 'fallback'}
                image={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transform-gpu animate-image-fade"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  warn("SalesProductProfile: main image load failed", selectedImage);
                  e.target.src = "/api/placeholder/500/500";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
            )}

            {/* SALE Badge - Sales-specific */}
            {product && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold border border-red-100 shadow-sm transform-gpu">
                {fw.sales}
              </div>
            )}

            {/* RIGHT SIDE ICONS */}
            <div className={`absolute top-4 right-4 flex flex-col gap-3 z-30 transform-gpu ${!product ? 'opacity-40' : ''}`}>
              <PremiumIconButton
                title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                onClick={() => {
                  if (!product) return;

                  const isAlreadyFav = favourites.some((f) => f.id === product.id);

                  // 🔄 Always toggle
                  dispatch(
                    toggleFavourite({
                      ...product,
                      source: "sales",
                    })
                  );

                  // 🔐 Popup ONLY when adding
                  if (auth.user && !isAlreadyFav) {
                    dispatch(
                      openListPopup({
                        ...product,
                        source: "sales",
                      })
                    );
                  }
                }}
                disabled={!product}
              >
                <HeartIcon
                  filled={isFavourite}
                  className={`w-[clamp(12px,1.1vw,16px)]
              h-[clamp(12px,1.1vw,16px)] ${
                    isFavourite ? "text-red-500" : "text-gray-600 hover:text-red-400"
                  }`}
                />
              </PremiumIconButton>

              <PremiumIconButton title="Share product" onClick={handleShare} disabled={!product}>
                <ShareIcon className="w-[clamp(13px,1.1vw,16px)]
             h-[clamp(13px,1.1vw,16px)] text-[rgba(18,18,18,0.88)] transform-gpu" />
              </PremiumIconButton>

              <PremiumIconButton title="Chat" onClick={handleChat} disabled={!product}>
                <ChatIcon className="w-[clamp(13px,1.1vw,17px)]
             h-[clamp(13px,1.1vw,17px)] text-[rgba(18,18,18,0.88)] transform-gpu" />
              </PremiumIconButton>
            </div>

            {/* THUMBNAIL PREVIEW STRIP */}
            {productImages.length > 1 ? (
              <div
                className="
                  absolute bottom-4 left-1/2 -translate-x-1/2
                  flex items-center gap-3
                  px-3 py-2 rounded-2xl
                  bg-white/55 backdrop-blur-xl border border-white/40
                  shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                  z-30
                  transform-gpu
                "
              >
                {productImages.slice(0, 5).map((imgData, idx) => {
                  const isActive = selectedImage === imgData;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleImageClick(imgData)}
                      className={`
                        relative
                        w-14 h-14 md:w-16 md:h-16
                        rounded-xl overflow-hidden
                        flex items-center justify-center
                        border transition-all duration-300
                        transform-gpu
                        ${isActive
                          ? "border-gray-900 shadow-xl bg-white/40 scale-105"
                          : "border-gray-300 opacity-80 bg-white/25 hover:scale-105"
                        }
                        active:scale-95
                      `}
                    >
                      {/* Smooth highlight outline */}
                      {isActive && (
                        <div
                          className="absolute inset-0 rounded-xl border-[2.5px] border-white shadow-lg transform-gpu"
                        />
                      )}

                      {/* ✅ Thumbnail image with SmartImage */}
                      <SmartImage
                        image={imgData}
                        className={`w-full h-full object-cover transform-gpu ${isActive ? 'scale-110' : 'scale-100'}`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          warn("SalesProductProfile: thumbnail load failed", imgData);
                          e.target.src = "/api/placeholder/200/200";
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            ) : productImages.length === 0 && product ? (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="w-14 h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT: Product details panel */}
        <div className="flex flex-col gap-6 transform-gpu">
          {/* Category + Title + Company */}
          <div className="space-y-2 transform-gpu">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-gray-500 transform-gpu">
              {product ? fw.sales : "LOADING"}
            </p>

            {product ? (
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight transform-gpu">
                {product.name}
              </h1>
            ) : (
              <div className="h-10 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
            )}

            {product ? (
              product.company_name && (
                <button
                  onClick={handleCompanyClick}
                  className="text-sm text-blue-600 font-medium hover:underline w-fit flex items-center gap-1 transform-gpu"
                >
                  <span className="text-gray-500">{fw.by}</span>
                  {product.company_name}
                </button>
              )
            ) : (
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            )}
          </div>

         {/* Price + rating */}
<div className="space-y-2 transform-gpu">
  {product ? (
    <>
      {/* PRICE ROW */}
      <div
  className="flex items-end gap-3 transform-gpu"
  dir={i18n.language === "ar" ? "rtl" : "ltr"}
>
  {/* NEW PRICE */}
  <span
    className="text-3xl font-semibold text-gray-900 transform-gpu"
    dir="ltr"
  >
    {product.price}
  </span>

  {/* OLD PRICE */}
  {product.oldPrice && (
    <span
      className="text-sm text-gray-400 line-through transform-gpu"
      dir="ltr"
    >
      {product.oldPrice}
    </span>
  )}

  {/* CURRENCY */}
  <span className="text-sm font-medium text-gray-500 transform-gpu">
    {fw.qar || "QAR"}
  </span>
</div>


      {/* ⭐ Rating */}
      <div className="flex items-center gap-1 pt-2 transform-gpu">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            filled={i < Math.round(averageRating)}
            className={`w-4 h-4 transform-gpu ${
              i < Math.round(averageRating)
                ? "text-gray-900"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 transform-gpu">
          {averageRating.toFixed(1)}
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="h-8 w-40 bg-gray-100 rounded animate-pulse" />
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </>
  )}
</div>

          
         

          {/* Product Details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3 transform-gpu">
            <h3 className="text-lg font-medium text-gray-900 transform-gpu">{fw.product_details}</h3>
            {product ? (
              <p className="text-gray-600 leading-relaxed text-sm md:text-base transform-gpu">
                {product.description ||
                  ` ${product.name}`}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              </div>
            )}
          </div>

          {/* Write Review Button */}
         <button
  onClick={(e) => {
    e.stopPropagation();

    // 🚫 Guest → redirect to login with intent
    if (!auth?.user) {
     navigate(
  `/sign?redirect=/salesproduct/${resolvedProductId}&action=review`
);
      return;
    }

    // ✅ Logged-in customer → open modal
    setShowReviewModal(true);
  }}
  disabled={!product}
  className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl transition active:scale-95 ${
    product
      ? "bg-gray-900 text-white hover:bg-gray-800"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  }`}
>
  {product ? fw.write_review : "Loading..."}
</button>


      {/* Customer Reviews */}
<div className="space-y-3 transform-gpu">
  <h3 className="text-sm font-semibold text-gray-900 flex items-center justify-between">
    {fw.customer_reviews}
  
  </h3>

  {product && reviews.length > 0 ? (
    <>
      {/* Show only first 2 reviews */}
     {visibleReviews.map((rev) => (
        <div
          key={rev.id}
          className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
        >
          <div className="flex justify-between mb-1">
            <span className="font-semibold text-gray-800">{rev.name}</span>
            <span className="text-gray-500 text-xs">{rev.date}</span>
          </div>

          <div className="flex items-center  gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                filled={i < getSafeRating(rev.rating)}
                className={`w-4 h-4 ${
                  i < getSafeRating(rev.rating)
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-700 text-sm">{rev.comment}</p>
        </div>
      ))}

      {/* 🔗 VIEW ALL REVIEWS BUTTON */}
     {reviews.length > 2 && (
        <button
          onClick={() =>
            navigate(`/product/${resolvedProductId}/reviews`)
          }
          className="
           group
    w-full mt-2 py-2
    text-sm font-medium
    text-blue-600 hover:text-blue-700
    hover:underline
    transition
    flex items-center gap-1.5
    text-left

    ltr:flex-row
  
          "
        >
{(fw.view_all || "View all")} {reviews.length} {(fw.reviews || "reviews")}
  
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="
      w-4 h-4
      transition-transform duration-200
      transform-gpu

      ltr:group-hover:translate-x-0.5
      rtl:group-hover:-translate-x-0.5

      rtl:scale-x-[-1]
    "
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 5l6 7-6 7" />
  </svg>
        </button>
      )}
    </>
  ) : (
    <p className="text-sm text-gray-500">{fw.no_reviews}</p>
  )}
</div>

      
        </div>
      </section>

      {/* ⭐ Similar Products Section - Using imported component */}
      <SimilarProducts
        products={similarProducts}
        favourites={favourites}
        toggleFavourite={(item) => {
          const isAlreadyFav = favourites.some((f) => f.id === item.id);

          dispatch(
            toggleFavourite({
              ...item,
              source: "sales",
            })
          );

          if (auth.user && !isAlreadyFav) {
            dispatch(
              openListPopup({
                ...item,
                source: "sales",
              })
            );
          }
        }}
      />

      <Faq />
      <CallToAction />

      {/* Review Modal – Using imported component */}
      {showReviewModal && product && (
        <ReviewModal
          reviews={reviews}
          reviewName={reviewName}
          reviewText={reviewText}
          reviewRating={reviewRating}
          setReviewName={setReviewName}
          setReviewText={setReviewText}
          setReviewRating={setReviewRating}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
}