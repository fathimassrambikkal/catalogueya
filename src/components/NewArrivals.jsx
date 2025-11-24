import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaWhatsapp } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { unifiedData } from "../data/unifiedData";
import { useFavourites } from "../context/FavouriteContext";
import { getArrivalsProducts } from "../api";

const whatsappNumber = "97400000000";

// Memoized Product Card
const ProductCard = memo(({ product, isFav, onToggleFavourite, onNavigate }) => (
  <div
    className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
               bg-white/10 border border-white/30 backdrop-blur-2xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
               hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
               transition-all duration-700"
    onClick={() => onNavigate(product.id)}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavourite(product);
      }}
      className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition backdrop-blur-md border 
        ${isFav ? "bg-red-100 text-red-600 border-red-200" : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}`}
    >
      <FaHeart className={`text-xs sm:text-sm md:text-base ${isFav ? "text-red-500" : "hover:text-red-400"}`} />
    </button>

    <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden rounded-t-3xl">
      <img
        src={product.img}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-cover object-top rounded-t-3xl border-b border-white/20 
                 transition-transform duration-500 ease-out transform group-hover:scale-105"
      />
      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating ?? 0) ? "text-white" : "text-gray-400"}`} />
        ))}
        <span className="text-[10px] text-white/90 ml-1">{(product.rating ?? 0).toFixed(1)}</span>
      </div>
    </div>

    <div
      className="relative w-full rounded-b-2xl p-3 sm:p-4 border-t border-white/20 
                 bg-white 
                 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:rounded-b-2xl before:pointer-events-none 
                 shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                 flex items-center justify-between overflow-hidden"
    >
      <div className="flex flex-col w-[80%] z-10">
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
        className="p-2 bg-green-500/80 rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
      </a>
    </div>
  </div>
));

function NewArrivalsComponent() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const [apiProducts, setApiProducts] = useState([]);

  // Async/Await API fetch with error handling
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const res = await getArrivalsProducts();
        if (!mounted) return;

        const cleaned = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        setApiProducts(cleaned);
      } catch (err) {
        console.warn("Failed to fetch new arrivals:", err);
        setApiProducts([]); // fallback
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // SAFE MERGE (prevents crash)
  const combinedProducts = useMemo(() => {
    const api = Array.isArray(apiProducts) ? apiProducts : [];
    const local = Array.isArray(unifiedData.newArrivalProducts)
      ? unifiedData.newArrivalProducts
      : [];

    return [...api, ...local];
  }, [apiProducts]);

  const limitedProducts = useMemo(() => combinedProducts.slice(0, 4), [combinedProducts]);

  const handleToggleFav = useCallback((product) => toggleFavourite(product), [toggleFavourite]);
  const handleNavigate = useCallback((id) => navigate(`/newarrivalprofile/${id}`), [navigate]);

  return (
    <section className="py-6 sm:py-10 bg-amber-300 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal md:font-light tracking-tighter text-black">
         Products
        </h1>
        <div className="flex justify-end">
          <Link
            to="/newarrivalproducts"
            className="relative font-medium text-black overflow-hidden group h-6 sm:h-7 flex items-center text-xs sm:text-base mt-1"
          >
            {/* Default text */}
            <span className="flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full text-sm md:text-lg tracking-tighter">
              View more
              <span className="inline-block text-gray-700 transition-transform duration-300 group-hover:translate-x-1">
                <MdArrowOutward className="text-lg" />
              </span>
            </span>

            {/* Hover text sliding up */}
            <span className="absolute left-0 top-full flex items-center gap-1 sm:gap-1.5 transition-transform duration-300 group-hover:-translate-y-full text-sm md:text-lg tracking-tighter">
              View more
              <span className="inline-block text-gray-700 transition-transform duration-300 group-hover:translate-x-1">
                <MdArrowOutward className="text-lg" />
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 place-items-center">
        {limitedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFav={favourites.some((item) => item.id === product.id)}
            onToggleFavourite={handleToggleFav}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </section>
  );
}

export const NewArrivals = memo(NewArrivalsComponent);
export default NewArrivals;