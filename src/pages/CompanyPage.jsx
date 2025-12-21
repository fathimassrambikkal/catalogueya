import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { useFollowing } from "../context/FollowingContext";
import { useFollowers } from "../context/FollowersContext";
import { getCompany, getSettings, getFixedWords } from "../api";

// =================== SVG Icons (keep the same) ===================
const ArrowLeftIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="18" 
    height="18" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const HeartIcon = ({ filled, className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="17" 
    height="17" 
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const StarIcon = ({ filled, className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="16" 
    height="16" 
    viewBox="0 0 576 512"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "currentColor" : "#9CA3AF"}
    strokeWidth="30"
  >
    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
  </svg>
);

const ShareIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="22" 
    height="22" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </svg>
);

const MapMarkerIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="14" 
    height="14" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const WhatsAppIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="14" 
    height="14" 
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.897 6.994c-.004 5.45-4.437 9.88-9.885 9.88m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
  </svg>
);

const UserIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="14" 
    height="14" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// =================== API Helper Functions ===================
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// ✅ Function to get country from IP
const getCountryFromIP = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_name;
  } catch (e) {
    console.warn("Failed to get country from IP:", e);
    return null;
  }
};

// ✅ Build payload for showCompany API (similar to showProduct)
const buildShowCompanyPayload = async () => {
  const country = await getCountryFromIP();
  console.log("🌍 Country for Company API:", country);

  const device = navigator.userAgent;
  console.log("📱 Device Type:", device);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null;
  
  console.log("🔑 Token exists:", !!token);

  return {
    device,
    country,
    ...(token && { token }),
  };
};

// =================== Modified getCompany API Wrapper ===================
const fetchCompanyWithPayload = async (id) => {
  console.log("🔄 Calling showCompany API:");
  console.log("   ID:", id);
  
  const payload = await buildShowCompanyPayload();
  console.log("   Payload:", payload);
  console.log("   Endpoint:", `/showCompany/${id}`);
  
  try {
    const response = await getCompany(id, payload);
    console.log("✅ showCompany Response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ showCompany Error:", error);
    console.error("   Status:", error.response?.status);
    console.error("   Response:", error.response?.data);
    throw error;
  }
};

// =================== Skeleton Components ===================
const BannerSkeleton = () => (
  <div className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden bg-gray-300 animate-pulse transform-gpu">
    <div className="absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 rounded-full w-10 h-10 transform-gpu"></div>
    <div className="absolute top-24 right-4 sm:right-8 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 transform-gpu"></div>
    <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-10 w-full transform-gpu">
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl bg-gray-400 transform-gpu"></div>
      <div className="flex flex-col justify-center flex-1 min-w-0 transform-gpu">
        <div className="h-6 sm:h-8 bg-gray-400 rounded w-3/4 mb-2 transform-gpu"></div>
        <div className="h-4 bg-gray-400 rounded w-1/2 transform-gpu"></div>
        <div className="h-4 bg-gray-400 rounded w-1/4 mt-3 transform-gpu"></div>
      </div>
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="py-12 transform-gpu">
    <div className="h-8 bg-gray-300 rounded w-1/4 mb-10 mx-6 sm:mx-12 transform-gpu"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 sm:px-12 transform-gpu">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-square bg-gray-300 rounded-lg animate-pulse transform-gpu"></div>
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

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({});
  const [fixedWords, setFixedWords] = useState({});
  const [isRTL, setIsRTL] = useState(false);
  const [products, setProducts] = useState([]);

  // =================== Helper Functions ===================
  // Helper function to get proper image URLs
  const getImageUrl = useCallback((imgPath) => {
    if (!imgPath) return "/api/placeholder/300/300";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("blob:")) return imgPath;
    if (imgPath.startsWith("data:")) return imgPath;
    
    // Handle relative paths from API
    const cleanPath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
    return `${API_BASE_URL}/${cleanPath}`;
  }, []);

  // Helper function to process company products
  const processCompanyProducts = useCallback((products) => {
    if (!Array.isArray(products)) return [];
    
    return products.map(product => ({
      ...product,
      id: product.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      image: getImageUrl(product.image || product.img),
      name: product.name || product.title || product.product_name || "Unnamed Product",
      price: product.price || 0,
      stock: product.stock || product.quantity || 0,
      company_id: product.company_id || companyId,
      company_name: product.company_name || company?.name || "Company",
      category_name: product.category_name || "",
      isOnSale: product.isOnSale || product.category_name === "SALE" || product.category_name === "Sale",
      isNewArrival: product.isNewArrival || product.category_name === "NEW ARRIVAL" || product.category_name === "New Arrival",
      tags: product.tags || product.special_mark || []
    }));
  }, [companyId, company?.name, getImageUrl]);

  // Function to refresh company data with payload
  const refreshCompanyData = useCallback(async () => {
    if (!companyId) return;
    
    try {
      console.log("🔄 Refreshing company data with payload...");
      const companyRes = await fetchCompanyWithPayload(companyId);
      
      const companyData = 
        companyRes?.data?.data?.company ||
        companyRes?.data?.company ||
        companyRes?.data;
      
      if (companyData) {
        // Process company data to ensure proper URLs
        const processedCompany = {
          ...companyData,
          logo: getImageUrl(companyData.logo),
          banner: getImageUrl(companyData.banner || companyData.logo),
        };
        
        setCompany(processedCompany);
        
        if (companyData.products) {
          const processedProducts = processCompanyProducts(companyData.products);
          setProducts(processedProducts);
          console.log("✅ CompanyPage products refreshed:", processedProducts.length);
          
          // Dispatch event for other components that might be listening
          window.dispatchEvent(new CustomEvent('companyProductsUpdated', {
            detail: { 
              companyId, 
              products: processedProducts,
              timestamp: Date.now()
            }
          }));
        }
      }
    } catch (error) {
      console.error("❌ Failed to refresh company data:", error);
    }
  }, [companyId, getImageUrl, processCompanyProducts]);

  // =================== Check for RTL ===================
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

  // =================== Listen for Product Updates ===================
  useEffect(() => {
    console.log("🎯 CompanyPage mounted, setting up event listeners for companyId:", companyId);

    // Handle individual product updates
    const handleProductUpdated = (event) => {
      console.log("🔄 CompanyPage received productUpdated event:", event.detail);
      
      if (event.detail.companyId === companyId) {
        console.log("🔄 Updating specific product in CompanyPage:", event.detail.product);
        
        // Update the specific product in the products array
        setProducts(prevProducts => {
          const updatedProduct = event.detail.product;
          
          if (event.detail.action === 'created') {
            // Add new product to the beginning of the list
            return [updatedProduct, ...prevProducts];
          } else if (event.detail.action === 'updated') {
            // Update existing product
            return prevProducts.map(p => 
              p.id === updatedProduct.id ? {
                ...p,
                ...updatedProduct,
                image: getImageUrl(updatedProduct.image || p.image)
              } : p
            );
          } else if (event.detail.action === 'deleted') {
            // Remove deleted product
            return prevProducts.filter(p => p.id !== updatedProduct.id);
          }
          return prevProducts;
        });
      }
    };

    // Handle bulk products updates
    const handleProductsUpdated = (event) => {
      console.log("🔄 CompanyPage received productsUpdated event:", event.detail);
      
      if (event.detail.companyId === companyId) {
        console.log("🔄 Refreshing all products in CompanyPage for company:", companyId);
        
        // Refresh the entire company data
        refreshCompanyData();
      }
    };

    // Listen for events
    window.addEventListener('productUpdated', handleProductUpdated);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      console.log("🧹 CompanyPage cleaning up event listeners");
      window.removeEventListener('productUpdated', handleProductUpdated);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [companyId, refreshCompanyData, getImageUrl]);

  // =================== Initial Data Fetch with Payload ===================
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!companyId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("🚀 Fetching company data with payload for ID:", companyId);
        
        // Fetch company data with payload (device, country, token)
        const [companyRes, settingsRes, fixedWordsRes] = await Promise.allSettled([
          fetchCompanyWithPayload(companyId),
          getSettings(),
          getFixedWords(),
        ]);

        if (!mounted) return;

        // Process company response
        if (companyRes.status === 'fulfilled') {
          const companyData = 
            companyRes.value?.data?.data?.company ||
            companyRes.value?.data?.company ||
            companyRes.value?.data;
          
          if (companyData) {
            // Process company data to ensure proper URLs
            const processedCompany = {
              ...companyData,
              logo: getImageUrl(companyData.logo),
              banner: getImageUrl(companyData.banner || companyData.logo),
            };
            
            setCompany(processedCompany);
            
            if (companyData.products) {
              const processedProducts = processCompanyProducts(companyData.products);
              setProducts(processedProducts);
            }
          } else {
            setError("Company not found in API response");
          }
        } else {
          setError(`Failed to load company: ${companyRes.reason?.message || 'Unknown error'}`);
        }
        
        // Process settings and fixed words
        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value?.data || {});
        }
        
        if (fixedWordsRes.status === 'fulfilled') {
          setFixedWords(fixedWordsRes.value?.data || {});
        }

      } catch (err) {
        console.error("❌ Error loading company data:", err);
        if (mounted) setError(`Failed to load company: ${err.message}`);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [companyId, getImageUrl, processCompanyProducts]);

  // =================== Background Data Refresh ===================
  useEffect(() => {
    if (company?.products) {
      const processedProducts = processCompanyProducts(company.products);
      setProducts(processedProducts);
    }
  }, [company, processCompanyProducts]);

  // =================== Helper Functions ===================
  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  const isFollowing = company ? checkFollowing(company.id) : false;

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

  const getBasePath = () => {
    if (categoryId && companyId) {
      return `/category/${categoryId}/company/${companyId}`;
    } else if (companyId) {
      return `/company/${companyId}`;
    }
    return "/";
  };

  // =================== UI Functions ===================
  const showContent = company;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white transform-gpu">
        <BannerSkeleton />
        <ProductGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium transform-gpu">
        {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium transform-gpu">
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
    description
  } = company;

  const displayLocation = location || address;
  const displayRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  const basePath = getBasePath();

  // Dynamic positioning classes for RTL support
  const backButtonClass = isRTL 
    ? "absolute top-20 right-4 sm:right-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300 transform-gpu active:scale-95"
    : "absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300 transform-gpu active:scale-95";

  const shareButtonClass = isRTL
    ? "absolute top-24 left-4 sm:left-8 z-30 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-xl hover:scale-105 transition-all duration-300 transform-gpu active:scale-95"
    : "absolute top-24 right-4 sm:right-8 z-30 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-xl hover:scale-105 transition-all duration-300 transform-gpu active:scale-95";

  const floatingIconsClass = isRTL
    ? "absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 transform-gpu"
    : "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 transform-gpu";

  const favouriteButtonClass = isRTL
    ? "absolute top-2 left-2 z-10 transform-gpu"
    : "absolute top-2 right-2 z-10 transform-gpu";

  const handleOpenProduct = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`${basePath}/product/${id}`);
  };

  const handleShare = () => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden transform-gpu">
      {/* ============ Banner Section ============ */}
      {showContent ? (
        <div
          className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-x-hidden animate-fade-in transform-gpu"
          style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${
              getImageUrl(banner) || getImageUrl(logo) || "/api/placeholder/1200/400"
            }) center/cover no-repeat`,
            willChange: "transform, opacity",
          }}
        >
          {/* 🔙 Back Button - Dynamic positioning for RTL */}
          <button
            onClick={() => navigate(-1)}
            className={backButtonClass}
          >
            <ArrowLeftIcon className="text-gray-700 text-sm sm:text-md md:text-lg transform-gpu" />
          </button>

          {/* 🔗 Share Button - Dynamic positioning for RTL */}
          <button
            onClick={handleShare}
            className={shareButtonClass}
          >
            <ShareIcon className="text-white transform-gpu" />
          </button>

          {/* ===== Company Info ===== */}
          <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-10 w-full transform-gpu">
            <img
              src={getImageUrl(logo) || "/api/placeholder/200/200"}
              alt={name}
              loading="eager"
              decoding="async"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl 
                         border-2 border-white/50 shadow-2xl backdrop-blur-sm bg-white/10 transform-gpu animate-image-fade"
              style={{ willChange: "transform" }}
              onError={(e) => {
                e.target.src = "/api/placeholder/200/200";
              }}
            />
            <div className="flex flex-col justify-center text-white flex-1 min-w-0 transform-gpu">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight drop-shadow-2xl leading-tight break-words text-start rtl:text-right transform-gpu">
                {name}
              </h1>
              {title && (
                <p className="text-xs sm:text-sm opacity-90 mt-1 break-words text-start rtl:text-right transform-gpu">{title}</p>
              )}

              {/* Rating - White stars */}
              <div className={`flex items-center gap-4 mt-3 text-sm sm:text-base ${isRTL ? 'flex-row-reverse justify-end' : ''} transform-gpu`}>
                <div className={`flex items-center gap-1 text-white font-semibold drop-shadow-lg ${isRTL ? 'flex-row-reverse' : ''} transform-gpu`}>
                  <StarIcon className="text-white text-lg sm:text-xl transform-gpu" />
                  <span className="transform-gpu">{displayRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== FLOATING ACTION ICONS - Horizontal with RTL support ===== */}
          <div className={floatingIconsClass}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20 shadow-2xl transform-gpu">
              <div className={`flex flex-row gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''} transform-gpu`}>
                
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
                      transform-gpu active:scale-95
                    `}
                  >
                    {/* Icon */}
                    <div className="relative z-10  group-hover:scale-110 transition-transform duration-300 transform-gpu">
                      <MapMarkerIcon className="transform-gpu" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2  -translate-x-1/2 
                      bg-black/80 text-white text-xs px-2 py-1  
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor] transform-gpu">
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
                      transform-gpu active:scale-95
                    `}
                  >
                    {/* Icon */}
                    <div className="relative z-10  group-hover:scale-110 transition-transform duration-300 transform-gpu">
                      <WhatsAppIcon className="transform-gpu" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2  -translate-x-1/2 
                      bg-black/80 text-white text-xs px-2 py-1  
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor] transform-gpu">
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
                    transform-gpu active:scale-95
                  `}
                >
                  {/* Icon */}
                  <div className="relative z-10  group-hover:scale-110 transition-transform duration-300 transform-gpu">
                    <UserIcon className={`${isFollowing ? 'fill-current' : ''} transform-gpu`} />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2  -translate-x-1/2 
                    bg-black/80 text-white text-xs px-2 py-1  
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor] transform-gpu">
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
                    transform-gpu active:scale-95
                  `}
                >
                  {/* Icon */}
                  <div className="relative z-10  group-hover:scale-110 transition-transform duration-300 transform-gpu">
                    <StarIcon className="transform-gpu" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2  -translate-x-1/2 
                    bg-black/80 text-white text-xs px-2 py-1  
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor] transform-gpu">
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
        <section className="py-12 animate-fade-in transform-gpu">
          <h2 className="text-xl md:text-2xl font-light mb-10 text-gray-800 tracking-tight px-6 sm:px-12 text-start rtl:text-right transform-gpu">
            Our Products 
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 sm:px-8 transform-gpu">

              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product.id)}
                  className="
                    relative aspect-square cursor-pointer 
                    bg-white border border-gray-200 rounded-xl
                    overflow-hidden shadow-sm transition-all duration-300
                    group transform-gpu
                    hover:scale-[1.02]
                  "
                >
                  {/* IMAGE — Only it zooms */}
                  <img
                    src={product.image || '/api/placeholder/300/300'}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.target.src = '/api/placeholder/300/300')}
                    className="
                      w-full h-full object-cover 
                      transition-transform duration-500 
                      group-hover:scale-[1.06]
                      transform-gpu
                    "
                  />
                  {/* FAVOURITE BUTTON — same functionality as before */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      toggleFavourite({
                        ...product,
                        name: product.name || product.title || product.product_name || "Unnamed Product",
                        company_name: company?.name || product.company_name || "Company",
                        company_id: company?.id || product.company_id || null,
                        price: product.price || 0,
                        category_name: product.category_name || "",
                        isOnSale:
                          product.isOnSale ||
                          product.category_name === "SALE" ||
                          product.category_name === "Sale",
                        isNewArrival:
                          product.isNewArrival ||
                          product.category_name === "NEW ARRIVAL" ||
                          product.category_name === "New Arrival",
                        image: product.image || "/api/placeholder/300/300",
                      });
                    }}
                    className={`${favouriteButtonClass} z-20 transform-gpu active:scale-95`}
                  >
                    <HeartIcon
                      filled={isFavourite(product.id)}
                      className={`
                        text-xl drop-shadow transition-all duration-300
                        ${isFavourite(product.id)
                          ? "text-red-500 scale-110"
                          : "text-white/90 hover:text-red-400"}
                        transform-gpu
                      `}
                    />
                  </button>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-500 text-center py-10 text-lg transform-gpu">
              No products available for this company.
            </p>
          )}
        </section>
      ) : (
        <ProductGridSkeleton />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes image-fade {
          0% {
            opacity: 0.6;
            transform: scale(1.03);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-image-fade {
          animation: image-fade 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}