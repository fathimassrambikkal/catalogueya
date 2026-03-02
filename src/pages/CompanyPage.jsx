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
import { getCompany } from "../api";
import { addFollowCompany, unfollowCompany, getCustomerFollowUps, createCustomerConversation } from "../api";
import { useFixedWords } from "../hooks/useFixedWords";
import { ChatIcon } from "../components/SvgIcon";
import {
  HeartIcon,
  StarIcon,
  
} from "../components/SvgIcon";
import SmartImage from "../components/SmartImage";
import { ShareAltIcon } from "../components/SvgIcon";

import {
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon,
  PinterestIcon,
  SnapchatIcon,
} from "../components/SocialSvg";

const SOCIAL_ICON_MAP = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsappIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  tweeter: TwitterIcon,
  pinterest: PinterestIcon,
  snapchat: SnapchatIcon,
};

// =================== Skeleton Components ===================
const BannerSkeleton = () => (
  <div className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden bg-gray-300 animate-pulse transform-gpu">
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
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || null;

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
  
  if (typeof imgData === 'object' && imgData !== null) {
    return imgData;
  }
  
  if (typeof imgData === 'string') {
    if (imgData.startsWith("http")) return imgData;
    if (imgData.startsWith("blob:")) return imgData;
    if (imgData.startsWith("data:")) return imgData;
    
    const cleanPath = imgData.startsWith('/') ? imgData.slice(1) : imgData;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  return null;
};

// =================== ProductImage Component ===================
const ProductImage = memo(({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  onError,
  onClick 
}) => {
  const isNewFormat = useMemo(() => 
    src && typeof src === 'object' && (src.webp || src.avif), 
    [src]
  );

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

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
  const location = useLocation();

  const [isRTL, setIsRTL] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  // ✅ Pagination states (exactly like NewArrivalProductPage)
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const loadMoreRef = useRef(null);
  
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const socialLinks = useMemo(() => {
    if (!company) return [];

    const raw = {
      youtube: company.youtube,
      instagram: company.instagram,
      facebook: company.facebook,
      whatsapp: company.whatsapp,
      linkedin: company.linkedin,
      twitter: company.twitter || company.tweeter,
      pinterest: company.pinterest,
      snapchat: company.snapchat,
    };

    return Object.entries(raw)
      .filter(([, url]) => Boolean(url))
      .map(([key, url]) => ({
        key,
        url,
        Icon: SOCIAL_ICON_MAP[key],
      }))
      .filter(item => item.Icon);
  }, [company]);

  // =================== Mobile Detection (like NewArrivalProductPage) ===================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // =================== Helper Functions ===================
  const getImageUrl = useCallback((imgData) => {
    return formatImageUrl(imgData);
  }, []);

  const processCompanyProducts = useCallback((products) => {
    if (!Array.isArray(products)) return [];
    
    return products.map(product => ({
      ...product,
      id: product.id, // ✅ Keep original ID, don't generate random ones
      image: getImageUrl(product.image),
      name: product.name || "Unnamed Product",
      price: product.price || 0,
      company_id: companyId,
      company_name: company?.name || "Company",
    }));
  }, [companyId, company?.name, getImageUrl]);

  // ✅ Fetch company page function (exactly like NewArrivalProductPage)
  const fetchCompanyPage = useCallback(async (pageToLoad) => {
  try {
    setLoading(true);

    const res = await getCompany(companyId, pageToLoad);

    const companyData = res?.data?.data?.company;
    if (!companyData) return;

    if (pageToLoad === 1) {
      setCompany({
        ...companyData,
        logo: getImageUrl(companyData.logo),
        banner: getImageUrl(companyData.cover_photo),
      });
    }

    const pagination = companyData.products_pagination;
    setLastPage(pagination?.last_page || 1);

    const processedProducts = processCompanyProducts(
      companyData.products || []
    );

    setProducts(prev => {
      if (pageToLoad === 1) return processedProducts;

      if (!isMobile) return processedProducts;

      return [...prev, ...processedProducts];
    });

    setError(null);
  } catch (err) {
    console.error(err);
    setError("Failed to load company data");
  } finally {
    setLoading(false);
  }
}, [companyId, isMobile, processCompanyProducts, getImageUrl]);

  // ✅ Fetch when page changes (exactly like NewArrivalProductPage)
  useEffect(() => {
    if (!companyId) return;
    
    fetchCompanyPage(page);
  }, [companyId, page, fetchCompanyPage]);

  // ✅ Mobile infinite scroll (exactly like NewArrivalProductPage)
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
        threshold: 0
      }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [isMobile, page, lastPage, loading]);

  // Scroll to top on page change for desktop/tablet
  useEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, isMobile]);

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
    window.addEventListener("focus", checkFollowStatus);

    return () => {
      active = false;
      window.removeEventListener("focus", checkFollowStatus);
    };
  }, [companyId, auth.isAuthenticated]);

  const handleFollowToggle = async () => {
    if (!auth.isAuthenticated || auth.userType !== "customer") {
      navigate(
        `/sign?redirect=${encodeURIComponent(location.pathname)}&action=follow&companyId=${companyId}`
      );
      return;
    }

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
        // Refresh from page 1
        setPage(1);
      }
    };

    window.addEventListener('productUpdated', handleProductUpdated);
    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productUpdated', handleProductUpdated);
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [companyId, getImageUrl]);

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

      dispatch(
        toggleFavourite({
          ...product,
          source: "company",
        })
      );

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

  // =================== GET COMPANY LOGO URL ===================
  const getCompanyLogoUrl = useCallback((logoData) => {
    if (!logoData) return "/api/placeholder/200/200";
    
    if (typeof logoData === 'object' && logoData.webp) {
      const webpPath = logoData.webp;
      if (webpPath.startsWith("http")) return webpPath;
      return `${API_BASE_URL}/${webpPath.replace(/^\//, '')}`;
    }
    
    if (typeof logoData === 'string') {
      if (logoData.startsWith("http")) return logoData;
      return `${API_BASE_URL}/${logoData.replace(/^\//, '')}`;
    }
    
    return "/api/placeholder/200/200";
  }, []);

  // =================== GET BANNER URL ===================
  const getBannerUrl = useCallback((bannerData) => {
    if (!bannerData) return null;
    
    if (typeof bannerData === 'object' && bannerData.webp) {
      const webpPath = bannerData.webp;
      if (webpPath.startsWith("http")) return webpPath;
      return `${API_BASE_URL}/${webpPath.replace(/^\//, '')}`;
    }
    
    if (typeof bannerData === 'string') {
      if (bannerData.startsWith("http")) return bannerData;
      return `${API_BASE_URL}/${bannerData.replace(/^\//, '')}`;
    }
    
    return null;
  }, []);

  // =================== UI Functions ===================
  const handleOpenProduct = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`${getBasePath()}/product/${id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: company?.name,
        text: `Check out ${company?.name} on Catalogueya!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading state - only show full skeleton on first page load
  if (loading && page === 1) {
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

  const { name, title, logo, banner, rating = 0, location: companyLocation, address } = company;
  const displayLocation = companyLocation || address;
  const displayRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  const basePath = getBasePath();
  const bannerUrl = getBannerUrl(banner);
  const logoUrl = getCompanyLogoUrl(logo);
  const favouriteButtonClass = "absolute top-2 right-2 z-10 transform-gpu";

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-screen">
      {/* Fixed top loading indicator - same as NewArrivalProductPage */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* ============ Banner Section ============ */}
<>
  <div className="relative h-[250px] sm:h-[300px] lg:h-[400px] overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10 pointer-events-none" />

    <div
      className="w-full h-full bg-center bg-cover "
      style={{
        backgroundImage: bannerUrl
          ? `url(${bannerUrl})`
          : "radial-gradient(circle at 30% 50%, #f5f5f7, #e8e8ed)",
      }}
    />
  </div>

  {/* ===== Floating Glass Card ===== */}
  <div className="relative px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 z-20">
    <div className="mx-auto max-w-7xl">
      <div className="bg-white/70 backdrop-blur-2xl backdrop-saturate-200 rounded-3xl shadow-2xl shadow-black/5 border border-white/60 p-6 sm:p-8">

        {/* ===== Top Section ===== */}
        <div className="flex items-end gap-5 sm:gap-6 flex-nowrap">

          {/* Logo */}
          <div className="relative -mt-12 sm:-mt-16 shrink-0">
            <div className="
              w-16 h-16
              min-[360px]:w-18 min-[360px]:h-18
              sm:w-20 sm:h-20
              md:w-24 md:h-24
              rounded-2xl bg-white/90 backdrop-blur-xl
              ring-4 ring-white/60 shadow-xl
              transition-transform duration-300 hover:scale-105
            ">
              <img
                src={logoUrl}
                alt={name}
                onError={(e) => (e.target.src = "/api/placeholder/200/200")}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className=" min-w-0">

{/* Title + Rating */}
<div className="flex flex-wrap items-baseline gap-2">

  <h1
    className="
      text-[clamp(1rem,4vw,2.5rem)]
      sm:text-2xl
      md:text-3xl
      lg:text-4xl
      font-medium
      tracking-tight
      text-gray-900
      leading-[1.15]
      break-words
      line-clamp-2
    "
  >
    {name}
  </h1>

  <div
    className="
      inline-flex items-center
      px-2.5 py-1
      bg-black/5
      backdrop-blur-sm
      rounded-full
      text-xs sm:text-sm
      font-medium
      whitespace-nowrap
      self-baseline
    "
  >
    ★ {displayRating.toFixed(1)}
  </div>

</div>

            {title && (
              <p className="text-sm sm:text-base text-gray-600/90 font-light mt-1 truncate">
                {title}
              </p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-[clamp(0.5rem,2vw,0.75rem)] mt-4 flex-nowrap">
              {/* Follow */}
              <button
                onClick={handleFollowToggle}
                className={`
                  relative
                  px-[clamp(1rem,3vw,1.75rem)]
                  py-[clamp(0.5rem,1.5vw,0.75rem)]
                  rounded-full
                  text-[clamp(0.75rem,2.5vw,0.875rem)]
                  font-semibold
                  tracking-tight
                  transition-all duration-300 ease-out
                  overflow-hidden
                  select-none
                  active:scale-[0.97]
                  whitespace-nowrap
                  ${
                    isFollowing
                      ? "bg-white text-gray-900 border border-gray-200 shadow-sm"
                      : `
                        bg-gradient-to-b from-blue-500 to-blue-600
                        text-white
                        shadow-lg shadow-blue-500/25
                        hover:shadow-xl hover:shadow-blue-500/30
                        hover:scale-[1.03]
                      `
                  }
                `}
              >
                {/* Gloss highlight */}
                {!isFollowing && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-t from-white/0 via-white/20 to-white/40 opacity-20 pointer-events-none" />
                )}

                <span className="relative z-10">
                  {isFollowing ? "Following" : "Follow"}
                </span>
              </button>

              {/* Chat */}
              <button
                onClick={handleChatClick}
                className="
                  group
                  relative
                  inline-flex items-center gap-2
                  px-[clamp(0.75rem,2.5vw,1.25rem)]
                  py-[clamp(0.5rem,1.5vw,0.75rem)]
                  rounded-full
                  text-[clamp(0.75rem,2.5vw,0.875rem)]
                  font-medium
                  text-gray-900
                  bg-white/30
                  backdrop-blur-2xl
                  backdrop-saturate-180
                  border border-white/30
                  shadow-[0_4px_14px_rgba(0,0,0,0.03)]
                  transition-all duration-400 ease-out
                  hover:bg-white/40
                  hover:border-white/50
                  hover:shadow-[0_8px_20px_-12px_rgba(0,0,0,0.12)]
                  active:scale-[0.97]
                  whitespace-nowrap
                "
              >
                <ChatIcon className="relative w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)] text-gray-800 transition-transform duration-300 group-hover:scale-105" />
                <span className="relative">Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== Bottom Floating Navigation ===== */}
       <div className="
  mt-8 pt-6 border-t border-white/30
  flex flex-col sm:flex-row
  items-start sm:items-center
  justify-start sm:justify-between
  gap-4
">

          {/* Left Buttons */}
          <div className="flex items-center gap-2 backdrop-blur-xl bg-white/30 rounded-2xl p-1.5">

            {displayLocation && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-white/70 transition-all duration-200">
                <MapMarkerIcon className="w-4 h-4" />
                <span>Location</span>
              </button>
            )}

            <button
              onClick={() => navigate(`${basePath}/reviews`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-white/70 transition-all duration-200"
            >
              <StarIcon className="w-4 h-4" />
              <span>Reviews</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-white/70 transition-all duration-200"
            >
              <ShareAltIcon className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap max-w-full">
             {socialLinks.length > 0 && (
  <div className="flex flex-wrap gap-2 max-w-full">
    {socialLinks.map(({ key, url, Icon }) => (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-white/50 backdrop-blur-xl flex items-center justify-center hover:bg-white/80 transition-all duration-200 shadow-sm"
      >
        <Icon className="w-4 h-4 text-gray-700" />
      </a>
    ))}
  </div>
)}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</>
      {/* ============ Products Section with Pagination ============ */}
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
                  className="relative aspect-square cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 group transform-gpu hover:scale-[1.02]"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] transform-gpu"
                    priority={false}
                    onError={(e) => {
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
                        name: product.name || "Unnamed Product",
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

            {/* ✅ Mobile infinite scroll sentinel - exactly like NewArrivalProductPage */}
            {isMobile && page < lastPage && (
              <div 
                ref={loadMoreRef} 
                className="h-20 flex justify-center items-center"
              >
                {loading && page > 1 ? (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                )}
              </div>
            )}

            {/* ✅ Desktop/Tablet Pagination - exactly like NewArrivalProductPage */}
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
        ) : (
          <p className="text-gray-500 text-center py-10 text-lg transform-gpu">
            No products available for this company.
          </p>
        )}
      </section>

      {/* CSS Animations */}
      <style >{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}