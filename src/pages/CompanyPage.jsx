import React, { 
  useEffect, 
  useState, 
  useCallback, 
  useRef, 
  useMemo,
  memo  
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { getCompany, getSettings } from "../api";
import { addFollowCompany, unfollowCompany, getCustomerFollowUps, createCustomerConversation } from "../api";
import { useFixedWords } from "../hooks/useFixedWords";
import BackButton from "../components/BackButton";
import {
  HeartIcon,
  StarIcon,
  ShareIcon,
  ChatIcon,
} from "../components/SvgIcon";
import SmartImage from "../components/SmartImage";

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

// Loading Spinner for infinite scroll
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

// =================== SVG Icons ===================
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
  } catch {
    return null;
  }
};

// ✅ Build payload for showCompany API
const buildShowCompanyPayload = async (page = 1) => {
  const country = await getCountryFromIP();
  const device = navigator.userAgent;
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null;

  return {
    device,
    country,
    page,
    per_page: 10,
    ...(token && { token }),
  };
};

// =================== Modified getCompany API Wrapper ===================
const fetchCompanyWithPayload = async (id, page = 1) => {
  const payload = await buildShowCompanyPayload(page);
  
  try {
    const response = await getCompany(id, payload);
    return response;
  } catch {
    throw new Error("Failed to fetch company data");
  }
};

// =================== IMAGE HELPER FUNCTION ===================
const formatImageUrl = (imgData) => {
  if (!imgData) return null;
  
  // Handle new backend format (object with webp/avif)
  if (typeof imgData === 'object' && imgData !== null) {
    // Return the object as-is, SmartImage will handle it
    return imgData;
  }
  
  // Handle old backend format (string)
  if (typeof imgData === 'string') {
    if (imgData.startsWith("http")) return imgData;
    if (imgData.startsWith("blob:")) return imgData;
    if (imgData.startsWith("data:")) return imgData;
    
    // Clean the path - remove leading slash if present
    const cleanPath = imgData.startsWith('/') ? imgData.slice(1) : imgData;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  return null;
};

// =================== FIXED: SIMPLIFIED ProductImage Component ===================
const ProductImage = memo(({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  onError,
  onClick 
}) => {
  // Check if src is object (new format) or string (old format)
  const isNewFormat = useMemo(() => 
    src && typeof src === 'object' && (src.webp || src.avif), 
    [src]
  );

  // Handle click
  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  // If it's new format (object), use SmartImage
  if (isNewFormat) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <SmartImage
          image={src}
          alt={alt}
          className={`${className} w-full h-full object-cover opacity-100`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onError={onError}
        />
      </div>
    );
  }

  // Old format (string URL) - fallback to regular img
  const formattedSrc = useMemo(() => {
    if (typeof src === 'string') {
      if (src.startsWith("http")) return src;
      if (src.startsWith('/')) return src.slice(1);
      return `${API_BASE_URL}/${src}`;
    }
    return src;
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {formattedSrc && (
        <img
          src={formattedSrc}
          alt={alt}
          className={`${className} w-full h-full object-cover opacity-100`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onClick={handleClick}
          onError={onError}
          style={{ willChange: 'transform, opacity' }}
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
    </div>
  );
});
ProductImage.displayName = 'ProductImage';

// =================== CompanyPage Component ===================
export default function CompanyPage() {
  const { categoryId, companyId } = useParams();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({});
 const location = useLocation();


  const [isRTL, setIsRTL] = useState(false);
  const [products, setProducts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  // Infinite scroll states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Refs for intersection observer
  const observerTarget = useRef(null);

  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  
  // =================== Helper Functions ===================
  const getImageUrl = useCallback((imgData) => {
    return formatImageUrl(imgData);
  }, []);

  const processCompanyProducts = useCallback((products) => {
    if (!Array.isArray(products)) return [];
    
    return products.map(product => ({
      ...product,
      id: product.id || `product-${Math.random().toString(36).substr(2, 9)}`,
      image: getImageUrl(product.image || product.img),
      name: product.name || product.title || product.product_name || "Unnamed Product",
      price: product.price || 0,
      company_id: product.company_id || companyId,
      company_name: product.company_name || company?.name || "Company",
    }));
  }, [companyId, company?.name, getImageUrl]);

  // Function to load more products
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      
      const response = await fetchCompanyWithPayload(companyId, currentPage + 1);
      const companyData = response?.data?.data?.company || response?.data?.company || response?.data;
      
      if (companyData?.products?.length) {
        const processedProducts = processCompanyProducts(companyData.products);
        
        // Filter out duplicates
        const currentProductIds = new Set(products.map(p => p.id));
        const newProducts = processedProducts.filter(p => !currentProductIds.has(p.id));
        
        if (newProducts.length) {
          // Append only new unique products (limit to last 500 for memory)
          setProducts(prev => {
          const merged = [...prev, ...newProducts];

          // Keep last 1500 items only (invisible to users)
          if (merged.length > 1500) {
            return merged.slice(-1500);
          }

          return merged;
        });
          
          // Update from backend pagination (source of truth)
          const pagination = companyData.products_pagination;
          if (pagination) {
            setCurrentPage(pagination.page);
            setHasMore(pagination.has_more || pagination.page < pagination.last_page);
            setTotalProducts(pagination.total || totalProducts);
          }
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [companyId, currentPage, isLoadingMore, hasMore, processCompanyProducts, totalProducts, products]);

  // Function to refresh company data
  const refreshCompanyData = useCallback(async (page = 1) => {
    try {
      const companyRes = await fetchCompanyWithPayload(companyId, page);
      
      const companyData = 
        companyRes?.data?.data?.company ||
        companyRes?.data?.company ||
        companyRes?.data;
      
      if (companyData) {
        setCompany({
          ...companyData,
          logo: getImageUrl(companyData.logo),
          banner: getImageUrl(
            companyData.cover_photo || companyData.banner || companyData.logo
          ),
        });
        
        if (companyData.products) {
          const processedProducts = processCompanyProducts(companyData.products);
          setProducts(processedProducts);
          
          const pagination = companyData.products_pagination;
          if (pagination) {
            setCurrentPage(pagination.page);
            setHasMore(pagination.has_more || pagination.page < pagination.last_page);
            setTotalProducts(pagination.total || 0);
          }
        }
      }
    } catch {
      // Silent error for background refresh
    }
  }, [companyId, getImageUrl, processCompanyProducts]);

  // =================== Infinite Scroll Observer ===================
useEffect(() => {
  if (!observerTarget.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isLoadingMore && hasMore) {
        loadMoreProducts();
      }
    },
    { rootMargin: "600px" }
  );

  observer.observe(observerTarget.current);
  return () => observer.disconnect();
}, [loadMoreProducts, isLoadingMore, hasMore]);


  // =================== Follow Status Check ===================
useEffect(() => {
  if (!auth.isAuthenticated) {
    setIsFollowing(false);
    return;
  }

  let active = true;

  const checkFollowStatus = async () => {
    try {
      const res = await getCustomerFollowUps();
      const companies = res.data?.companies || res.data || [];

      if (active) {
        setIsFollowing(companies.some(c => c.id === Number(companyId)));
      }
    } catch {
      if (active) setIsFollowing(false);
    }
  };

  checkFollowStatus();

  // ✅ IMPORTANT: re-check when page regains focus
  window.addEventListener("focus", checkFollowStatus);

  return () => {
    active = false;
    window.removeEventListener("focus", checkFollowStatus);
  };
}, [companyId, auth.isAuthenticated]);



  const handleFollowToggle = async () => {
  // 👤 Guest → redirect ONLY
  if (!auth.isAuthenticated || auth.userType !== "customer") {
    navigate(
      `/sign?redirect=${encodeURIComponent(location.pathname)}&action=follow&companyId=${companyId}`
    );
    return;
  }

  // 👤 Logged in
  if (followLoading) return;
  setFollowLoading(true);

  try {
    if (isFollowing) {
      await unfollowCompany(companyId);
      setIsFollowing(false);
    } else {
      await addFollowCompany(companyId);
      setIsFollowing(true);
    }
  } finally {
    setFollowLoading(false);
  }
};


  // =================== Check for RTL ===================
  useEffect(() => {
    const checkRTL = () => {
      setIsRTL(document.documentElement.getAttribute('dir') === 'rtl');
    };
    checkRTL();
    
    const observer = new MutationObserver(checkRTL);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['dir'] 
    });
    return () => observer.disconnect();
  }, []);

  // =================== Initial Data Fetch ===================
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!companyId) return;
      
      try {
        setLoading(true);
        
        const [companyRes, settingsRes] = await Promise.all([
          fetchCompanyWithPayload(companyId, 1).catch(() => ({ status: 'rejected' })),
          getSettings().catch(() => ({ status: 'rejected' })),
        ]);

        if (!mounted) return;

        if (companyRes.status !== 'rejected' && companyRes.data) {
          const companyData = 
            companyRes.data?.data?.company ||
            companyRes.data?.company ||
            companyRes.data;
          
          if (companyData) {
            setCompany({
              ...companyData,
              logo: getImageUrl(companyData.logo),
              banner: getImageUrl(
                companyData.cover_photo || companyData.banner || companyData.logo
              ),
            });
            
            if (companyData.products) {
              const processedProducts = processCompanyProducts(companyData.products);
              setProducts(processedProducts);
              
              const pagination = companyData.products_pagination;
              if (pagination) {
                setCurrentPage(pagination.page);
                setHasMore(pagination.has_more || pagination.page < pagination.last_page);
                setTotalProducts(pagination.total || 0);
              }
            }
          } else {
            setError("Company not found");
          }
        } else {
          setError("Failed to load company");
        }
        
        if (settingsRes.status !== 'rejected' && settingsRes.data) {
          setSettings(settingsRes.data);
        }
        
      } catch {
        if (mounted) setError("Failed to load company data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [companyId, getImageUrl, processCompanyProducts]);

  // =================== Event Listeners ===================
  useEffect(() => {
    const handleProductUpdated = (event) => {
      if (event.detail.companyId === companyId) {
        setProducts(prevProducts => {
          const updatedProduct = event.detail.product;
          
          if (event.detail.action === 'created') {
            return [updatedProduct, ...prevProducts];
          } else if (event.detail.action === 'updated') {
            return prevProducts.map(p => 
              p.id === updatedProduct.id ? {
                ...p,
                ...updatedProduct,
                image: getImageUrl(updatedProduct.image || p.image)
              } : p
            );
          } else if (event.detail.action === 'deleted') {
            return prevProducts.filter(p => p.id !== updatedProduct.id);
          }
          return prevProducts;
        });
      }
    };

    const handleProductsUpdated = (event) => {
      if (event.detail.companyId === companyId) {
        refreshCompanyData(1);
      }
    };

    window.addEventListener('productUpdated', handleProductUpdated);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productUpdated', handleProductUpdated);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [companyId, refreshCompanyData, getImageUrl]);

  // =================== Helper Functions ===================
  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  const getBasePath = () => {
    if (categoryId && companyId) {
      return `/category/${categoryId}/company/${companyId}`;
    } else if (companyId) {
      return `/company/${companyId}`;
    }
    return "/";
  };

  const handleChatClick = async () => {
    const chatIntent = `/chat-intent/company/${companyId}`;

    if (!auth.isAuthenticated || auth.userType !== "customer") {
      navigate(`/sign?redirect=${encodeURIComponent(chatIntent)}`);
      return;
    }

    try {
      const res = await createCustomerConversation({
        is_group: false,
        participant_ids: [Number(companyId)],
      });

      const conversationId =
        res.data?.data?.id ||
        res.data?.conversation?.id ||
        res.data?.id;

      if (conversationId) {
        navigate(`/customer-login/chat/${conversationId}`);
      }
    } catch {
      // Silent error
    }
  };



  
const handleToggleFavourite = useCallback(
  (product) => {
    const isAlreadyFav = favourites.some(
      (item) => item.id === product.id
    );

    // ✅ 1. Immediate optimistic update (guest + logged-in)
    dispatch(
      toggleFavourite({
        ...product,
        source: "company",
      })
    );

    // ✅ 2. Logged-in → popup for backend sync
    if (auth.user && !isAlreadyFav) {
      dispatch(
        openListPopup({
          ...product,
          source: "company",
        })
      );
    }
  },
  [dispatch, favourites, auth.user]
);

  // =================== GET COMPANY LOGO URL (SPECIAL HANDLING) ===================
  const getCompanyLogoUrl = useCallback((logoData) => {
    if (!logoData) return "/api/placeholder/200/200";
    
    // If it's the new format (object with webp/avif)
    if (typeof logoData === 'object' && logoData.webp) {
      // For company logo, we need a string URL for the img tag
      const webpPath = logoData.webp;
      if (webpPath.startsWith("http")) return webpPath;
      return `${API_BASE_URL}/${webpPath.replace(/^\//, '')}`;
    }
    
    // If it's a string
    if (typeof logoData === 'string') {
      if (logoData.startsWith("http")) return logoData;
      return `${API_BASE_URL}/${logoData.replace(/^\//, '')}`;
    }
    
    return "/api/placeholder/200/200";
  }, []);

  // =================== GET BANNER URL (SPECIAL HANDLING) ===================
  const getBannerUrl = useCallback((bannerData) => {
    if (!bannerData) return null;
    
    // If it's the new format (object with webp/avif)
    if (typeof bannerData === 'object' && bannerData.webp) {
      // For banner, we need a string URL for CSS background
      const webpPath = bannerData.webp;
      if (webpPath.startsWith("http")) return webpPath;
      return `${API_BASE_URL}/${webpPath.replace(/^\//, '')}`;
    }
    
    // If it's a string
    if (typeof bannerData === 'string') {
      if (bannerData.startsWith("http")) return bannerData;
      return `${API_BASE_URL}/${bannerData.replace(/^\//, '')}`;
    }
    
    return null;
  }, []);

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
  const { name, title, logo, banner, rating = 0, location: companyLocation, address } = company;
  const displayLocation = companyLocation || address;
  const displayRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  const basePath = getBasePath();

  // Dynamic positioning classes for RTL support
  const backButtonClass =
    "absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300 transform-gpu active:scale-95";

  const shareButtonClass =
    "absolute top-24 right-4 sm:right-8 z-30 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-xl hover:scale-105 transition-all duration-300 transform-gpu active:scale-95";

  const floatingIconsClass = isRTL
    ? "absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 transform-gpu"
    : "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 transform-gpu";

  const favouriteButtonClass = "absolute top-2 right-2 z-10 transform-gpu";

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

  // Get banner URL for CSS background
  const bannerUrl = getBannerUrl(banner);
  // Get logo URL for img tag
  const logoUrl = getCompanyLogoUrl(logo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden transform-gpu">
      {/* ============ Banner Section ============ */}
      {showContent ? (
        <div
          className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-x-hidden animate-fade-in transform-gpu"
          style={{
            background: bannerUrl ? `
              linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)),
              url(${bannerUrl})
              center / cover no-repeat
            ` : 'linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65))',
            willChange: "transform, opacity",
          }}
        >
            <BackButton
 
      variant="absolute" className="top-16"
  />

          {/* Share Button */}
          <button
            onClick={handleShare}
            className={shareButtonClass}
          >
            <ShareIcon className="text-white transform-gpu" />
          </button>

           {/* ===== Company Info ===== */}
          <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-24 w-full transform-gpu">
            {/* FIXED: Logo with improved styling */}
            <img
              src={logoUrl}
              alt={name}
              loading="eager"
              decoding="async"
              className="
                w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32
                object-cover
                rounded-xl
                border 
               
                shadow-xl
                transform-gpu
                animate-image-fade
              "
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

                {/* Chat */}
                <button
                  onClick={handleChatClick}
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
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300 transform-gpu">
                    <ChatIcon className="transform-gpu" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 
                    bg-black/80 text-white text-xs px-2 py-1  
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor] transform-gpu">
                    Chat
                  </div>
                </button>

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
                    ${isFollowing ? "text-white" : "text-white"}
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


      {/* ============ Products Section with Infinite Scroll ============ */}
      {showContent ? (
        <section className="py-12 animate-fade-in transform-gpu">
          <h2 className="text-xl md:text-2xl font-light mb-10 text-gray-800 tracking-tight px-6 sm:px-12 text-start rtl:text-right transform-gpu">
            {fw.products || 'Products'}
          </h2>

          {products.length > 0 ? (
            <>
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
                    {/* FIXED: Simplified - Use ProductImage for all cases */}
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full h-full object-cover 
                        transition-transform duration-500 
                        group-hover:scale-[1.06]
                        transform-gpu
                      "
                      priority={false}
                      onError={(e) => {
                        // Optional fallback if image fails
                        if (e.target && typeof product.image === 'string') {
                          e.target.src = '/api/placeholder/300/300';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        const productPayload = {
                          ...product,
                          name:
                            product.name ||
                            product.title ||
                            product.product_name ||
                            "Unnamed Product",
                          company_name: company?.name || product.company_name || "Company",
                          company_id: company?.id || product.company_id || null,
                          price: product.price || 0,
                          image: product.image || "/api/placeholder/300/300",
                        };

                        handleToggleFavourite(productPayload);
                      }}
                      className={`
                        ${favouriteButtonClass}
                        flex items-center justify-center
                        w-[clamp(26px,3vw,32px)]
                        h-[clamp(26px,3vw,32px)]
                        rounded-full
                        backdrop-blur-md
                        border
                        shadow-md
                        transition
                        hover:scale-110 active:scale-95
                        transform-gpu
                        z-20
                        ${
                          isFavourite(product.id)
                            ? "bg-red-100 text-red-600 border-red-200"
                            : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                        }
                      `}
                    >
                      <HeartIcon
                        filled={isFavourite(product.id)}
                        className={`
                          w-[clamp(11px,1.4vw,14px)]
                          h-[clamp(11px,1.4vw,14px)]
                          transition-colors
                          ${
                            isFavourite(product.id)
                              ? "text-red-500 scale-110"
                              : "text-gray-600 hover:text-red-400"
                          }
                        `}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Loading Indicator */}
              {isLoadingMore && (
                <div className="mt-8">
                  <LoadingSpinner />
                </div>
              )}

              {/* Infinite Scroll Trigger */}
              {hasMore && !isLoadingMore && products.length > 0 && (
                <div 
                  ref={observerTarget} 
                  className="h-10 w-full"
                  style={{ visibility: 'hidden' }}
                ></div>
              )}
            </>
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
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes image-fade {
          0% { opacity: 0.6; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-image-fade { animation: image-fade 0.35s ease-out; }
      `}</style>
    </div>
  );
}