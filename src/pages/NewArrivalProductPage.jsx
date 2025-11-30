import React, { useState, useMemo, useEffect, Suspense, memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import CallToAction from "../components/CallToAction";
import { getArrivalsProducts } from "../api";

// Use the same base URL as your API
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// Pre-fetch data immediately when module loads
let preloadedData = {
  arrivalsProducts: null
};

// Start fetching immediately
(async () => {
  try {
    console.log("🔄 Starting pre-fetch of arrivals products...");
    const res = await getArrivalsProducts();
    
    let arr = [];
    const products = res?.data?.data?.products;
    if (Array.isArray(products)) {
      console.log("✅ API returned data.data.products array");
      arr = products;
      
      // Transform the data to match your component's expected format
      arr = arr.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: null,
        img: product.image,
        rating: parseFloat(product.rating) || 0,
        description: product.description
      }));
    }

    console.log("✅ Pre-fetch successful. Products found:", arr.length);
    preloadedData.arrivalsProducts = arr;
  } catch (err) {
    console.warn("❌ Pre-fetch failed:", err);
    preloadedData.arrivalsProducts = [];
  }
})();

// Preload images immediately with high priority
const preloadImages = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  console.log("🖼️ Preloading images for", products.length, "products");
  products.forEach((product) => {
    if (product?.img) {
      const img = new Image();
      // Convert relative path to absolute URL using the correct base URL
      const imageUrl = product.img.startsWith('http') ? product.img : `${API_BASE_URL}/${product.img}`;
      img.src = imageUrl;
      img.fetchPriority = 'high';
    }
  });
};

// Preload images if products are available
if (preloadedData.arrivalsProducts) {
  preloadImages(preloadedData.arrivalsProducts);
}

// Convert relative image path to absolute URL
const getImageUrl = (imgPath) => {
  if (!imgPath) return '/placeholder-image.jpg';
  if (imgPath.startsWith('http')) return imgPath;
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
  return `${API_BASE_URL}/${cleanPath}`;
};

// Lazy-loaded icons
const FaStar = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaStar }))
);
const FaHeart = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaHeart }))
);
const FaWhatsapp = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaWhatsapp }))
);
const FaArrowLeft = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaArrowLeft }))
);

function NewArrivalProductPageComponent() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Relevance");
  const [products, setProducts] = useState(() => preloadedData.arrivalsProducts || []);
  const [loading, setLoading] = useState(() => preloadedData.arrivalsProducts === null);
  const { favourites, toggleFavourite } = useFavourites();
  const whatsappNumber = "97400000000";

  // API fetch with preloaded data
  useEffect(() => {
    if (preloadedData.arrivalsProducts !== null) {
      setProducts(preloadedData.arrivalsProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await getArrivalsProducts();

        // Safe data extraction
        const raw = response?.data?.data?.products || response?.data?.data || response?.data || [];
        
        // Ensure array
        const backendProducts = Array.isArray(raw) ? raw : [];

        // In NewArrivalProductPage.jsx - Update the transformation
        arr = products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: null,
          img: product.image,
          rating: parseFloat(product.rating) || 0,
          description: product.description,
          // ✅ ADD COMPANY DATA
          company_id: product.company_id,
          company_name: product.company_name,
          category_id: product.category_id,
          category_name: product.category_name || "New Arrival"
        }));

        setProducts(transformedProducts);
        preloadedData.arrivalsProducts = transformedProducts;
        preloadImages(transformedProducts);
      } catch (error) {
        console.error("❌ API failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sorting logic (safe numbers)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const priceA = Number(a?.price) || 0;
      const priceB = Number(b?.price) || 0;
      const ratingA = Number(a?.rating) || 0;
      const ratingB = Number(b?.rating) || 0;

      switch (sortBy) {
        case "Price: Low to High":
          return priceA - priceB;
        case "Price: High to Low":
          return priceB - priceA;
        case "Rating":
          return ratingB - ratingA;
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  // Motion variants
  const container = useMemo(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: 0.15 } },
    }),
    []
  );

  const cardVariant = useMemo(
    () => ({
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    }),
    []
  );

  // Loading skeleton
  const skeletonLoader = useMemo(() => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden bg-gray-200 animate-pulse"
      >
        <div className="w-full h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] bg-gray-300 rounded-t-3xl" />
        <div className="p-3 sm:p-4 bg-gray-200 rounded-b-3xl">
          <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ));
  }, []);

  // Empty state
  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-20 text-center w-full">
      <div className="text-gray-400 text-6xl mb-4">📦</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No New Arrivals Available</h3>
      <p className="text-gray-500 max-w-md">Check back later for new products!</p>
    </div>
  ), []);

  return (
    <>
      <section className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-28 left-5 sm:left-10 z-20 group"
        >
          <div className="relative p-3 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-md transition-all duration-300 hover:scale-110">
            <Suspense fallback={<span className="text-sm">←</span>}>
              <FaArrowLeft className="text-gray-800 text-lg group-hover:text-gray-900 transition-colors" />
            </Suspense>
          </div>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-10 text-center">
          New Arrivals
        </h1>

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600">
          <p className="text-sm sm:text-base md:text-lg">
            {loading ? "Loading..." : `${sortedProducts.length} Products Found`}
          </p>

          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 focus:outline-none text-gray-700"
              disabled={loading}
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {loading ? skeletonLoader : sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
              const isFav =
                favourites?.some((item) => item?.id === product?.id) || false;

              return (
                <motion.div
                  key={product?.id}
                  variants={cardVariant}
                  className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white/10 border border-white/30 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                             hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
                             transition-all duration-700"
                  onClick={() => navigate(`/newarrivalprofile/${product?.id}`)}
                >
                  
                  {/* Favourite Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product);
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition backdrop-blur-md border 
                      ${
                        isFav
                          ? "bg-red-100 text-red-600 border-red-200"
                          : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                      }`}
                  >
                    <Suspense fallback={<span className="w-3 h-3 bg-gray-200 rounded-full" />}>
                      <FaHeart
                        className={`text-xs sm:text-sm md:text-base ${
                          isFav ? "text-red-500" : "hover:text-red-400"
                        }`}
                      />
                    </Suspense>
                  </motion.button>

                  {/* Product Image */}
                  <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden rounded-t-3xl">
                    <img
                      src={getImageUrl(product?.img)}
                      alt={product?.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top rounded-t-3xl transition-transform duration-500 group-hover:scale-105 border-b border-white/20"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />

                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                      <Suspense fallback={<span className="text-xs text-white/70">★</span>}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(Number(product?.rating) || 0)
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </Suspense>
                      <span className="text-[10px] text-white/90 ml-1">
                        ({(Number(product?.rating) || 0).toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div
                    className="relative w-full rounded-b-3xl p-3 sm:p-4 border-t border-white/20 
                               bg-white/10 backdrop-blur-xl 
                               before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:rounded-b-3xl before:pointer-events-none 
                               shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                               flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex flex-col w-[80%] z-10">
                      <h3 className="font-semibold text-[11px] xs:text-xs sm:text-sm truncate text-gray-900 mb-1">
                        {product?.name}
                      </h3>

                      <div className="flex items-center gap-1">
                        <span className="text-[11px] xs:text-[12px] sm:text-sm font-bold text-gray-900">
                          QAR {product?.price}
                        </span>

                        {product?.oldPrice && (
                          <span className="text-[9px] xs:text-[10px] sm:text-xs line-through text-gray-500">
                            QAR {product?.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <Suspense fallback={<span className="w-4 h-4 bg-green-200 rounded-full" />}>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                          product?.name || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-green-500/80 rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
                      </a>
                    </Suspense>
                  </div>
                </motion.div>
              );
            })
          ) : (
            emptyState
          )}
        </motion.div>
      </section>

      <CallToAction />
    </>
  );
}

export const NewArrivalProductPage = memo(NewArrivalProductPageComponent);
export default NewArrivalProductPage;