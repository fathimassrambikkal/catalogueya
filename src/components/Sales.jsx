import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaWhatsapp } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";
import { useFavourites } from "../context/FavouriteContext";
import { getSalesProducts } from "../api";

const whatsappNumber = "97400000000";

const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate }) => (
  <div
    className="relative w-full max-w-[280px] sm:max-w-[300px] group cursor-pointer"
    onClick={() => onNavigate(product.id)}
  >
    {/* Image Container - Taller height from first design */}
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[350px] overflow-hidden rounded-2xl">
      <img
        src={product.img}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-cover object-center
                 transition-transform duration-500 ease-out transform group-hover:scale-105"
      />
      
      {/* Rating Badge - Top Left from first design */}
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
        <FaStar className="w-3 h-3 text-white" />
        <span>{product.rating?.toFixed(1) || "4.5"}</span>
      </div>

      {/* Favourite Icon - Top Right from first design */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(product);
        }}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-all duration-200
          ${isFav ? "bg-white text-red-500" : "bg-white/90 text-gray-600 hover:text-red-400"}`}
      >
        <FaHeart className={`text-sm ${isFav ? "fill-red-500" : ""}`} />
      </button>

      {/* Discount Badge - Bottom Left from first design */}
      {product.discount && (
        <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          -{product.discount}%
        </div>
      )}
    </div>

    {/* Text Content Below Image - FROM SECOND CODE */}
    <div className="mt-3 flex items-center justify-between">
      <div className="flex flex-col w-[80%]">
        <h3 className="font-semibold text-[11px] xs:text-xs sm:text-sm truncate text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-[11px] xs:text-[12px] sm:text-sm font-bold text-gray-900">QAR {product.price}</span>
          {product.oldPrice && (
            <span className="text-[9px] xs:text-[10px] sm:text-xs line-through text-gray-500">QAR {product.oldPrice}</span>
          )}
        </div>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-2 bg-green-500 rounded-full text-white shadow-md hover:bg-green-600 transition"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-sm sm:text-base" />
      </a>
    </div>
  </div>
));

function SalesComponent() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const [apiProducts, setApiProducts] = useState([]);

  // FIXED API FETCH — always returns an array 🚀
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getSalesProducts();
        if (!mounted) return;

        let arr = [];

        if (Array.isArray(res)) arr = res;
        else if (Array.isArray(res?.data)) arr = res.data;
        else if (Array.isArray(res?.products)) arr = res.products;
        else console.warn("Unexpected API response format:", res);

        setApiProducts(arr);
      } catch (err) {
        console.warn("Failed to fetch sales products:", err);
        setApiProducts([]); // avoid crash
      }
    })();

    return () => (mounted = false);
  }, []);

  const combinedProducts = useMemo(
    () => [...(apiProducts || []), ...unifiedData.salesProducts],
    [apiProducts]
  );

  const limitedProducts = useMemo(() => combinedProducts.slice(0, 8), [combinedProducts]);

  const handleToggleFav = useCallback((product) => toggleFavourite(product), [toggleFavourite]);
  const handleNavigate = useCallback((id) => navigate(`/salesproduct/${id}`), [navigate]);

  return (
    <section className="py-8 sm:py-12 bg-neutral-100 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      {/* Header from first design */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-8 sm:mb-12 gap-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">Sales</h1>
        <div className="md:w-1/3 flex justify-start md:justify-end">
          <Link
            to="/salesproducts"
            className="relative font-medium text-gray-800 px-2 py-2 overflow-hidden group h-5 sm:h-6 flex items-center gap-1 text-xs sm:text-base"
          >
            <span className="transition-transform duration-300 transform group-hover:-translate-y-full flex items-center gap-1 sm:gap-2">
              View more <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute left-3 top-full w-full transition-transform duration-300 transform group-hover:translate-y-[-100%] flex items-center gap-1">
              View more <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute bottom-0 left-2 h-[1px] w-4/5 bg-gray-800/20 overflow-hidden">
              <span className="absolute left-0 top-0 h-full w-full bg-gray-800 origin-left transform scale-x-[0.9] opacity-30 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"></span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 place-items-center">
        {limitedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFav={favourites.some(item => item.id === product.id)}
            onToggleFavourite={handleToggleFav}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </section>
  );
}

export const Sales = memo(SalesComponent);
export default Sales;