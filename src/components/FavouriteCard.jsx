import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";

/* =============================
   SVG ICONS (SIZE MATCHED)
============================= */
const HeartOutline = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M12 21s-7-4.35-9.33-8.04C-0.33 8.86 2.12 4 6.55 4c2.16 0 3.29 1.25 3.45 1.44C10.16 5.25 11.29 4 13.45 4c4.43 0 6.88 4.86 3.88 8.96C19 16.65 12 21 12 21z" />
  </svg>
);

const HeartFill = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
    <path d="M12 21s-7-4.35-9.33-8.04C-0.33 8.86 2.12 4 6.55 4c2.16 0 3.29 1.25 3.45 1.44C10.16 5.25 11.29 4 13.45 4c4.43 0 6.88 4.86 3.88 8.96C19 16.65 12 21 12 21z" />
  </svg>
);

const StarIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-3.5 h-3.5 ${active ? "text-yellow-400" : "text-gray-500"}`}
  >
    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 text-white">
    <path d="M19.11 17.19c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48 0 1.45 1.08 2.85 1.23 3.05.15.2 2.13 3.26 5.17 4.58.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z" />
  </svg>
);

/* =============================
   MAIN COMPONENT
============================= */
export default function FavouriteCard({ product }) {
  const navigate = useNavigate();
  const { toggleFavourite, favourites } = useFavourites();

  const isFavourite = favourites.some((item) => item.id === product.id);
  const whatsappNumber = "97400000000";

  return (
    <div
      onClick={() => navigate(`/salesproduct/${product.id}`)}
      className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer
                 bg-white/10 border border-white/60 backdrop-blur-2xl 
                 shadow-[0_8px_40px_rgba(255,255,255,0.15)] 
                 hover:shadow-[0_8px_80px_rgba(255,255,255,0.3)] 
                 transition-all duration-700
                 hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative w-full rounded-3xl overflow-hidden group h-[220px] xs:h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] xl:h-[450px]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105 border-8 border-white/40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        <div className="absolute top-4 left-4 bg-white/80 text-gray-800 px-3 py-1 text-xs rounded-full shadow-sm border border-white/40">
          Sale Offer
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(product);
          }}
          className="absolute top-4 right-4 bg-white/80 border border-white/50 rounded-full p-2 hover:bg-white transition"
        >
          {isFavourite ? <HeartFill /> : <HeartOutline />}
        </button>
      </div>

      {/* Info */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[88%] 
                   bg-white/30 backdrop-blur-xl border border-white/50 
                   rounded-2xl p-4 flex justify-between items-center 
                   shadow-[0_4px_30px_rgba(255,255,255,0.25)]"
      >
        <div className="flex flex-col w-[75%] text-white leading-tight">
          <h3 className="font-semibold text-base md:text-lg truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-200">
            {product.companyName || product.company} —{" "}
            {product.categoryName || product.category}
          </p>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-white font-bold text-lg md:text-xl">
              QAR {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs line-through text-gray-300">
                QAR {product.oldPrice}
              </span>
            )}
          </div>

          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} active={i < Math.floor(product.rating)} />
            ))}
            <span className="text-xs text-gray-200 ml-1">
              ({product.rating?.toFixed(1)})
            </span>
          </div>
        </div>

        <a
          href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
            product.name
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 bg-green-500/90 hover:bg-green-600 
                     transition p-3 rounded-2xl shadow-lg"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </div>
  );
}
