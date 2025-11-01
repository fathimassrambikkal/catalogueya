import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";
import { FaUserCircle, FaChevronDown, FaWhatsapp, FaStar } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import { useFavourites } from "../context/FavouriteContext";
import CallToAction from "../components/CallToAction";

export default function CompanyPage() {
  const { categoryId, companyId } = useParams();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);
  const { favourites, toggleFavourite } = useFavourites();

  const category = categories.find((cat) => cat.id === categoryId);
  const company = category?.companies?.find((comp) => comp.id === companyId);

  if (!company)
    return <div className="text-center py-20 text-gray-500">Company not found.</div>;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }),
    []
  );

  return (
    <>
      {/* ===== Background ===== */}
      <div
        className="relative w-full py-20 overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(rgba(59,130,246,0.25) 1.5px, transparent 0)",
          backgroundSize: "20px 20px",
          backgroundPosition: "-5px -5px",
        }}
      >
        {/* ===== Company Header ===== */}
        <div className="relative w-full max-w-7xl mx-auto py-24 md:py-28 px-6 md:px-12 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            {/* === Logo + Name === */}
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full md:w-auto">
              {company.logo ? (
                <div className="flex-shrink-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-24 h-24 md:w-28 md:h-28 object-contain rounded-xl border border-gray-200 shadow-md bg-white p-2"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl border">
                  No Logo
                </div>
              )}

              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-gray-600 text-lg mt-2 max-w-xl mx-auto md:mx-0">
                  Redefining green spaces with elegance and care — where nature meets modern design.
                </p>
              </div>
            </div>

            {/* === WhatsApp + Info === */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-3 w-full md:w-auto">
              
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${company.phone?.replace(/\D/g, "") || ""}?text=Hi%20${company.name},%20I'm%20interested%20in%20your%20products%20on%20Catalogueya!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center 
                            px-4 py-3 rounded-full 
                            bg-green-500 hover:bg-green-600 
                            text-white shadow-md 
                            transition-all text-sm sm:text-base
                            w-auto min-w-[50px]"
              >
                <FaWhatsapp className="text-xl sm:text-lg" />
              </a>

              {/* Simple Dropdown */}
              <div ref={dropdownRef} className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="flex items-center justify-center gap-2 
                             px-5 py-3 rounded-full 
                             bg-white/80 backdrop-blur-md 
                             border border-gray-200 text-gray-800 
                             hover:bg-white transition-all shadow-sm 
                             text-base w-full sm:w-auto sm:min-w-[180px]"
                >
                  <FaUserCircle className="text-xl" />
                  <span>Company Info</span>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${showProfile ? "rotate-180" : ""}`}
                  />
                </button>

                {showProfile && (
                  <div
                    className="absolute right-0 mt-3 w-full sm:w-72 bg-white/95 backdrop-blur-md 
                               border border-gray-200 rounded-2xl p-5 
                               shadow-xl text-gray-900 z-20 
                               max-h-[70vh] overflow-y-auto"
                  >
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 text-center sm:text-left">
                      Company Profile
                    </h3>
                    <div className="space-y-2 text-gray-800 text-sm break-words">
                      <p>
                        <strong>Working Hours:</strong>{" "}
                        {company.workingHours || "Not specified"}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {company.location || "Not specified"}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {company.phone || "Not available"}
                      </p>
                      <p>
                        <strong>Social Media:</strong>{" "}
                        {company.social ? (
                          <a
                            href={company.social}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            Visit
                          </a>
                        ) : (
                          "Not available"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Products Section ===== */}
      <section className="py-10 sm:py-14 bg-gray-50 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-start justify-between mb-10 gap-6">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tighter text-gray-900">
            Our Products
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {company.products.length} products available
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {company.products.map((product) => {
            const isFav = favourites.some((fav) => fav.id === product.id);

            return (
              <motion.div
                key={product.id}
                variants={cardVariant}
                onClick={() =>
                  navigate(
                    `/category/${category.id}/company/${company.id}/product/${product.id}`
                  )
                }
                className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                           bg-white/10 border border-white/30 backdrop-blur-2xl 
                           shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                           hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
                           transition-all duration-700"
              >
                {/* === Product Image === */}
                <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden rounded-t-3xl">
                  <img
                    src={product.img || product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top rounded-t-3xl transition-transform duration-500 group-hover:scale-105 border-b border-white/20"
                  />

                  {/* === Favourite Button === */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(product);
                    }}
                    className="absolute top-3 right-3 bg-white/70 backdrop-blur-md rounded-full p-2 shadow-sm hover:scale-110 transition-all"
                  >
                    {isFav ? (
                      <AiFillHeart className="text-red-500 text-lg" />
                    ) : (
                      <AiOutlineHeart className="text-gray-600 text-lg" />
                    )}
                  </button>

                  {/* === Rating Badge === */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
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
                    <span className="text-[10px] text-white/90 ml-1">
                      ({(product.rating || 4.0).toFixed(1)})
                    </span>
                  </div>
                </div>

                {/* === Product Info (Glassmorphic Bottom) === */}
                <div
                  className="relative w-full rounded-b-3xl p-3 sm:p-4 border-t border-white/20 
                             bg-white/10 backdrop-blur-xl 
                             before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:rounded-b-3xl before:pointer-events-none 
                             shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                             flex items-center justify-between overflow-hidden"
                >
                  <div className="flex flex-col w-[80%] z-10">
                    <h3 className="font-semibold text-[11px] xs:text-xs sm:text-sm truncate text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] xs:text-[12px] sm:text-sm font-bold text-gray-900">
                        QAR {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-[9px] xs:text-[10px] sm:text-xs line-through text-gray-500">
                          QAR {product.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* === WhatsApp Button === */}
                  <a
                    href={`https://wa.me/${company.phone?.replace(/\D/g, "") || ""}?text=Hi%20${company.name},%20I'm%20interested%20in%20${encodeURIComponent(
                      product.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-green-500/80 rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10"
                    title="Chat on WhatsApp"
                  >
                    <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <CallToAction />
    </>
  );
}
