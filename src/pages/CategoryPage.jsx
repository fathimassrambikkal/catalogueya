import React, { useState, useEffect, useMemo, Suspense, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHeart, FaRegHeart, FaWhatsapp, FaStar } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useFavourites } from "../context/FavouriteContext";
import { getCategory, getSettings, getFixedWords, getCompanies, getProducts } from "../api";

// =================== Rating Helper Function ===================
const getSafeRating = (rating) => {
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'string') return parseFloat(rating) || 0;
  return 0;
};

const formatRating = (rating) => {
  const safeRating = getSafeRating(rating);
  return safeRating.toFixed(1);
};

// =================== CompanyCard Component ===================
const CompanyCard = memo(({ company, categoryId, navigate }) => {
  const handleClick = () => {
    navigate(`/company/${company.id}`);
  };

  const rating = getSafeRating(company.rating);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
      className="relative group cursor-pointer bg-white rounded-xl border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden w-full max-w-[220px] mx-auto"
    >
      <div className="relative w-full h-[120px] overflow-hidden rounded-t-xl">
        <img
          src={company.logo || company.image || "/api/placeholder/200/120"}
          alt={company.name || company.title}
          className="object-cover w-[88%] h-[92%] m-auto rounded-xl transition-transform duration-700 group-hover:scale-105 mt-2"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/api/placeholder/200/120";
          }}
        />
      </div>
      
      <div className="flex items-start justify-between p-3 pt-2 gap-2">
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2 mb-1 leading-tight break-words text-start rtl:text-right">
            {company.name || company.title}
          </h3>
          <div className="flex items-center gap-1 rtl:flex-row-reverse">
            <FaStar className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium">
              {formatRating(rating)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full shadow-sm transition-all duration-300 mt-1">
          <MdOutlineArrowOutward className="text-gray-700 text-sm" />
        </div>
      </div>
    </motion.div>
  );
});

// =================== ProductCard Component ===================
const ProductCard = memo(({ product, isFav, toggleFavourite, whatsappNumber, navigate }) => {
  const handleFavouriteClick = (e) => {
    e.stopPropagation();
    toggleFavourite(product.id, 'product');
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const message = `Hello! I'm interested in this product: ${product.name || product.title}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const displayPrice = product.price 
    ? `QAR ${parseFloat(product.price).toLocaleString()}`
    : 'Price not available';

  const rating = getSafeRating(product.rating);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      onClick={handleCardClick}
      className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer bg-white border border-gray-100 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] transition-all duration-700 mx-auto"
    >
      {/* Favourite Button */}
      <motion.button
        onClick={handleFavouriteClick}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition backdrop-blur-md border ${
          isFav
            ? "bg-red-100 text-red-600 border-red-200"
            : "bg-white text-gray-600 border-white hover:bg-red-50"
        }`}
      >
        {isFav ? (
          <FaHeart className="text-sm text-red-500" />
        ) : (
          <FaRegHeart className="text-sm hover:text-red-400" />
        )}
      </motion.button>

      {/* Product Image */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <img
          src={product.image || product.thumbnail || "/api/placeholder/300/200"}
          alt={product.name || product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/200";
          }}
        />
        
        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            ))}
            <span className="text-[10px] text-white ml-1 rtl:ml-0 rtl:mr-1">
              {formatRating(rating)}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1 break-words text-start rtl:text-right">
            {product.name || product.title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-900">
              {displayPrice}
            </span>
          </div>
          {product.description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-1 break-words text-start rtl:text-right">
              {product.description}
            </p>
          )}
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="p-2 bg-green-500 rounded-full text-white shadow-md hover:bg-green-600 transition flex-shrink-0"
        >
          <FaWhatsapp className="text-base" />
        </button>
      </div>
    </motion.div>
  );
});

// =================== Main CategoryPage Component ===================
export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [fixedWords, setFixedWords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("companies");
  const [sortBy, setSortBy] = useState("relevance");
  const { favourites, toggleFavourite } = useFavourites();

  const whatsappNumber = "97400000000";
  const isFavourite = (id) => favourites.some((f) => f.id === id);

  // =================== Fetch Data ===================
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, companiesRes, productsRes, setRes, wordsRes] = await Promise.all([
          getCategory(categoryId),
          getCompanies(),
          getProducts(),
          getSettings(),
          getFixedWords(),
        ]);

        if (!mounted) return;

        // Extract data
        const categoryData = catRes?.data?.data?.category || null;
        const companiesData = companiesRes?.data?.data?.companies || [];
        const productsData = productsRes?.data?.data?.products || [];
        const settingsData = setRes?.data?.data || {};
        const fixedWordsData = wordsRes?.data?.data || {};

        console.log("First company rating:", companiesData[0]?.rating, typeof companiesData[0]?.rating);
        console.log("First product rating:", productsData[0]?.rating, typeof productsData[0]?.rating);

        if (categoryData) {
          setCategory(categoryData);
        } else {
          setError("Category not found.");
        }

        setCompanies(companiesData);
        setProducts(productsData);
        setSettings(settingsData);
        setFixedWords(fixedWordsData);

      } catch (e) {
        console.error("Failed to fetch category data:", e);
        setError("Failed to load category.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [categoryId]);

  // =================== SAFE sortedCompanies ===================
  const sortedCompanies = useMemo(() => {
    if (!Array.isArray(companies)) return [];

    let companiesArray = [...companies];

    if (sortBy === "rating") {
      companiesArray.sort((a, b) => {
        const ratingA = getSafeRating(a.rating);
        const ratingB = getSafeRating(b.rating);
        return ratingB - ratingA;
      });
    }

    return companiesArray;
  }, [companies, sortBy]);

  // =================== SAFE sortedProducts ===================
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let productsArray = [...products];

    if (sortBy === "priceLow") {
      productsArray.sort(
        (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)
      );
    } else if (sortBy === "priceHigh") {
      productsArray.sort(
        (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)
      );
    } else if (sortBy === "rating") {
      productsArray.sort((a, b) => {
        const ratingA = getSafeRating(a.rating);
        const ratingB = getSafeRating(b.rating);
        return ratingB - ratingA;
      });
    }

    return productsArray;
  }, [products, sortBy]);

  // =================== UI ===================
  if (loading)
    return <div className="text-center py-20 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!category)
    return <div className="text-center py-20 text-red-600">Category not found</div>;

  return (
    <section
      className="min-h-screen w-full py-10 sm:py-14 px-4 sm:px-8 md:px-12 relative overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(rgba(59,130,246,0.08) 1.2px, transparent 0)",
        backgroundSize: "18px 18px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-6 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
      >
        <FaArrowLeft className="text-gray-700 text-lg" />
      </button>

      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div className="flex items-center gap-4 ml-10 md:ml-0">
            {category.image && (
              <img
                src={category.image}
                alt={category.name || category.title}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 shadow-md object-cover"
                loading="lazy"
              />
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900 break-words text-start rtl:text-right">
              {category.name || category.title || "Category"}
            </h2>
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
                onClick={() => setViewType("companies")}
                className={`relative px-6 py-2.5 text-sm font-medium transition z-10 ${
                  viewType === "companies" ? "text-white" : "text-gray-900"
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => setViewType("products")}
                className={`relative px-6 py-2.5 text-sm font-medium transition z-10 ${
                  viewType === "products" ? "text-white" : "text-gray-700"
                }`}
              >
                Products
              </button>
            </div>

           <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border border-gray-300 rounded-full px-3 py-2 pr-8 text-sm bg-white focus:ring-2 focus:ring-blue-400 text-start rtl:text-right rtl:pl-8 rtl:pr-3"
>
  <option value="relevance">Sort by Relevance</option>
  <option value="rating">Top Rated</option>
  <option value="priceLow">Price: Low → High</option>
  <option value="priceHigh">Price: High → Low</option>
</select>
          </div>
        </div>

        {/* Companies */}
        {viewType === "companies" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
          >
            {sortedCompanies.length > 0 ? (
              sortedCompanies.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  categoryId={category.id}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No companies found
              </div>
            )}
          </motion.div>
        )}

        {/* Products */}
        {viewType === "products" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 justify-items-center"
          >
            {sortedProducts.length > 0 ? (
              sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFav={isFavourite(p.id)}
                  toggleFavourite={toggleFavourite}
                  whatsappNumber={whatsappNumber}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No products found
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}