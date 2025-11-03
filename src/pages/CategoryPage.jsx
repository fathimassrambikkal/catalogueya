import React, { useState, useMemo, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../data/categoriesData";
import { useFavourites } from "../context/FavouriteContext";

// ✅ Lazy-load icons
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
const MdOutlineArrowOutward = React.lazy(() =>
  import("react-icons/md").then((mod) => ({ default: mod.MdOutlineArrowOutward }))
);

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("companies");
  const [sortBy, setSortBy] = useState("relevance");
  const { favourites, toggleFavourite } = useFavourites();

  const isFavourite = (id) => favourites.some((fav) => fav.id === id);
  const whatsappNumber = "97400000000";

  const category = categories.find((cat) => cat.id === categoryId);
  if (!category)
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Category not found.
      </div>
    );

  // ===== Sorting Logic =====
  const sortedCompanies = useMemo(() => {
    let companies = [...category.companies];
    if (sortBy === "rating") {
      companies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return companies;
  }, [category.companies, sortBy]);

  const sortedProducts = useMemo(() => {
    let products = category.companies.flatMap((company) =>
      (company.products || []).map((p) => ({
        ...p,
        companyId: company.id,
        companyName: company.name,
        categoryId: category.id,
      }))
    );

    if (sortBy === "priceLow") {
      products.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    } else if (sortBy === "priceHigh") {
      products.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    } else if (sortBy === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return products;
  }, [category.companies, sortBy, category.id]);

  // ===== Share Product =====
  const handleShare = (e, product) => {
    e.stopPropagation();
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Catalogueya!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section
      className="min-h-screen w-full py-10 sm:py-14 px-4 sm:px-8 md:px-12 relative overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(rgba(59,130,246,0.08) 1.2px, transparent 0)",
        backgroundSize: "18px 18px",
        backgroundPosition: "0 0",
      }}
    >
      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-20">
        {/* ===== Header with Back Arrow + Logo ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <Suspense fallback={<span>←</span>}>
                <FaArrowLeft className="text-gray-800 text-lg" />
              </Suspense>
            </button>

            <div className="flex items-center gap-3">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 shadow-md object-cover"
                />
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">
                {category.title}
              </h2>
            </div>
          </div>

          {/* View & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewType === "companies"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setViewType("companies")}
              >
                Companies
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewType === "products"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setViewType("products")}
              >
                Products
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="rating">Top Rated</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
                {/* ===== Companies Grid ===== */}
        {viewType === "companies" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center"
          >
            {sortedCompanies.map((company) => (
              <motion.div
                key={company.id}
                whileHover={{ scale: 1.03 }}
                onClick={() =>
                  navigate(`/category/${category.id}/company/${company.id}`)
                }
                className="relative group cursor-pointer bg-white rounded-xl 
                          border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] 
                          hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] 
                          transition-all duration-700 overflow-hidden w-full max-w-[220px]"
              >
                {/* Logo Container */}
                <div className="relative w-full h-[120px] overflow-hidden rounded-t-xl">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="object-cover w-[88%] h-[92%] m-auto rounded-xl transition-transform duration-700 group-hover:scale-105 mt-2"
                  />
                </div>

                {/* Info Section */}
                <div className="flex items-center justify-between p-3 pt-2">
                  {/* Text & Rating */}
                  <div className="flex flex-col">
                    <h3 className="text-gray-900 font-medium text-sm sm:text-base truncate mb-1">
                      {company.name}
                    </h3>

                    <div className="flex items-center gap-1">
                      <Suspense fallback={<span>★</span>}>
                        <FaStar className="w-3 h-3 text-yellow-400" />
                      </Suspense>
                      <span className="text-xs text-gray-600 font-medium">
                        {company.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow - Right side inline */}
                  <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full shadow-sm transition-all duration-300">
                    <Suspense fallback={<span>→</span>}>
                      <MdOutlineArrowOutward className="text-gray-700 text-sm" />
                    </Suspense>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ===== Products Grid ===== */}
        {viewType === "products" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 place-items-center"
          >
            {sortedProducts.map((product) => {
              const isFav = isFavourite(product.id);
              return (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.04 }}
                  onClick={() =>
                    navigate(
                      `/category/${product.categoryId}/company/${product.companyId}/product/${product.id}`
                    )
                  }
                  className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white border border-gray-100 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                             hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
                             transition-all duration-700"
                >
                  {/* Favourite Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product);
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition backdrop-blur-md border 
                      ${
                        isFav
                          ? "bg-red-100 text-red-600 border-red-200"
                          : "bg-white text-gray-600 border-white hover:bg-red-50"
                      }`}
                  >
                    <Suspense fallback={<span>♡</span>}>
                      <FaHeart
                        className={`text-sm ${
                          isFav ? "text-red-500" : "hover:text-red-400"
                        }`}
                      />
                    </Suspense>
                  </motion.button>

                  {/* Product Image */}
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <img
                      src={product.img || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                      <Suspense fallback={<span>★</span>}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 4)
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </Suspense>
                      <span className="text-[10px] text-white ml-1">
                        {(product.rating || 4.0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          QAR {product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs line-through text-gray-500">
                            QAR {product.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Suspense fallback={<span>💬</span>}>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                          product.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-green-500 rounded-full text-white shadow-md hover:bg-green-600 transition"
                      >
                        <FaWhatsapp className="text-base" />
                      </a>
                    </Suspense>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
