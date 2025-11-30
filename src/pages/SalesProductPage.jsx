import React, { useState, useEffect, Suspense, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import CallToAction from "../components/CallToAction";
import { getSalesProducts } from "../api"; 

// ✅ Lazy-loaded icons
const FaStar = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaStar }))
);
const FaHeart = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaHeart }))
);
const FaWhatsapp = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaWhatsapp }))
);
const FaArrowLeft = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaArrowLeft }))
);

// Use the same base URL as your API
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

function SalesProductPageComponent() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Relevance");
  const { favourites, toggleFavourite } = useFavourites();
  const whatsappNumber = "97400000000";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch products from backend using same API as sales component
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await getSalesProducts();
        
        let arr = [];
        const productsData = res?.data?.data?.products;
        
        if (Array.isArray(productsData)) {
          console.log("✅ API returned data.data.products array");
          
          // Transform the data to match your component's expected format
          
      // In the data transformation part, update to this:
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
          isOnSale: true,
          discount_price: null,
          // ✅ ENSURE COMPANY DATA IS INCLUDED
          company_id: product.company_id,
          company_name: product.company_name || "Company",
          category_id: product.category_id,
          category_name: product.category_name || "Sale"
        }));
        }

        if (arr.length > 0) {
          setProducts(arr);
          console.log("✅ Sales products loaded:", arr.length);
        } else {
          setError("No sales products found");
          console.warn("⚠️ No sales products found in API response");
        }
      } catch (err) {
        console.error("❌ Error loading sales products:", err);
        setError("Failed to load sales products");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // ✅ Convert relative image path to absolute URL (same as sales component)
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
          Sales Products
        </h1>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            {error}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600">
          <p className="text-sm sm:text-base md:text-lg">
            {loading 
              ? "Loading..." 
              : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'Product' : 'Products'} Found`
            }
          </p>
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 focus:outline-none text-gray-700"
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
          <div className="text-center text-gray-500 mt-10">
            <p>Fetching sales products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No sales products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center">
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
                             transition-all duration-700"
                  onClick={() => navigate(`/salesproduct/${product.id}`)}
                >
                  {/* ❤️ Favourite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product);
                    }}
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
                  </button>

                  {/* 🖼️ Product Image */}
                  <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-t-3xl">
                    <img
                      src={imageUrl}
                      alt={product.name_en || product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top rounded-t-3xl transition-transform duration-500 group-hover:scale-105 border-b border-white/20"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />

                    {/* ⭐ Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                      <Suspense fallback={<span className="text-xs text-white/70">★</span>}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </Suspense>
                      <span className="text-[10px] text-white/90 ml-1">
                        ({(product.rating || 0).toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* 💬 Info Section */}
                  <div className="relative w-full rounded-b-3xl p-3 sm:p-4 border-t border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-between">
                    <div className="flex flex-col w-[80%] z-10">
                      <h3 className="font-semibold text-[11px] sm:text-sm truncate text-gray-900 mb-1">
                        {product.name_en || product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] sm:text-sm font-bold text-gray-900">
                          QAR {product.price}
                        </span>
                        {product.old_price && (
                          <span className="text-xs line-through text-gray-500">
                            QAR {product.old_price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Icon */}
                    <Suspense fallback={<span className="w-4 h-4 bg-green-200 rounded-full" />}>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                          product.name_en || product.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-green-500/80 rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10"
                      >
                        <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
                      </a>
                    </Suspense>
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

export const SalesProductPage = memo(SalesProductPageComponent);
export default SalesProductPage;