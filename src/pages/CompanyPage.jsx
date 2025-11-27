"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdIosShare } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { useFavourites } from "../context/FavouriteContext";
import { useFollowing } from "../context/FollowingContext";
import { useFollowers } from "../context/FollowersContext";
import { getCompany, getSettings, getFixedWords } from "../api";

// =================== Pre-fetch Data ===================
let preloadedData = {
  company: null,
  settings: {},
  fixedWords: {}
};

// Pre-fetch company data immediately when module loads
(async () => {
  try {
    // Get company ID from current path
    const pathSegments = window.location.pathname.split('/');
    const companyId = pathSegments[pathSegments.length - 1];
    
    if (companyId && companyId !== 'company') {
      const [companyRes, settingsRes, fixedWordsRes] = await Promise.allSettled([
        getCompany(companyId),
        getSettings(),
        getFixedWords(),
      ]);

      preloadedData.company = companyRes.status === 'fulfilled' ? 
        (companyRes.value?.data?.data?.company || companyRes.value?.data?.company || companyRes.value?.data) : null;
      preloadedData.settings = settingsRes.status === 'fulfilled' ? settingsRes.value?.data || {} : {};
      preloadedData.fixedWords = fixedWordsRes.status === 'fulfilled' ? fixedWordsRes.value?.data || {} : {};
    }
  } catch (err) {
    console.warn("Pre-fetch failed:", err);
  }
})();

// Lazy load heavy icons only
const FaWhatsapp = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaWhatsapp }))
);
const FaHeart = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaHeart }))
);
const FaArrowLeft = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaArrowLeft }))
);
const FaMapMarkerAlt = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaMapMarkerAlt }))
);
const FaUser = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaUser }))
);

// =================== Skeleton Components ===================
const BannerSkeleton = () => (
  <div className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden bg-gray-300 animate-pulse">
    <div className="absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 rounded-full w-10 h-10"></div>
    <div className="absolute top-24 right-4 sm:right-8 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20"></div>
    <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-10 w-full">
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl bg-gray-400"></div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="h-6 sm:h-8 bg-gray-400 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-1/2"></div>
        <div className="h-4 bg-gray-400 rounded w-1/4 mt-3"></div>
      </div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="py-12">
    <div className="h-8 bg-gray-300 rounded w-1/4 mb-10 mx-6 sm:mx-12"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 sm:px-12">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
      ))}
    </div>
  </div>
);

export default function CompanyPage() {
  const { categoryId, companyId } = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const { isFollowing: checkFollowing, toggleFollow } = useFollowing();
  const { simulateCustomerFollow } = useFollowers();

  const [company, setCompany] = useState(preloadedData.company);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(preloadedData.settings);
  const [fixedWords, setFixedWords] = useState(preloadedData.fixedWords);
  const [isRTL, setIsRTL] = useState(false);

  // Check for RTL language on component mount and when language changes
  useEffect(() => {
    const checkRTL = () => {
      const htmlDir = document.documentElement.getAttribute('dir');
      const isRTL = htmlDir === 'rtl';
      setIsRTL(isRTL);
    };

    checkRTL();
    
    // Listen for language changes
    const observer = new MutationObserver(checkRTL);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['dir'] 
    });

    return () => observer.disconnect();
  }, []);

  // Helper to check favourites
  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  // Check if current company is being followed
  const isFollowing = company ? checkFollowing(company.id) : false;

  // Handle follow toggle with followers integration
  const handleFollowToggle = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!isFollowing) {
      // When following, add to company's followers
      simulateCustomerFollow(companyId, {
        id: currentUser.id || `user-${Date.now()}`,
        name: currentUser.name || 'Anonymous User',
        email: currentUser.email || 'unknown@email.com',
        avatar: currentUser.avatar
      });
    }
    
    // Toggle the follow state
    toggleFollow(company);
  };

  // Determine base path for navigation based on available params
  const getBasePath = () => {
    if (categoryId && companyId) {
      return `/category/${categoryId}/company/${companyId}`;
    } else if (companyId) {
      return `/company/${companyId}`;
    }
    return "/";
  };

  // ===== Background Data Refresh (No UI Blocking) =====
  useEffect(() => {
    let mounted = true;

    const refreshData = async () => {
      try {
        const [companyRes, settingsRes, fixedWordsRes] = await Promise.allSettled([
          getCompany(companyId),
          getSettings(),
          getFixedWords(),
        ]);

        if (!mounted) return;

        // Update state silently in background
        if (companyRes.status === 'fulfilled') {
          const companyData = companyRes.value?.data?.data?.company || companyRes.value?.data?.company || companyRes.value?.data;
          if (companyData) {
            setCompany(companyData);
          }
        }
        
        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value?.data || {});
        }
        
        if (fixedWordsRes.status === 'fulfilled') {
          setFixedWords(fixedWordsRes.value?.data || {});
        }

      } catch (err) {
        console.error("Background data refresh failed:", err);
        // Don't show error to user for background refresh
      }
    };

    // Only refresh if we don't have preloaded data
    if (!company) {
      setLoading(true);
      refreshData().finally(() => {
        if (mounted) setLoading(false);
      });
    } else {
      // Still refresh in background but don't show loading
      refreshData();
    }

    return () => {
      mounted = false;
    };
  }, [categoryId, companyId]);

  // Show content immediately with preloaded data
  const showContent = company;

  if (!showContent && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
        <BannerSkeleton />
        <ProductGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        Company not found.
      </div>
    );
  }

  // Safely extract company properties
  const {
    name,
    title,
    logo,
    banner,
    rating = 0,
    phone,
    location,
    address,
    products = [],
    description
  } = company;

  const displayLocation = location || address;
  const displayRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  const basePath = getBasePath();

  // Dynamic positioning classes for RTL support
  const backButtonClass = isRTL 
    ? "absolute top-20 right-4 sm:right-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300"
    : "absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300";

  const shareButtonClass = isRTL
    ? "absolute top-24 left-4 sm:left-8 z-30 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-xl hover:scale-105 transition-all duration-300"
    : "absolute top-24 right-4 sm:right-8 z-30 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-xl hover:scale-105 transition-all duration-300";

  const floatingIconsClass = isRTL
    ? "absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-40"
    : "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-40";

  const favouriteButtonClass = isRTL
    ? "absolute top-2 left-2 z-10"
    : "absolute top-2 right-2 z-10";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* ============ Banner Section ============ */}
      {showContent ? (
        <div
          className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${
              banner || logo || "/api/placeholder/1200/400"
            }) center/cover no-repeat`,
            willChange: "transform, opacity",
          }}
        >
          {/* 🔙 Back Button - Dynamic positioning for RTL */}
          <button
            onClick={() => navigate(-1)}
            className={backButtonClass}
          >
            <Suspense fallback={<span>←</span>}>
              <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
            </Suspense>
          </button>

          {/* 🔗 Share Button - Dynamic positioning for RTL */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: name,
                  text: `Check out ${name} on Catalogueya!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className={shareButtonClass}
          >
            <MdIosShare className="text-white text-xl sm:text-2xl" />
          </button>

          {/* ===== Company Info ===== */}
          <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-10 w-full">
            <img
              src={logo || "/api/placeholder/200/200"}
              alt={name}
              loading="eager"
              decoding="async"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl 
                         border-2 border-white/50 shadow-2xl backdrop-blur-sm bg-white/10"
              style={{ willChange: "transform" }}
              onError={(e) => {
                e.target.src = "/api/placeholder/200/200";
              }}
            />
            <div className="flex flex-col justify-center text-white flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold tracking-tight drop-shadow-2xl leading-tight break-words text-start rtl:text-right">
                {name}
              </h1>
              {title && (
                <p className="text-xs sm:text-sm opacity-90 mt-1 break-words text-start rtl:text-right">{title}</p>
              )}

              {/* Rating - White stars */}
<div className={`flex items-center gap-4 mt-3 text-sm sm:text-base ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
  <div className={`flex items-center gap-1 text-white font-semibold drop-shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
    <FaStar className="text-white text-lg sm:text-xl" />
    <span>{displayRating.toFixed(1)}</span>
  </div>
</div>
            </div>
          </div>

          {/* ===== FLOATING ACTION ICONS - Horizontal with RTL support ===== */}
          <div className={floatingIconsClass}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20 shadow-2xl">
              <div className={`flex flex-row gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                
                {/* Location */}
                {displayLocation && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayLocation)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                      rounded-lg sm:rounded-xl
                      bg-gray-700/10 backdrop-blur-xl 
                      border border-white/20
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
                      transition-all duration-300 ease-out group relative
                      text-sm sm:text-base
                      hover:bg-gray-300/20
                      hover:shadow-[0_0_5px_currentColor]
                      hover:scale-110 hover:-translate-y-1
                      text-white
                    `}
                  >
                    {/* Icon */}
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <Suspense fallback={<span>📍</span>}>
                        <FaMapMarkerAlt className="text-sm" />
                      </Suspense>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                      bg-black/80 text-white text-xs px-2 py-1  
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor]">
                      Location
                    </div>
                  </a>
                )}

                {/* WhatsApp */}
                {phone && (
                  <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                      rounded-lg sm:rounded-xl
                      bg-gray-700/10 backdrop-blur-xl 
                      border border-white/20
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
                      transition-all duration-300 ease-out group relative
                      text-sm sm:text-base
                      hover:bg-gray-300/20
                      hover:shadow-[0_0_5px_currentColor]
                      hover:scale-110 hover:-translate-y-1
                      text-white
                    `}
                  >
                    {/* Icon */}
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <Suspense fallback={<span>💬</span>}>
                        <FaWhatsapp className="text-sm" />
                      </Suspense>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                      bg-black/80 text-white text-xs px-2 py-1  
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor]">
                      WhatsApp
                    </div>
                  </a>
                )}

                {/* Follow */}
                <button
                  onClick={handleFollowToggle}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                    rounded-lg sm:rounded-xl
                    bg-gray-700/10 backdrop-blur-xl 
                    border border-white/20
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
                    transition-all duration-300 ease-out group relative
                    text-sm sm:text-base
                    hover:bg-gray-300/20
                    hover:shadow-[0_0_5px_currentColor]
                    hover:scale-110 hover:-translate-y-1
                    ${isFollowing ? "text-purple-400" : "text-white"}
                  `}
                >
                  {/* Icon */}
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <Suspense fallback={<span>👤</span>}>
                      <FaUser className={`text-sm ${isFollowing ? 'fill-current' : ''}`} />
                    </Suspense>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                    bg-black/80 text-white text-xs px-2 py-1  
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor]">
                    {isFollowing ? "Following" : "Follow"}
                  </div>
                </button>

                {/* Company Reviews */}
                <button
                  onClick={() => navigate(`${basePath}/reviews`)}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                    rounded-lg sm:rounded-xl
                    bg-gray-700/10 backdrop-blur-xl 
                    border border-white/20
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
                    transition-all duration-300 ease-out group relative
                    text-sm sm:text-base
                    hover:bg-gray-300/20
                    hover:shadow-[0_0_5px_currentColor]
                    hover:scale-110 hover:-translate-y-1
                    text-white
                  `}
                >
                  {/* Icon */}
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <FaStar className="text-sm" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                    bg-black/80 text-white text-xs px-2 py-1  
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor]">
                    Reviews
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <BannerSkeleton />
      )}

      {/* ============ Products Section ============ */}
      {showContent ? (
        <section className="py-12">
          <h2 className="text-2xl md:text-3xl font-light mb-10 text-gray-800 tracking-tight px-6 sm:px-12 break-words text-start rtl:text-right">
            Our Products
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 sm:px-12">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative overflow-hidden cursor-pointer aspect-square group 
                              bg-white rounded-lg border border-gray-200 
                              shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-400"
                  onClick={() => navigate(`${basePath}/product/${product.id}`)}
                >
                  {/* Lazy-load images for speed */}
                  <img
                    src={product.image || product.img || "/api/placeholder/300/300"}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />

                  {/* Product Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  </div>

                  {/* Favourite Toggle - Dynamic positioning for RTL */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product);
                    }}
                    className={favouriteButtonClass}
                  >
                    <Suspense fallback={<span>♡</span>}>
                      <FaHeart
                        className={`text-xl ${
                          isFavourite(product.id)
                            ? "text-red-500 scale-110"
                            : "text-white/90 hover:text-red-400"
                        } drop-shadow-lg transition-transform duration-200`}
                      />
                    </Suspense>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10 text-lg">
              No products available for this company.
            </p>
          )}
        </section>
      ) : (
        <ProductGridSkeleton />
      )}
    </div>
  );
}