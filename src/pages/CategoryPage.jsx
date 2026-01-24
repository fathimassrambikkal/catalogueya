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
import BackButton from "../components/BackButton";
import {
  HeartIcon,
  StarIcon,
   ArrowOutward
} from "../components/SvgIcon";
import SmartImage from "../components/SmartImage";

import { getCategory} from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// =================== IMAGE UTILITY FUNCTIONS ===================
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
    // Clean the path - remove leading slash if present
    const cleanPath = imgData.startsWith('/') ? imgData.slice(1) : imgData;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  return null;
};

// =================== OPTIMIZED IMAGE COMPONENT (UPDATED) ===================
const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  onError,
  onClick 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

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
          className={`${className} transition-opacity duration-300`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            if (onError) onError();
          }}
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

  useEffect(() => {
    if (!formattedSrc || !imgRef.current) return;
    
    const img = imgRef.current;

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => {
      setHasError(true);
      if (onError) onError();
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [formattedSrc, onError]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
      )}
      {formattedSrc && (
       <img
  ref={imgRef}
  src={formattedSrc}
  alt={alt}
  className={`${className}`}
  loading={priority ? "eager" : "lazy"}
  decoding="async"
/>

      )}
    </div>
  );
});
OptimizedImage.displayName = 'OptimizedImage';

// =================== RATING HELPERS (MEMOIZED) ===================
const useRatingHelpers = () => {
  const getSafeRating = useCallback((rating) => {
    if (typeof rating === 'number') return Math.min(5, Math.max(0, rating));
    if (typeof rating === 'string') return Math.min(5, Math.max(0, parseFloat(rating) || 0));
    return 0;
  }, []);

  const formatRating = useCallback((rating) => {
    return getSafeRating(rating).toFixed(1);
  }, [getSafeRating]);

  return { getSafeRating, formatRating };
};

// =================== COMPANY CARD (OPTIMIZED) ===================
const CompanyCard = memo(({ company, navigate }) => {
  const { getSafeRating, formatRating } = useRatingHelpers();
  const rating = getSafeRating(company.rating);

  const handleClick = useCallback(() => {
    navigate(`/company/${company.id}`);
  }, [company.id, navigate]);

  // Get image URL - properly handle both formats
  const getImageUrl = useCallback((imgData) => {
    return formatImageUrl(imgData);
  }, []);

  // Memoize expensive calculations
  const companyData = useMemo(() => ({
    name: company.name || company.title || 'Company',
    logo: getImageUrl(company.logo || company.image),
    rating: formatRating(rating)
  }), [company.name, company.title, company.logo, company.image, formatRating, rating, getImageUrl]);

  const ratingDisplay = useMemo(() => (
    <div className="flex items-center gap-1 rtl:flex-row-reverse">
      <StarIcon
        filled={rating > 0}
        className="w-3 h-3"
      />
      <span className="text-xs text-gray-600 font-medium">
        {companyData.rating}
      </span>
    </div>
  ), [companyData.rating, rating]);

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer bg-white rounded-xl border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden w-full max-w-[220px] mx-auto hover:scale-[1.03]"
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-full h-[120px] overflow-hidden rounded-t-xl">
        {companyData.logo ? (
          <OptimizedImage
            src={companyData.logo}
            alt={companyData.name}
            className="object-cover w-[88%] h-[92%] m-auto rounded-xl transition-transform duration-300 group-hover:scale-105 mt-2"
            priority={false}
            onError={() => {}}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%] rounded-xl" />
        )}
      </div>
      
      <div className="flex items-start justify-between p-3 pt-2 gap-2">
        <div className="flex flex-col min-w-0 flex-1">
          {companyData.name ? (
            <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2 mb-1 leading-tight break-words text-start rtl:text-right">
              {companyData.name}
            </h3>
          ) : (
            <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-3/4 mb-2" />
          )}
          {ratingDisplay}
        </div>
        <div className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full shadow-sm transition-all duration-300 mt-1">
          <ArrowOutward className="text-gray-700 text-sm" />
        </div>
      </div>
    </div>
  );
});
CompanyCard.displayName = 'CompanyCard';

// =================== PRODUCT CARD (OPTIMIZED) ===================
const ProductCard = memo(({ 
  product, 
  isFav, 
  toggleFavourite, 
  navigate,
  fw
}) => {
  const { getSafeRating, formatRating } = useRatingHelpers();
  
  // Get image URL - handle both formats
  const getImageUrl = useCallback((imgData) => {
    return formatImageUrl(imgData);
  }, []);
  
  // Memoize all derived data
  const productData = useMemo(() => {
    const imageUrl = getImageUrl(product.image || product.thumbnail);
    const priceNumber = product.price ? parseFloat(product.price) : 0;
    
    return {
      id: product.id,
      name: product.name || product.title || 'Product',
      price: priceNumber,
      image: imageUrl,
      img: imageUrl,
      rating: getSafeRating(product.rating),
      description: product.description || '',
      company_name: product.company_name || 'Company',
      company_id: product.company_id || null,
      isOnSale: product.isOnSale || false,
      isNewArrival: product.isNewArrival || false,
      category_name: product.category_name || '',
      formattedPrice: product.price 
        ? `${fw?.qar || "QAR"} ${priceNumber.toLocaleString()}`
        : fw?.price_not_available || "Price not available",
      formattedRating: formatRating(product.rating),
      ...product
    };
  }, [product, getSafeRating, formatRating, getImageUrl, fw]);

  const handleFavouriteClick = useCallback((e) => {
    e.stopPropagation();
    const productForFavourite = {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      source: "category",
      img: productData.img,
      company_name: productData.company_name,
      company_id: productData.company_id,
      isOnSale: productData.isOnSale,
      isNewArrival: productData.isNewArrival,
      category_name: productData.category_name,
      rating: productData.rating,
      description: productData.description
    };
    toggleFavourite(productForFavourite);
  }, [productData, toggleFavourite]);

  const handleCardClick = useCallback(() => {
    navigate(`/product/${productData.id}`);
  }, [productData.id, navigate]);

  const ratingStars = useMemo(() => (
    Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        filled={i < Math.floor(productData.rating)}
        className={`w-3 h-3 ${i < Math.floor(productData.rating) ? "text-white" : "text-gray-400"}`}
      />
    ))
  ), [productData.rating]);

  const ratingBadge = useMemo(() => (
    productData.rating > 0 && (
      <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
        {ratingStars}
        <span className="text-[10px] text-white ml-1 rtl:ml-0 rtl:mr-1">
          {productData.formattedRating}
        </span>
      </div>
    )
  ), [productData.rating, productData.formattedRating, ratingStars]);

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
        {productData.image ? (
          <OptimizedImage
            src={productData.image}
            alt={productData.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
            onError={() => {}}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
        )}

        {ratingBadge}
      </div>

      {/* Product Info */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex-1">
          {productData.name ? (
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
                {productData.name}
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
                  {productData.formattedPrice}
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

// =================== MAIN CATEGORY PAGE (OPTIMIZED) ===================
const CategoryPage = memo(() => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const auth = useSelector((state) => state.auth);
  const [category, setCategory] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("companies");
  const [sortBy, setSortBy] = useState("relevance");
  
  // ✅ SIMPLIFIED: Single pagination state for products
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

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

      // ✅ 1. IMMEDIATE UI UPDATE (guest + logged-in)
      dispatch(
        toggleFavourite({
          ...product,
          source: "category",
        })
      );

      // ✅ 2. LOGGED-IN → open popup for backend sync
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

  // =================== INITIAL FETCH ===================
  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const catRes = await getCategory(categoryId, {
          params: {
            page: productPage,
            per_page: 20 // Request 20 products per page
          }
        });

        if (!mounted || abortController.signal.aborted) return;

        const categoryData = catRes?.data?.data || null;
        const companiesData = categoryData?.companies || [];

        if (!categoryData) {
          setError("Category not found.");
          return;
        }

        // ✅ FLATTEN all products from all companies
        const allProducts = [];
        
        companiesData.forEach((company) => {
          if (Array.isArray(company.products)) {
            company.products.forEach((product) => {
              allProducts.push({
                ...product,
                company_id: company.id,
                company_name: company.name,
                company_logo: company.logo,
              });
            });
          }
        });

        if (mounted) {
          setCategory(categoryData);
          setCompanies(companiesData);
          setProducts(allProducts);
          
          // ✅ Set pagination state based on response
          // Assuming API returns total pages or has_more flag
          const totalPages = categoryData?.products_pagination?.last_page || 1;
          const currentPage = categoryData?.products_pagination?.page || 1;
          const hasMore = currentPage < totalPages;
          
          setProductPage(currentPage);
          setHasMoreProducts(hasMore);
        }
      } catch (e) {
        if (!mounted || abortController.signal.aborted) return;
        console.error("Failed to fetch category data:", e);
        setError("Failed to load category.");
      } finally {
        if (mounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [categoryId]); // Remove productPage dependency to avoid double fetch

  // =================== LOAD MORE PRODUCTS ===================
  const loadMoreProducts = useCallback(async () => {
    if (loadingMoreProducts || !hasMoreProducts) return;
    
    setLoadingMoreProducts(true);
    const nextPage = productPage + 1;

    try {
      const res = await getCategory(categoryId, {
        params: {
          page: nextPage,
          per_page: 20
        }
      });

      const categoryData = res?.data?.data;
      const companiesData = categoryData?.companies || [];
      
      // Flatten new products
      const newProducts = [];
      companiesData.forEach((company) => {
        if (Array.isArray(company.products)) {
          company.products.forEach((product) => {
            newProducts.push({
              ...product,
              company_id: company.id,
              company_name: company.name,
              company_logo: company.logo,
            });
          });
        }
      });

      // Append new products to existing ones
      setProducts(prev => [...prev, ...newProducts]);
      setCompanies(prev => [...prev, ...companiesData]);
      
      // Update pagination state
      const totalPages = categoryData?.products_pagination?.last_page || 1;
      const hasMore = nextPage < totalPages;
      
      setProductPage(nextPage);
      setHasMoreProducts(hasMore);
      
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMoreProducts(false);
    }
  }, [categoryId, productPage, hasMoreProducts, loadingMoreProducts]);

  // =================== MEMOIZED SORTING ===================
  const sortedCompanies = useMemo(() => {
    if (!Array.isArray(companies) || companies.length === 0) return [];

    if (sortBy === "rating") {
      return [...companies].sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA;
      });
    }
    
    return companies;
  }, [companies, sortBy]);

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
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  // Memoize event handlers
  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleViewTypeChange = useCallback((type) => {
    setViewType(type);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  // Get category header image - SPECIAL HANDLING for category image
  const getCategoryHeaderImage = useCallback((imgData) => {
    if (!imgData) return null;
    
    // If it's the new format (object with webp/avif)
    if (typeof imgData === 'object' && imgData.webp) {
      // For category header, we need a string URL, so use webp as fallback
      const webpPath = imgData.webp;
      if (webpPath.startsWith("http")) return webpPath;
      return `${API_BASE_URL}/${webpPath.replace(/^\//, '')}`;
    }
    
    // If it's a string
    if (typeof imgData === 'string') {
      if (imgData.startsWith("http")) return imgData;
      return `${API_BASE_URL}/${imgData.replace(/^\//, '')}`;
    }
    
    return null;
  }, []);

  // Memoize category data
  const categoryData = useMemo(() => {
    const imageUrl = getCategoryHeaderImage(category?.image);
    
    return {
      name: category?.title || category?.name || "Category",
      image: imageUrl
    };
  }, [category, getCategoryHeaderImage]);

  // =================== RENDER PRODUCTS IN SINGLE GRID ===================
  const renderProductsGrid = useMemo(() => {
    if (!sortedProducts.length) return null;

    return (
      <>
        {/* Products Grid - ALL products together */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          {sortedProducts.map((product) => {
            const enhancedProduct = {
              ...product,
              company_name: product.company_name || 'Company',
              company_id: product.company_id || null,
              isOnSale: product.isOnSale || false,
              isNewArrival: product.isNewArrival || false,
              category_name: category?.title || ''
            };
            
            return (
              <ProductCard
                key={`${product.id}-${product.company_id}`}
                product={enhancedProduct}
                isFav={isFavourite(product.id)}
                toggleFavourite={handleToggleFavourite}
                navigate={navigate}
                fw={fw}
              />
            );
          })}
          
          {/* Skeleton loaders when loading more */}
          {loadingMoreProducts && Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`loading-more-${i}`} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreProducts && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreProducts}
              disabled={loadingMoreProducts}
              className={`px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                loadingMoreProducts
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              {loadingMoreProducts ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {fw.loading || "Loading..."}
                </span>
              ) : (
                `${fw.load_more || "Load more products"}`
              )}
            </button>
          </div>
        )}
      </>
    );
  }, [sortedProducts, loadingMoreProducts, hasMoreProducts, isFavourite, handleToggleFavourite, navigate, fw, category, loadMoreProducts]);

  // Memoize grid content
  const companiesGrid = useMemo(() => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {loading ? (
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
  ), [loading, sortedCompanies, navigate]);

  // Error state
  if (error && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-red-500 text-lg mb-4">{error || "Category not found"}</div>
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
      <BackButton variant="absolute" className="top-16"/>
      
      {/* Loading indicator */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border-2 border-gray-300/50 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-gray-600 border-r-gray-600 rounded-full animate-spin" />
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-24 sm:mt-14 md:mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div className="flex items-center gap-4 ml-0 sm:ml-4 md:ml-0">
            {categoryData.image ? (
              <img
                src={categoryData.image}
                alt={categoryData.name}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 shadow-md object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%]" />
            )}
            {categoryData.name ? (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">
                {categoryData.name || fw.category}
              </h2>
            ) : (
              <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-shimmer bg-[length:200%_100%] w-48" />
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            {/* Toggle Button */}
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

            <select
              value={sortBy}
              onChange={handleSortChange}
              disabled={loading}
              className={`border border-gray-300 rounded-full px-3 py-2 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-400 text-start rtl:text-right rtl:pl-8 rtl:pr-3 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="relevance">
                {fw.store_by || "Sort by"} {fw.name || "Relevance"}
              </option>
              <option value="rating">{fw.rating}</option>
              <option value="priceLow">
                {fw.price}: {fw.low_to_hight}
              </option>
              <option value="priceHigh">
                {fw.price}: {fw.hight_to_low}
              </option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {viewType === "companies" ? companiesGrid : renderProductsGrid}
        
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