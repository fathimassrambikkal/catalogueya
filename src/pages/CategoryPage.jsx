import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaShareAlt, FaStar } from "react-icons/fa";
import { useFavourites } from "../context/FavouriteContext";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("companies");
  const [sortBy, setSortBy] = useState("relevance");
  const { favourites, toggleFavourite } = useFavourites();

  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  const category = categories.find((cat) => cat.id === categoryId);
  if (!category)
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Category not found.
      </div>
    );

  // ✅ Sorting Logic — balanced for both companies & products
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
      products.sort(
        (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)
      );
    } else if (sortBy === "priceHigh") {
      products.sort(
        (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)
      );
    } else if (sortBy === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return products;
  }, [category.companies, sortBy, category.id]);

  // ✅ Share Functionality
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
      className="min-h-screen w-full py-20 px-6 md:px-12 relative overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(rgba(59,130,246,0.2) 1.2px, transparent 0)",
        backgroundSize: "18px 18px",
        backgroundPosition: "0 0",
      }}
    >
      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-20">
        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <h2 className="text-5xl font-light tracking-tighter text-gray-900">
            {category.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <button
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  viewType === "companies"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setViewType("companies")}
              >
                Companies
              </button>
              <button
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  viewType === "products"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setViewType("products")}
              >
                Products
              </button>
            </div>

            {/* Sorting Dropdown */}
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

        {/* ===== Grid Section ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center"
        >
          {/* ===== Companies View ===== */}
          {viewType === "companies" &&
            sortedCompanies.map((company) => (
              <motion.div
                key={company.id}
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  navigate(`/category/${category.id}/company/${company.id}`)
                }
                className="relative w-full max-w-[300px] flex flex-col items-center text-center cursor-pointer 
                           transition-transform duration-500 gap-4"
              >
                {/* Company Logo */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                />

                {/* Company Info */}
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg tracking-tight">
                    {company.name}
                  </h3>

                  <div className="flex items-center justify-center mt-1 text-yellow-500">
                    <FaStar className="w-4 h-4" />
                    <span className="text-gray-700 text-sm font-medium ml-1">
                      {company.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* ===== Products View ===== */}
          {viewType === "products" &&
            sortedProducts.map((product) => {
              const fav = isFavourite(product.id);
              return (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.04 }}
                  onClick={() =>
                    navigate(
                      `/category/${product.categoryId}/company/${product.companyId}/product/${product.id}`
                    )
                  }
                  className="relative w-full max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white/10 border border-white/50 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                             hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                             transition-all duration-700"
                >
                  <div className="relative w-full h-[260px] sm:h-[280px] rounded-3xl overflow-hidden">
                    <img
                      src={product.img || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-top rounded-3xl transition-transform duration-500 group-hover:scale-105 border-4 border-white/30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>

                    <div className="absolute top-4 right-4 flex items-center gap-3">
                      {/* Share */}
                      <button
                        onClick={(e) => handleShare(e, product)}
                        className="bg-white/70 border border-white/50 rounded-full p-2 hover:bg-white transition"
                      >
                        <FaShareAlt className="text-gray-800 w-5 h-5" />
                      </button>

                      {/* Favourite */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavourite(product);
                        }}
                        className="bg-white/70 border border-white/50 rounded-full p-2 hover:bg-white transition"
                      >
                        {fav ? (
                          <AiFillHeart className="text-red-500 w-5 h-5" />
                        ) : (
                          <AiOutlineHeart className="text-gray-800 w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%]
                                bg-white/30 backdrop-blur-xl border border-white/40 
                                rounded-xl p-3 flex flex-col items-center text-white shadow-lg"
                  >
                    <h3 className="font-semibold text-sm truncate text-center">
                      {product.name}
                    </h3>
                    <span className="text-white font-bold text-sm mt-1">
                      QAR {product.price}
                    </span>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating || 4)
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-200 ml-1">
                        ({(product.rating || 4.0).toFixed(1)})
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </div>
    </section>
  );
}
