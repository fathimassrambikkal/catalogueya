import React, { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  memo,
  useRef
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { getCategory, getCompanies, getProducts } from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// =================== SVG ICONS ===================
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
    width="14" 
    height="14" 
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
    width="12" 
    height="12" 
    viewBox="0 0 576 512"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "currentColor" : "#9CA3AF"}
    strokeWidth="30"
  >
    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
  </svg>
);

const ArrowOutwardIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="16" 
    height="16" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const ChatIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="17" 
    height="17" 
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
    <circle cx="4" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="12" cy="8" r="1" />
  </svg>
);

// =================== IMAGE UTILITY FUNCTIONS ===================
const formatImageUrl = (imgPath) => {
  if (!imgPath) return "/api/placeholder/300/200";
  if (imgPath.startsWith("http")) return imgPath;
  
  // Clean the path - remove leading slash if present
  const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
  return `${API_BASE_URL}/${cleanPath}`;
};

// =================== OPTIMIZED IMAGE COMPONENT ===================
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

  // Format the image URL properly
  const formattedSrc = useMemo(() => {
    return formatImageUrl(src);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !formattedSrc) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
      if (onError) {
        const syntheticEvent = { target: { src: "/api/placeholder/400/400" } };
        onError(syntheticEvent);
      }
    };

    img.src = formattedSrc;
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [formattedSrc, onError]);

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  return (
    <div className="relative w-full h-full overflow-hidden transform-gpu">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse transform-gpu" />
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 transform-gpu`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onClick={handleClick}
        style={{ willChange: 'transform, opacity' }}
        fetchPriority={priority ? "high" : "auto"}
      />
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

  // Get image URL - defined inside component
  const getImageUrl = useCallback((imgPath) => {
    return formatImageUrl(imgPath);
  }, []);

  // Memoize expensive calculations
  const companyData = useMemo(() => ({
    name: company.name || company.title || 'Company',
    logo: getImageUrl(company.logo || company.image),
    rating: formatRating(rating)
  }), [company.name, company.title, company.logo, company.image, formatRating, rating, getImageUrl]);

  const ratingDisplay = useMemo(() => (
    <div className="flex items-center gap-1 rtl:flex-row-reverse transform-gpu">
      <StarIcon
        filled={rating > 0}
        className="w-3 h-3 transform-gpu"
      />
      <span className="text-xs text-gray-600 font-medium transform-gpu">
        {companyData.rating}
      </span>
    </div>
  ), [companyData.rating, rating]);

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer bg-white rounded-xl border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden w-full max-w-[220px] mx-auto transform-gpu hover:scale-[1.03]"
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-full h-[120px] overflow-hidden rounded-t-xl transform-gpu">
        <OptimizedImage
          src={companyData.logo}
          alt={companyData.name}
          className="object-cover w-[88%] h-[92%] m-auto rounded-xl transition-transform duration-300 group-hover:scale-105 mt-2 transform-gpu"
          priority={false}
          onError={() => {}}
        />
      </div>
      
      <div className="flex items-start justify-between p-3 pt-2 gap-2 transform-gpu">
        <div className="flex flex-col min-w-0 flex-1 transform-gpu">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2 mb-1 leading-tight break-words text-start rtl:text-right transform-gpu">
            {companyData.name}
          </h3>
          {ratingDisplay}
        </div>
        <div className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full shadow-sm transition-all duration-300 mt-1 transform-gpu">
          <ArrowOutwardIcon className="text-gray-700 text-sm transform-gpu" />
        </div>
      </div>
    </div>
  );
});
CompanyCard.displayName = 'CompanyCard';

// =================== PRODUCT CARD (OPTIMIZED WITH CHAT ICON) ===================
const ProductCard = memo(({ 
  product, 
  isFav, 
  toggleFavourite, 
  navigate 
}) => {
  const { getSafeRating, formatRating } = useRatingHelpers();
  
  // Get image URL - defined inside component
  const getImageUrl = useCallback((imgPath) => {
    return formatImageUrl(imgPath);
  }, []);
  
  // Memoize all derived data - ENHANCED with proper structure for favourites
  const productData = useMemo(() => {
    const imageUrl = getImageUrl(product.image || product.thumbnail);
    const priceNumber = product.price ? parseFloat(product.price) : 0;
    
    return {
      id: product.id,
      name: product.name || product.title || 'Product',
      price: priceNumber, // Store as number, not string
      image: imageUrl,
      img: imageUrl, // Add img field for compatibility
      rating: getSafeRating(product.rating),
      description: product.description || '',
      company_name: product.company_name || 'Company',
      company_id: product.company_id || null,
      isOnSale: product.isOnSale || false,
      isNewArrival: product.isNewArrival || false,
      category_name: product.category_name || '',
      formattedPrice: product.price 
        ? `QAR ${priceNumber.toLocaleString()}`
        : 'Price not available',
      formattedRating: formatRating(product.rating),
      // Include the original product data for navigation
      ...product
    };
  }, [product, getSafeRating, formatRating, getImageUrl]);

  // FIXED: Pass the full productData object
  const handleFavouriteClick = useCallback((e) => {
    e.stopPropagation();
    // Create a product object with all required fields for FavouriteContext
    const productForFavourite = {
      id: productData.id,
      name: productData.name,
      price: productData.price, // This is a number
      image: productData.image,
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

  const handleChatClick = useCallback((e) => {
    e.stopPropagation();
    // Chat functionality - you can add your chat logic here
    console.log("Open chat for product:", productData.id);
    // Example: navigate to chat or open chat modal
  }, [productData.id]);

  const handleCardClick = useCallback(() => {
    navigate(`/product/${productData.id}`);
  }, [productData.id, navigate]);

  // Memoize rating stars
  const ratingStars = useMemo(() => (
    Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        filled={i < Math.floor(productData.rating)}
        className={`w-3 h-3 transform-gpu ${i < Math.floor(productData.rating) ? "text-white" : "text-gray-400"}`}
      />
    ))
  ), [productData.rating]);

  const ratingBadge = useMemo(() => (
    productData.rating > 0 && (
      <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg transform-gpu">
        {ratingStars}
        <span className="text-[10px] text-white ml-1 rtl:ml-0 rtl:mr-1 transform-gpu">
          {productData.formattedRating}
        </span>
      </div>
    )
  ), [productData.rating, productData.formattedRating, ratingStars]);

  const favouriteButton = useMemo(() => (
    <button
      onClick={handleFavouriteClick}
      className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition backdrop-blur-md border transform-gpu active:scale-90 ${
        isFav
          ? "bg-red-100 text-red-600 border-red-200"
          : "bg-white text-gray-600 border-white hover:bg-red-50"
      }`}
    >
      <HeartIcon
        filled={isFav}
        className={`text-sm transform-gpu ${isFav ? "text-red-500" : "hover:text-red-400"}`}
      />
    </button>
  ), [isFav, handleFavouriteClick]);

  const chatButton = useMemo(() => (
    <button
      onClick={handleChatClick}
      className="
        relative
        px-2 py-1.5
        rounded-[16px]
        bg-white/40
        backdrop-blur-2xl
        border border-[rgba(255,255,255,0.28)]
        shadow-[0_8px_24px_rgba(0,0,0,0.18)]
        hover:bg-white/55
        transition-all duration-300
        flex-shrink-0
        transform-gpu
      "
    >
      <span className="
        absolute inset-0 rounded-[16px]
        bg-gradient-to-br from-white/70 via-white/10 to-transparent
        opacity-40
        pointer-events-none
        transform-gpu
      " />
      <span className="
        absolute inset-0 rounded-[16px]
        bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
        opacity-35
        pointer-events-none
        transform-gpu
      " />
      <span className="
        absolute inset-0 rounded-[16px]
        bg-gradient-to-t from-black/20 to-transparent
        opacity-20
        pointer-events-none
        transform-gpu
      " />
      <ChatIcon
        className="
          text-[rgba(18,18,18,0.88)]
          drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]
          relative z-10
          transform-gpu
        "
      />
    </button>
  ), [handleChatClick]);

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer bg-white border border-gray-100 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] transition-all duration-300 mx-auto transform-gpu hover:scale-[1.04]"
      style={{ willChange: 'transform' }}
    >
      {favouriteButton}

      {/* Product Image */}
      <div className="relative w-full h-[200px] overflow-hidden transform-gpu">
        <OptimizedImage
          src={productData.image}
          alt={productData.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 transform-gpu"
          priority={false}
          onError={() => {}}
        />
        {ratingBadge}
      </div>

      {/* Product Info */}
      <div className="p-4 flex items-center justify-between transform-gpu">
        <div className="flex-1 transform-gpu">
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1 break-words text-start rtl:text-right transform-gpu">
            {productData.name}
          </h3>
          <div className="flex items-center gap-1 transform-gpu">
            <span className="text-sm font-bold text-gray-900 transform-gpu">
              {productData.formattedPrice}
            </span>
          </div>
          {productData.description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-1 break-words text-start rtl:text-right transform-gpu">
              {productData.description}
            </p>
          )}
        </div>

        {/* CHAT BUTTON */}
        {chatButton}
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// =================== SKELETON LOADERS ===================
const CompanyCardSkeleton = memo(() => (
  <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden w-full max-w-[220px] mx-auto animate-pulse transform-gpu">
    <div className="w-full h-[120px] bg-gray-200 rounded-t-xl transform-gpu" />
    <div className="p-3 transform-gpu">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 transform-gpu"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 transform-gpu"></div>
    </div>
  </div>
));
CompanyCardSkeleton.displayName = 'CompanyCardSkeleton';

const ProductCardSkeleton = memo(() => (
  <div className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden bg-white border border-gray-100 mx-auto animate-pulse transform-gpu">
    <div className="w-full h-[200px] bg-gray-200 transform-gpu" />
    <div className="p-4 transform-gpu">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 transform-gpu"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 transform-gpu"></div>
    </div>
  </div>
));
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// =================== MAIN CATEGORY PAGE (OPTIMIZED) ===================
const CategoryPage = memo(() => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  
  const [category, setCategory] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("companies");
  const [sortBy, setSortBy] = useState("relevance");
  
  // Memoize expensive calculations
  const isFavourite = useCallback((id) => 
    favourites.some((f) => f.id === id), 
    [favourites]
  );

  // FIXED: Update to accept product object
  const handleToggleFavourite = useCallback((product) => {
    toggleFavourite(product);
  }, [toggleFavourite]);

  // =================== FETCH DATA (OPTIMIZED) - UPDATED ===================
  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        // Only fetch category data - it contains companies and their products
        const catRes = await getCategory(categoryId);

        if (!mounted || abortController.signal.aborted) return;

        // CORRECTED: Extract data based on your actual API response structure
        // Your API response: {data: {id, title, image, companies}, message}
        const categoryData = catRes?.data?.data || null;
        
        // Extract companies from the category response
        const companiesData = categoryData?.companies || [];
        
        // Extract and flatten products from all companies
        const allProducts = [];
        companiesData.forEach(company => {
          if (company.products && Array.isArray(company.products)) {
            // Add company info to each product
            company.products.forEach(product => {
              allProducts.push({
                ...product,
                company_id: company.id,
                company_name: company.name,
                company_logo: company.logo
              });
            });
          }
        });

        if (!categoryData) {
          setError("Category not found.");
        } else {
          setCategory(categoryData);
          setCompanies(companiesData);
          setProducts(allProducts);
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
  }, [categoryId]);

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

  // Get image URL function for category
  const getCategoryImageUrl = useCallback((imgPath) => {
    return formatImageUrl(imgPath);
  }, []);

  // Memoize category data - UPDATED: Use title from API
  const categoryData = useMemo(() => ({
    name: category?.title || category?.name || "Category",
    image: getCategoryImageUrl(category?.image)
  }), [category, getCategoryImageUrl]);

  // Memoize grid content
  const companiesGrid = useMemo(() => (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center transform-gpu"
    >
      {sortedCompanies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          navigate={navigate}
        />
      ))}
    </div>
  ), [sortedCompanies, navigate]);

  const productsGrid = useMemo(() => (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 justify-items-center transform-gpu"
    >
      {sortedProducts.map((product) => {
        // Ensure product has all required fields
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
          />
        );
      })}
    </div>
  ), [sortedProducts, isFavourite, handleToggleFavourite, navigate, category]);

  // Memoize skeleton loaders
  const skeletonLoaders = useMemo(() => (
    viewType === "companies" ? (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center transform-gpu">
        {Array.from({ length: 8 }).map((_, i) => (
          <CompanyCardSkeleton key={`company-skel-${i}`} />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 justify-items-center transform-gpu">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={`product-skel-${i}`} />
        ))}
      </div>
    )
  ), [viewType]);

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen w-full py-10 sm:py-14 px-4 sm:px-8 md:px-12 relative overflow-hidden bg-white transform-gpu">
        <div className="absolute top-20 sm:top-8 left-6 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-gray-200 rounded-full animate-pulse w-10 h-10 transform-gpu" />
        <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-20 transform-gpu">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10 transform-gpu">
            <div className="flex items-center gap-4 ml-10 md:ml-0 transform-gpu">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 transform-gpu" />
              <div className="h-8 bg-gray-200 rounded w-48 transform-gpu" />
            </div>
          </div>
          {skeletonLoaders}
        </div>
      </section>
    );
  }

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center transform-gpu">
        <div className="text-center py-20 transform-gpu">
          <div className="text-red-500 text-lg mb-4 transform-gpu">{error || "Category not found"}</div>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition transform-gpu"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen w-full py-10 sm:py-14 px-4 sm:px-8 md:px-12 relative overflow-hidden transform-gpu"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(rgba(59,130,246,0.08) 1.2px, transparent 0)",
        backgroundSize: "18px 18px",
      }}
    >
     <button
    onClick={handleBackClick}
    className="
      fixed
      top-16 sm:top-6 md:top-24
      left-4 sm:left-6 md:left-10
      z-[9999]
      p-2
      bg-white/80
      backdrop-blur-md
      rounded-full
      border
      shadow-lg
      hover:bg-white
      transition
    "
  >
    <ArrowLeftIcon className="text-gray-700 text-lg" />
  </button>


      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-20 transform-gpu">
        {/* Header */}
     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div className="flex items-center gap-4 ml-10 md:ml-0">
            {category.image && (
              <img
                src={category.image}
                alt={category.title}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 shadow-md object-cover"
                loading="lazy"
              />
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">
               {categoryData.name}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 transform-gpu">
            {/* Toggle Button */}
            <div className="relative border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm transform-gpu">
              <div 
                className={`absolute top-0 bottom-0 w-1/2 rounded-full transition-all duration-300 ease-in-out transform-gpu ${
                  viewType === "companies" 
                    ? "left-0 rtl:left-1/2 bg-blue-500" 
                    : "left-1/2 rtl:left-0 bg-gray-900"
                }`}
              />
              <button
                onClick={() => handleViewTypeChange("companies")}
                className={`relative px-6 py-2.5 text-sm font-medium transition z-10 transform-gpu ${
                  viewType === "companies" ? "text-white" : "text-gray-900"
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => handleViewTypeChange("products")}
                className={`relative px-6 py-2.5 text-sm font-medium transition z-10 transform-gpu ${
                  viewType === "products" ? "text-white" : "text-gray-700"
                }`}
              >
                Products
              </button>
            </div>

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-full px-3 py-2 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-400 text-start rtl:text-right rtl:pl-8 rtl:pr-3 transform-gpu"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="rating">Top Rated</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {viewType === "companies" ? companiesGrid : productsGrid}
        
        {/* Empty State */}
        {viewType === "companies" && sortedCompanies.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 transform-gpu">
            No companies found
          </div>
        )}
        
        {viewType === "products" && sortedProducts.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 transform-gpu">
            No products found
          </div>
        )}
      </div>
    </section>
  );
});

CategoryPage.displayName = 'CategoryPage';
export default CategoryPage;