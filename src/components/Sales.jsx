import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaWhatsapp } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";
import { useFavourites } from "../context/FavouriteContext";

export default function Sales() {
  const navigate = useNavigate();
  const { salesProducts } = unifiedData;
  const limitedProducts = salesProducts.slice(0, 8);
  const { favourites, toggleFavourite } = useFavourites();
  const whatsappNumber = "97400000000";

  // Animation variants
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

  return (
    <section className="py-20 bg-gray-50 px-2 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-14 gap-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tighter text-gray-900">
          Sales
        </h1>

        <div className="md:w-1/3 flex justify-start md:justify-end">
          <Link
            to="/salesproducts"
            className="relative font-medium text-gray-800 px-2 py-2 overflow-hidden group h-5 sm:h-6 flex items-center gap-1 text-xs sm:text-base"
          >
            <span className="transition-transform duration-300 transform group-hover:-translate-y-full flex items-center gap-1 sm:gap-2">
              View more{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            <span className="absolute left-3 top-full w-full transition-transform duration-300 transform group-hover:translate-y-[-100%] flex items-center gap-1">
              View more{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            <span className="absolute bottom-0 left-2 h-[1px] w-4/5 bg-gray-800/20 overflow-hidden">
              <span className="absolute left-0 top-0 h-full w-full bg-gray-800 origin-left transform scale-x-[0.9] opacity-30 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"></span>
            </span>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-7 place-items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        {limitedProducts.map((product) => {
          const isFav = favourites.some((item) => item.id === product.id);

          return (
            <motion.div
              key={product.id}
              variants={cardVariant}
              className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                         bg-white/10 border border-white/50 backdrop-blur-2xl 
                         shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                         hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                         transition-all duration-700"
              onClick={() => navigate(`/salesproduct/${product.id}`)}
            >
              {/* Favourite Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(product);
                }}
                whileTap={{ scale: 0.9 }}
                className={`absolute top-2 right-2 sm:top-3 sm:right-4 z-20 p-1.5 sm:p-2.5 rounded-full shadow-md transition backdrop-blur-md border 
                  ${
                    isFav
                      ? "bg-red-100 text-red-600 border-red-200"
                      : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                  }`}
              >
                <FaHeart
                  className={`text-xs sm:text-sm md:text-base ${
                    isFav ? "text-red-500" : "hover:text-red-400"
                  }`}
                />
              </motion.button>

              {/* Image */}
              <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[260px] md:h-[300px] rounded-3xl overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover object-top rounded-3xl transition-transform duration-500 group-hover:scale-105 border-2 sm:border-4 border-white/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
              </div>

              {/* Floating Info */}
              <div
                className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 w-[88%]
                           bg-white/30 backdrop-blur-xl border border-white/40 
                           rounded-xl p-2 sm:p-3 flex flex-col items-center text-white shadow-lg"
              >
                {/* ✅ Fixed name (responsive + no overflow) */}
                <h3
                  className="font-semibold text-[10px] xs:text-xs sm:text-sm md:text-base text-center mb-1 
                             overflow-hidden text-ellipsis line-clamp-2 leading-tight max-h-[2.5em]"
                >
                  {product.name}
                </h3>

                {/* Price + Rating + WhatsApp */}
                <div className="flex items-center justify-between w-full mt-1">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-white">
                        QAR {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-[8px] xs:text-[9px] sm:text-[10px] line-through text-gray-300">
                          QAR {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-0.5 sm:mt-1 flex-wrap">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-2 h-2 xs:w-2.5 sm:w-3 xs:h-2.5 sm:h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                      <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-200 ml-1">
                        ({product.rating.toFixed(1)})
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
                    className="p-1 bg-green-500 rounded-full text-white shadow-md hover:bg-green-600 transition ml-2 sm:ml-3"
                    title="Chat on WhatsApp"
                  >
                    <FaWhatsapp className="text-xs sm:text-sm md:text-lg" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
