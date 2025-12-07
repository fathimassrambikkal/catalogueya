import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import CallToAction from "../components/CallToAction";
import { getArrivalsProducts } from "../api"; 

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// SVG Icons - Same as other components
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

function NewArrivalProductPageComponent() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Relevance");
  const { favourites, toggleFavourite } = useFavourites();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch products from backend using same API as arrivals component
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await getArrivalsProducts();
        
        let arr = [];
        const productsData = res?.data?.data?.products;
        
        if (Array.isArray(productsData)) {
          console.log("✅ API returned data.data.products array");
          
          // Transform the data to match your component's expected format
          arr = productsData.map(product => ({
            id: product.id,
            name: product.name,
            name_en: product.name,
            price: product.price,
            old_price: null,
            img: product.image,
            image: product.image,
            rating: parseFloat(product.rating) || 0,
            description: product.description,
            isNewArrival: true,
            // ✅ ENSURE COMPANY DATA IS INCLUDED
            company_id: product.company_id,
            company_name: product.company_name || "Company",
            category_id: product.category_id,
            category_name: product.category_name || "New Arrival"
          }));
        }

        if (arr.length > 0) {
          setProducts(arr);
          console.log("✅ New arrival products loaded:", arr.length);
        } else {
          setError("No new arrival products found");
          console.warn("⚠️ No new arrival products found in API response");
        }
      } catch (err) {
        console.error("❌ Error loading new arrival products:", err);
        setError("Failed to load new arrival products");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // ✅ Convert relative image path to absolute URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '/placeholder-image.jpg';
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE_URL}/${imgPath}`;
  };

  // ✅ Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return (a.price || 0) - (b.price || 0);
      case "Price: High to Low":
        return (b.price || 0) - (a.price || 0);
      case "Rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Loading skeleton
  const skeletonLoader = Array.from({ length: 8 }).map((_, index) => (
    <div
      key={`skeleton-${index}`}
      className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden bg-gray-200 animate-pulse transform-gpu"
    >
      <div className="w-full h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] bg-gray-300 rounded-t-3xl transform-gpu" />
      <div className="p-3 sm:p-4 bg-gray-200 rounded-b-3xl transform-gpu">
        <div className="h-3 bg-gray-300 rounded mb-2 w-3/4 transform-gpu"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 transform-gpu"></div>
      </div>
    </div>
  ));

  return (
    <>
      <section className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-28 left-5 sm:left-10 z-20 group transform-gpu"
        >
          <div className="relative p-3 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-md transition-all duration-300 hover:scale-110 transform-gpu">
            <ArrowLeftIcon className="text-gray-800 text-lg group-hover:text-gray-900 transition-colors transform-gpu" />
          </div>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-10 text-center transform-gpu">
          Products
        </h1>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm transform-gpu">
            {error}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600 transform-gpu">
          <p className="text-sm sm:text-base md:text-lg transform-gpu">
            {loading 
              ? "Loading..." 
              : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'Product' : 'Products'} Found`
            }
          </p>
          <div className="flex items-center gap-3 text-sm sm:text-base transform-gpu">
            <span className="font-medium text-gray-700 transform-gpu">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 focus:outline-none text-gray-700 transform-gpu"
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center transform-gpu">
            {skeletonLoader}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full transform-gpu">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2 transform-gpu">No New Arrivals Available</h3>
            <p className="text-gray-500 max-w-md transform-gpu">Check back later for new products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center transform-gpu">
            {sortedProducts.map((product) => {
              const isFav = favourites.some((item) => item.id === product.id);
              const imageUrl = getImageUrl(product.image || product.img);
              
              return (
                <div
                  key={product.id}
                  className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white/10 border border-white/30 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                             hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
                             transition-all duration-700 transform-gpu"
                  onClick={() => navigate(`/newarrivalprofile/${product.id}`)}
                >
                  {/* ❤️ Favourite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product);
                    }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition backdrop-blur-md border transform-gpu
                      ${
                        isFav
                          ? "bg-red-100 text-red-600 border-red-200"
                          : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                      }`}
                  >
                    <HeartIcon
                      filled={isFav}
                      className={`text-xs sm:text-sm md:text-base transform-gpu ${
                        isFav ? "text-red-500" : "hover:text-red-400"
                      }`}
                    />
                  </button>

                  {/* 🖼️ Product Image */}
                  <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-t-3xl transform-gpu">
                    <img
                      src={imageUrl}
                      alt={product.name_en || product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top rounded-t-3xl transition-transform duration-500 group-hover:scale-105 border-b border-white/20 transform-gpu"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />

                    {/* ⭐ Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg transform-gpu">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          filled={i < Math.floor(product.rating || 0)}
                          className={`w-3 h-3 transform-gpu ${i < Math.floor(product.rating || 0) ? "text-white" : ""}`}
                        />
                      ))}
                      <span className="text-[10px] text-white/90 ml-1 transform-gpu">
                        ({(product.rating || 0).toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* 💬 Info Section */}
                  <div className="relative w-full rounded-b-3xl p-3 sm:p-4 border-t border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-between transform-gpu">
                    <div className="flex flex-col w-[80%] z-10 transform-gpu">
                      <h3 className="font-semibold text-[11px] sm:text-sm truncate text-gray-900 mb-1 transform-gpu">
                        {product.name_en || product.name}
                      </h3>
                      <div className="flex items-center gap-1 transform-gpu">
                        <span className="text-[11px] sm:text-sm font-bold text-gray-900 transform-gpu">
                          QAR {product.price}
                        </span>
                        {product.old_price && (
                          <span className="text-xs line-through text-gray-500 transform-gpu">
                            QAR {product.old_price}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => e.stopPropagation()}
                      title="Chat"
                      className="
                        relative
                        px-2 py-1.5
                        rounded-[16px]
                    
                        /* Base glass layer */
                        bg-white/40
                        backdrop-blur-2xl
                        
                        /* Titanium  */
                        border border-[rgba(255,255,255,0.28)]
                    
                        /* VisionOS floating  */
                        shadow-[0_8px_24px_rgba(0,0,0,0.18)]
                    
                        /* Smooth hover */
                        hover:bg-white/55
                        transition-all duration-300
                        transform-gpu
                      "
                    >
                      {/* Chrome liquid highlight */}
                      <span className="
                        absolute inset-0 rounded-[16px]
                        bg-gradient-to-br from-white/70 via-white/10 to-transparent
                        opacity-40
                        pointer-events-none
                        transform-gpu
                      " />
                    
                      {/* Glass ribbon streak */}
                      <span className="
                        absolute inset-0 rounded-[16px]
                        bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
                        opacity-35
                        pointer-events-none
                        transform-gpu
                      " />
                    
                      {/* Titanium black bottom depth */}
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <CallToAction />
    </>
  );
}

export const NewArrivalProductPage = memo(NewArrivalProductPageComponent);
export default NewArrivalProductPage;