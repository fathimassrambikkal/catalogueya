import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";
import { FaUserCircle, FaChevronDown, FaWhatsapp, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useFavourites } from "../context/FavouriteContext";
import CallToAction from "../components/CallToAction";

export default function CompanyPage() {
  const { categoryId, companyId } = useParams();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);
  const { favourites } = useFavourites();

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
              
              {/* ✅ WhatsApp Button (icon only, compact, not full width) */}
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


              {/* ✅ Simple Dropdown (no motion) */}
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
      <section className="py-20 bg-gray-50 px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-start justify-between mb-14 gap-6">
          <h2 className="text-4xl font-light tracking-tighter text-gray-900">
            Our Products
          </h2>
          <p className="text-gray-600">
            {company.products.length} products available
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {company.products.map((product) => (
            <motion.div
              key={product.id}
              onClick={() =>
                navigate(
                  `/category/${category.id}/company/${company.id}/product/${product.id}`
                )
              }
              variants={cardVariant}
              className="relative w-full max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                         bg-white/10 border border-white/50 backdrop-blur-2xl 
                         shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                         hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                         transition-all duration-700"
            >
              <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] rounded-3xl overflow-hidden">
                <img
                  src={product.img || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top rounded-3xl transition-transform duration-500 group-hover:scale-105 border-4 border-white/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
              </div>

              <div
                className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%]
                           bg-white/30 backdrop-blur-xl border border-white/40 
                           rounded-xl p-3 flex flex-col items-center text-white shadow-lg"
              >
                <h3 className="font-semibold text-sm truncate text-center">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white font-bold text-sm">
                    QAR {product.price}
                  </span>
                </div>
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
          ))}
        </motion.div>
      </section>

      <CallToAction />
    </>
  );
}
