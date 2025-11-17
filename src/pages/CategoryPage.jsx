import React, { useState, useEffect, useMemo, Suspense, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../data/categoriesData";
import { useFavourites } from "../context/FavouriteContext";
import { getCategory, getSettings, getFixedWords } from "../api";

// Lazy icons
const FaStar = React.lazy(() =>
  import("react-icons/fa").then(mod => ({ default: mod.FaStar }))
);
const FaHeart = React.lazy(() =>
  import("react-icons/fa").then(mod => ({ default: mod.FaHeart }))
);
const FaWhatsapp = React.lazy(() =>
  import("react-icons/fa").then(mod => ({ default: mod.FaWhatsapp }))
);
const FaArrowLeft = React.lazy(() =>
  import("react-icons/fa").then(mod => ({ default: mod.FaArrowLeft }))
);
const MdOutlineArrowOutward = React.lazy(() =>
  import("react-icons/md").then(mod => ({ default: mod.MdOutlineArrowOutward }))
);

// =================== Company Card ===================
const CompanyCard = memo(({ company, categoryId, navigate }) => (
  <motion.div
    key={company.id}
    whileHover={{ scale: 1.03 }}
    onClick={() =>
      navigate(`/category/${categoryId}/company/${company.id}`)
    }
    className="relative group cursor-pointer bg-white rounded-xl border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden w-full max-w-[220px]"
  >
    <div className="relative w-full h-[120px] overflow-hidden rounded-t-xl">
      <img
        src={company.logo}
        alt={company.name}
        className="object-cover w-[88%] h-[92%] m-auto rounded-xl transition-transform duration-700 group-hover:scale-105 mt-2"
        loading="lazy"
      />
    </div>
    <div className="flex items-center justify-between p-3 pt-2">
      <div className="flex flex-col">
        <h3 className="text-gray-900 font-medium text-sm sm:text-base truncate mb-1">
          {company.name}
        </h3>
        <div className="flex items-center gap-1">
          <Suspense fallback={<span>★</span>}>
            <FaStar className="w-3 h-3 text-yellow-400" />
          </Suspense>
          <span className="text-xs text-gray-600 font-medium">
            {(company.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>
      <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full shadow-sm transition-all duration-300">
        <Suspense fallback={<span>→</span>}>
          <MdOutlineArrowOutward className="text-gray-700 text-sm" />
        </Suspense>
      </div>
    </div>
  </motion.div>
));

// =================== Product Card ===================
const ProductCard = memo(
  ({ product, toggleFavourite, isFav, whatsappNumber, navigate }) => (
    <motion.div
      key={product.id}
      whileHover={{ scale: 1.04 }}
      onClick={() =>
        navigate(
          `/category/${product.categoryId}/company/${product.companyId}/product/${product.id}`
        )
      }
      className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer bg-white border border-gray-100 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] transition-all duration-700"
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavourite(product);
        }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition backdrop-blur-md border ${
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

      {/* Image */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <img
          src={product.img || product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
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

      {/* Info */}
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
  )
);

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
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

    const fetch = async () => {
      setLoading(true);
      try {
        const [catRes, setRes, wordsRes] = await Promise.all([
          getCategory(categoryId),
          getSettings(),
          getFixedWords(),
        ]);

        if (!mounted) return;

        if (catRes?.data) setCategory(catRes.data);
        else {
          const fallback = categories.find(
            (c) => c.id.toString() === categoryId
          );
          if (fallback) setCategory(fallback);
          else setError("Category not found.");
        }

        if (setRes?.data) setSettings(setRes.data);
        if (wordsRes?.data) setFixedWords(wordsRes.data);
      } catch (e) {
        const fallback = categories.find(
          (c) => c.id.toString() === categoryId
        );
        if (fallback) setCategory(fallback);
        else setError("Failed to load category.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => (mounted = false);
  }, [categoryId]);

  // =================== SAFE sortedCompanies ===================
  const sortedCompanies = useMemo(() => {
    if (!category || !Array.isArray(category.companies)) return [];

    let companies = [...category.companies];

    if (sortBy === "rating") {
      companies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return companies;
  }, [category, sortBy]);

  // =================== SAFE sortedProducts ===================
  const sortedProducts = useMemo(() => {
    if (!category || !Array.isArray(category.companies)) return [];

    const products = category.companies.flatMap((c) =>
      Array.isArray(c.products)
        ? c.products.map((p) => ({
            ...p,
            companyId: c.id,
            companyName: c.name,
            categoryId: category.id,
          }))
        : []
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
  }, [category, sortBy]);

  // =================== UI ===================
  if (loading)
    return <div className="text-center py-20 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

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
        <Suspense fallback={<span>←</span>}>
          <FaArrowLeft className="text-gray-700 text-lg" />
        </Suspense>
      </button>

      <div className="relative max-w-7xl mx-auto flex flex-col gap-10 mt-20">
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
              {fixedWords?.categoryTitle || category.title}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            <div className="flex border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewType("companies")}
                className={`px-5 py-2 text-sm font-medium transition rounded-l-full ${
                  viewType === "companies"
                    ? "bg-blue-500 text-white"
                    : "text-gray-900"
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => setViewType("products")}
                className={`px-5 py-2 text-sm font-medium transition rounded-r-full ${
                  viewType === "products"
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Products
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="rating">Top Rated</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Companies */}
        <Suspense fallback={<div className="py-10">Loading...</div>}>
          {viewType === "companies" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center"
            >
              {sortedCompanies.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  categoryId={category.id}
                  navigate={navigate}
                />
              ))}
            </motion.div>
          )}

          {/* Products */}
          {viewType === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 place-items-center"
            >
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFav={isFavourite(p.id)}
                  toggleFavourite={toggleFavourite}
                  whatsappNumber={whatsappNumber}
                  navigate={navigate}
                />
              ))}
            </motion.div>
          )}
        </Suspense>
      </div>
    </section>
  );
}
