import React, { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  memo,
  useRef
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
import { useFixedWords } from "../hooks/useFixedWords";

import {
  HeartIcon,
  StarIcon,
  ArrowOutward
} from "../components/SvgIcon";
import { error as logError } from "../utils/logger";

import { getCategory } from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// =================== DETECT MOBILE (FIXED VERSION) ===================
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Use matchMedia for more reliable detection
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    
    const checkMobile = (e) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Add listener for changes
    mediaQuery.addEventListener("change", checkMobile);
    
    return () => {
      mediaQuery.removeEventListener("change", checkMobile);
    };
  }, []);

  return isMobile;
};

// =================== RATING HELPERS (MEMOIZED) ===================
const useRatingHelpers = () => {
  const getSafeRating = useCallback((rating) => {
    // Handle rating object with avg property (new format)
    if (typeof rating === 'object' && rating !== null && 'avg' in rating) {
      return Math.min(5, Math.max(0, parseFloat(rating.avg) || 0));
    }
    
    // Handle direct number or string (old format)
    if (typeof rating === 'number') return Math.min(5, Math.max(0, rating));
    if (typeof rating === 'string') return Math.min(5, Math.max(0, parseFloat(rating) || 0));
    
    return 0;
  }, []);

  const formatRating = useCallback((rating) => {
    return getSafeRating(rating).toFixed(1);
  }, [getSafeRating]);

  const getRatingValueForSort = useCallback((rating) => {
    // Extract rating value for sorting
    if (typeof rating === 'object' && rating !== null && 'avg' in rating) {
      return parseFloat(rating.avg) || 0;
    }
    
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseFloat(rating) || 0;
    
    return 0;
  }, []);

  return { getSafeRating, formatRating, getRatingValueForSort };
};

// =================== IMAGE HELPERS ===================
const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}/${path.slice(1)}`;
  return `${API_BASE_URL}/${path}`;
};

// =================== COMPANY CARD ===================
const CompanyCard = memo(({ company, navigate }) => {
  const { getSafeRating, formatRating } = useRatingHelpers();
  const rating = getSafeRating(company.rating);

  const handleClick = useCallback(() => {
    navigate(`/company/${company.id}`);
  }, [company.id, navigate]);

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer bg-white rounded-xl border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden w-full max-w-[220px] mx-auto hover:scale-[1.03]"
      style={{ willChange: 'transform' }}
    >
      {/* Company Logo */}
      <div className="relative w-full h-[120px] overflow-hidden rounded-t-xl">
        {company.logo && typeof company.logo === 'object' ? (
          <picture>
            {company.logo.avif && (
              <source 
                srcSet={getFullImageUrl(company.logo.avif)} 
                type="image/avif" 
              />
            )}
            {company.logo.webp && (
              <source 
                srcSet={getFullImageUrl(company.logo.webp)} 
                type="image/webp" 
              />
            )}
            <img
              src={getFullImageUrl(company.logo.webp || company.logo.avif)}
              alt={company.name || 'Company'}
              className="object-cover w-[88%] h-[92%] m-auto rounded-xl transition-transform duration-300 group-hover:scale-105 mt-2"
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%] rounded-xl" />
        )}
      </div>
      
      {/* Company Info */}
      <div className="flex items-start justify-between p-3 pt-2 gap-2">
        <div className="flex flex-col min-w-0 flex-1">
          {company.name ? (
            <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2 mb-1 leading-tight break-words text-start rtl:text-right">
              {company.name}
            </h3>
          ) : (
            <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-3/4 mb-2" />
          )}
          
          {/* Rating */}
          <div className="flex items-center gap-1 rtl:flex-row-reverse">
            <StarIcon
              filled={rating > 0}
              className="w-3 h-3"
            />
            <span className="text-xs text-gray-600 font-medium">
              {formatRating(company.rating)}
            </span>
            <span className="text-[11px] text-gray-500">
              ({company.number_of_reviews || 0})
            </span>
          </div>
        </div>
        
        {/* Arrow Button */}
        <div className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full shadow-sm transition-all duration-300 mt-1">
          <ArrowOutward className="text-gray-700 text-sm" />
        </div>
      </div>
    </div>
  );
});
CompanyCard.displayName = 'CompanyCard';

// =================== PRODUCT CARD ===================
const ProductCard = memo(({ 
  product, 
  isFav, 
  toggleFavourite, 
  navigate,
  fw
}) => {
  const { getSafeRating, formatRating } = useRatingHelpers();
  const rating = getSafeRating(product.rating);
  
  const handleFavouriteClick = useCallback((e) => {
    e.stopPropagation();
    const productForFavourite = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      source: "category",
      company_name: product.company?.name || 'Company',
      company_id: product.company?.id || null,
      rating: product.rating,
      description: product.description
    };
    toggleFavourite(productForFavourite);
  }, [product, toggleFavourite]);

  const handleCardClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [product.id, navigate]);

  const ratingStars = useMemo(() => (
    Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        filled={i < Math.floor(rating)}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-white" : "text-gray-400"}`}
      />
    ))
  ), [rating]);

  const ratingBadge = useMemo(() => (
    rating > 0 && (
      <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
        {ratingStars}
        <span className="text-[10px] text-white ml-1 rtl:ml-0 rtl:mr-1">
          {formatRating(product.rating)}
        </span>
      </div>
    )
  ), [rating, product.rating, formatRating, ratingStars]);

  const favouriteButton = useMemo(() => (
    <button
      onClick={handleFavouriteClick}
      className={`
        absolute top-[clamp(6px,1.2vw,8px)] right-[clamp(6px,1.2vw,8px)]
        z-20
        flex items-center justify-center
        w-[clamp(28px,3vw,34px)]
        h-[clamp(28px,3vw,34px)]
        rounded-full
        backdrop-blur-md
        border
        shadow-md
        transition
        hover:scale-105 active:scale-90
        ${isFav
          ? "bg-red-100 text-red-600 border-red-200"
          : "bg-white text-gray-600 border-white hover:bg-red-50"}
      `}
    >
      <HeartIcon
        filled={isFav}
        className={`
          w-[clamp(11px,1.2vw,15px)]
          h-[clamp(11px,1.2vw,15px)]
          transition-colors
          ${isFav ? "text-red-500" : "hover:text-red-400"}
        `}
      />
    </button>
  ), [isFav, handleFavouriteClick]);

  return (
    <div
      onClick={handleCardClick}
      className="
        relative
        flex-none
        w-full
        max-w-[220px]
        rounded-3xl
        overflow-hidden
        group
        cursor-pointer
        bg-white
        border border-gray-200
        transition-transform duration-300
        hover:scale-[1.03]
        mx-auto
      "
      style={{ willChange: "transform" }}
    >
      {favouriteButton}

      {/* Product Image */}
      <div className="relative w-full h-[160px] xs:h-[180px] sm:h-[200px] overflow-hidden rounded-t-2xl">
        {product.image && typeof product.image === 'object' ? (
          <picture>
            {product.image.avif && (
              <source 
                srcSet={getFullImageUrl(product.image.avif)} 
                type="image/avif" 
              />
            )}
            {product.image.webp && (
              <source 
                srcSet={getFullImageUrl(product.image.webp)} 
                type="image/webp" 
              />
            )}
            <img
              src={getFullImageUrl(product.image.webp || product.image.avif)}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
        )}

        {ratingBadge}
      </div>

      {/* Product Info */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex-1">
          {product.name ? (
            <>
              <h3
                className="
                  font-semibold
                  text-gray-900
                  mb-1
                  truncate
                  text-[11px]
                  xs:text-[10px]
                  sm:text-[14px]
                  md:text-xs
                  rtl:text-right
                "
              >
                {product.name}
              </h3>

              <div className="flex items-center gap-1">
                <span
                  className="
                    font-bold
                    text-gray-900
                    text-[10px]
                    xs:text-[10px]
                    sm:text-[11px]
                    md:text-xs
                  "
                >
                  {fw?.qar || "QAR"} {parseFloat(product.price || 0).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="h-3.5 bg-gray-200 rounded-full w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2 animate-pulse" />
            </>
          )}
        </div>
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// =================== SKELETON LOADERS ===================
const CompanyCardSkeleton = memo(() => (
  <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden w-full max-w-[220px] mx-auto">
    <div className="w-full h-[120px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-t-xl animate-shimmer bg-[length:200%_100%]" />
    <div className="p-3 space-y-2.5">
      <div className="h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-[85%]"></div>
      <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-[60%]"></div>
    </div>
  </div>
));
CompanyCardSkeleton.displayName = 'CompanyCardSkeleton';

const ProductCardSkeleton = memo(() => (
  <div className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden bg-white border border-gray-100 mx-auto">
    <div className="w-full h-[200px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-[90%]"></div>
      <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-[70%]"></div>
    </div>
  </div>
));
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// =================== MAIN CATEGORY PAGE ===================
const CategoryPage = memo(() => {
  
  const loadMoreRef = useRef(null);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);
  
  const [category, setCategory] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [viewType, setViewType] = useState("companies");
  const [sortBy, setSortBy] = useState("relevance");
  
  // Pagination states - ONLY FOR PRODUCTS
  const [productPage, setProductPage] = useState(1);
  const [productLastPage, setProductLastPage] = useState(1);

  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};
  const isMobile = useIsMobile();

  const { getRatingValueForSort } = useRatingHelpers();

  // Debug logs to check values
  useEffect(() => {
    console.log("isMobile:", isMobile);
    console.log("viewType:", viewType);
    console.log("productPage:", productPage);
    console.log("productLastPage:", productLastPage);
    console.log("loading:", loading);
  }, [isMobile, viewType, productPage, productLastPage, loading]);

  // Reset to page 1 when switching between mobile/desktop or view type
  useEffect(() => {
    if (!isMobile) {
      setProductPage(1);
    }
  }, [viewType, isMobile]);

  // Memoize expensive calculations
  const isFavourite = useCallback((id) => 
    favourites.some((f) => f.id === id), 
    [favourites]
  );

  const handleToggleFavourite = useCallback(
    (product) => {
      const isAlreadyFav = favourites.some(
        (item) => item.id === product.id
      );

      dispatch(
        toggleFavourite({
          ...product,
          source: "category",
        })
      );

      if (auth.user && !isAlreadyFav) {
        dispatch(
          openListPopup({
            ...product,
            source: "category",
          })
        );
      }
    },
    [dispatch, favourites, auth.user]
  );

  // =================== FETCH DATA ===================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await getCategory(categoryId, productPage);
        
        const data = res?.data?.data;
        if (!data) return;

        // Set category & companies ONCE
        if (productPage === 1) {
          setCategory(data);
          setCompanies(data.companies || []);
        }

        setProductLastPage(data.products_pagination?.last_page || 1);

        setProducts(prev => {
          if (isMobile) {
            // Mobile = append pages
            return productPage === 1
              ? data.products
              : [...prev, ...data.products];
          }

          // Desktop = replace per page
          return data.products;
        });
      } catch (err) {
        logError("Category fetch failed", err);
        setPageError(fw.failed_to_load || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, productPage, isMobile, fw]);

  // Scroll to top for desktop pagination only
  useEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productPage, isMobile]);

  // =================== INFINITE SCROLL FOR MOBILE (FIXED VERSION) ===================
  useEffect(() => {
    // Only run on mobile, for products view, and if there are more pages
    if (!isMobile) {
      console.log("Infinite scroll: Not mobile");
      return;
    }
    
    if (viewType !== "products") {
      console.log("Infinite scroll: Not products view");
      return;
    }
    
    if (productPage >= productLastPage) {
      console.log("Infinite scroll: No more pages");
      return;
    }

    const el = loadMoreRef.current;
    if (!el) {
      console.log("Infinite scroll: Sentinel element not found");
      return;
    }

    console.log("Infinite scroll: Setting up observer for mobile products");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("Infinite scroll: Sentinel visible, loading next page...");
          if (!loading) {
            setProductPage(prev => prev + 1);
          }
        }
      },
      {
        root: null,
        rootMargin: "200px", // Load earlier for smoother experience
        threshold: 0.1,
      }
    );

    observer.observe(el);
    console.log("Infinite scroll: Observer attached to sentinel");

    return () => {
      console.log("Infinite scroll: Cleaning up observer");
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [isMobile, viewType, productPage, productLastPage, loading]);

  // =================== MEMOIZED SORTING ===================
  const sortedCompanies = useMemo(() => {
    if (!Array.isArray(companies) || companies.length === 0) return [];

    if (sortBy === "rating") {
      return [...companies].sort((a, b) => {
        const ratingA = getRatingValueForSort(a.rating);
        const ratingB = getRatingValueForSort(b.rating);
        return ratingB - ratingA;
      });
    }
    
    return companies;
  }, [companies, sortBy, getRatingValueForSort]);

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const productsCopy = [...products];
    
    switch (sortBy) {
      case "priceLow":
        return productsCopy.sort(
          (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)
        );
      case "priceHigh":
        return productsCopy.sort(
          (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)
        );
      case "rating":
        return productsCopy.sort((a, b) => {
          const ratingA = getRatingValueForSort(a.rating);
          const ratingB = getRatingValueForSort(b.rating);
          return ratingB - ratingA;
        });
      default:
        return productsCopy;
    }
  }, [products, sortBy, getRatingValueForSort]);

  // Memoize event handlers
  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleViewTypeChange = useCallback((type) => {
    setViewType(type);
    setProductPage(1); // Reset to first page when switching views
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  // =================== RENDER COMPANIES GRID ===================
  const renderCompaniesGrid = useMemo(() => (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {loading && companies.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <CompanyCardSkeleton key={`company-skel-${i}`} />
          ))
        ) : (
          sortedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              navigate={navigate}
            />
          ))
        )}
      </div>
    </>
  ), [loading, companies.length, sortedCompanies, navigate]);

  // =================== RENDER PRODUCTS GRID ===================
  const renderProductsGrid = useMemo(() => (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
        {loading && products.length === 0 && productPage === 1 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={`product-skel-${i}`} />
          ))
        ) : (
          sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFav={isFavourite(product.id)}
              toggleFavourite={handleToggleFavourite}
              navigate={navigate}
              fw={fw}
            />
          ))
        )}
      </div>

      {/* Mobile infinite scroll sentinel - Only when conditions are met */}
      {viewType === "products" && isMobile && productPage < productLastPage && (
        <div 
          ref={loadMoreRef} 
          className="h-20 flex justify-center items-center col-span-full"
        >
          {loading && (
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}
          {!loading && (
            <div className="text-sm text-gray-500">Loading more...</div>
          )}
        </div>
      )}
    </>
  ), [loading, products.length, productPage, sortedProducts, isFavourite, 
      handleToggleFavourite, navigate, fw, isMobile, productLastPage, viewType]);

  // =================== RENDER PAGINATION CONTROLS ===================
  const renderPaginationControls = useMemo(() => {
    // Only show pagination for products on desktop/tablet
    if (viewType !== "products") return null;
    if (isMobile) return null; // No pagination on mobile
    if (productLastPage <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-4 mt-12">
        <button
          disabled={productPage === 1}
          onClick={() => setProductPage(p => p - 1)}
          className="px-4 py-2 rounded-full border border-gray-300 
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-100 transition"
        >
          {fw.previous || "Previous"}
        </button>

        <span className="text-sm text-gray-600">
          {fw.page || "Page"} {productPage} {fw.of || "of"} {productLastPage}
        </span>

        <button
          disabled={productPage === productLastPage}
          onClick={() => setProductPage(p => p + 1)}
          className="px-4 py-2 rounded-full border border-gray-300 
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-100 transition"
        >
          {fw.next || "Next"}
        </button>
      </div>
    );
  }, [isMobile, productLastPage, productPage, fw, viewType]);

  // Error state
  if (pageError && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-red-500 text-lg mb-4">{pageError}</div>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {fw.back || fw.home || "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full py-10 sm:py-14 px-4 sm:px-8 md:px-12 relative overflow-hidden">
      
      {/* Loading indicator - top right spinner */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-24 sm:mt-14 md:mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div className="flex items-center gap-4 ml-0 sm:ml-4 md:ml-0">
            {category?.image && typeof category.image === 'object' ? (
              <picture>
                {category.image.avif && (
                  <source 
                    srcSet={getFullImageUrl(category.image.avif)} 
                    type="image/avif" 
                  />
                )}
                {category.image.webp && (
                  <source 
                    srcSet={getFullImageUrl(category.image.webp)} 
                    type="image/webp" 
                  />
                )}
                <img
                  src={getFullImageUrl(category.image.webp || category.image.avif)}
                  alt={category.title || 'Category'}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 shadow-md object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            ) : (
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%]" />
            )}
            {category?.title ? (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">
                {category.title}
              </h2>
            ) : (
              <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-48" />
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            {/* Toggle Button - Like NewArrivalProductPage style */}
            <div className="relative border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
              <div 
                className={`absolute top-0 bottom-0 w-1/2 rounded-full transition-all duration-300 ease-in-out ${
                  viewType === "companies" 
                    ? "left-0 rtl:left-1/2 bg-blue-500" 
                    : "left-1/2 rtl:left-0 bg-gray-900"
                }`}
              />
              <button
                onClick={() => handleViewTypeChange("companies")}
                disabled={loading}
                className={`relative px-6 py-2.5 text-sm font-medium transition z-10 ${
                  viewType === "companies" ? "text-white" : "text-gray-900"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {fw.companies || "Companies"}
              </button>
              <button
                onClick={() => handleViewTypeChange("products")}
                disabled={loading}
                className={`relative px-6 py-2.5 text-sm font-medium transition z-10 ${
                  viewType === "products" ? "text-white" : "text-gray-700"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {fw.products || "Products"}
              </button>
            </div>

            {/* Sort Dropdown - Like NewArrivalProductPage style */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              disabled={loading}
              className="bg-white/60 backdrop-blur-md border border-gray-200 text-sm sm:text-base md:text-base rounded-full px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-2 focus:outline-none text-gray-700"
            >
              <option value="relevance">
                {fw.store_by || "Sort by"} {fw.name || "Relevance"}
              </option>
              <option value="rating">{fw.rating || "Rating"}</option>
              <option value="priceLow">
                {fw.price || "Price"}: {fw.low_to_hight || "Low to High"}
              </option>
              <option value="priceHigh">
                {fw.price || "Price"}: {fw.hight_to_low || "High to Low"}
              </option>
            </select>
          </div>
        </div>

        {/* Product Count - Like NewArrivalProductPage style */}
        {viewType === "products" && (
          <p className="text-[15px] sm:text-base md:text-lg text-gray-600 mb-4">
            {loading 
              ? "Loading..." 
              : `${sortedProducts.length} ${fw.products_found || "products found"}`
            }
          </p>
        )}

        {/* Content Grid */}
        {viewType === "companies" ? renderCompaniesGrid : renderProductsGrid}
        
        {/* Desktop/Tablet Pagination - Only for products and non-mobile */}
        {viewType === "products" && renderPaginationControls}
        
        {/* Empty State */}
        {!loading && viewType === "companies" && sortedCompanies.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            {fw.no_companies || fw.companies || "No companies found"}
          </div>
        )}

        {!loading && viewType === "products" && sortedProducts.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            {fw.no_products || "No products found"}
          </div>
        )}
      </div>
    </section>
  );
});

CategoryPage.displayName = 'CategoryPage';
export default CategoryPage;