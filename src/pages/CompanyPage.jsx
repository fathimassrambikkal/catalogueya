"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdIosShare } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { useFavourites } from "../context/FavouriteContext";
import { getCompany, getSettings, getFixedWords } from "../api";

// Lazy load heavy icons only
const FaWhatsapp = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaWhatsapp }))
);
const FaHeart = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaHeart }))
);
const FaArrowLeft = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaArrowLeft }))
);

export default function CompanyPage() {
  const { categoryId, companyId } = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({});
  const [fixedWords, setFixedWords] = useState({});

  // Helper to check favourites
  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  // Determine base path for navigation based on available params
  const getBasePath = () => {
    if (categoryId && companyId) {
      return `/category/${categoryId}/company/${companyId}`;
    } else if (companyId) {
      return `/company/${companyId}`;
    }
    return "/";
  };

  // ===== Fetch backend data =====
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    console.log("🔄 Fetching company with ID:", companyId);
    console.log("📁 Category ID:", categoryId);

    // Fetch company data from API only
    getCompany(companyId)
      .then((res) => {
        if (!mounted) return;

        console.log("📦 Full API Response:", res);
        console.log("📊 Response data:", res.data);
        console.log("🔍 Response data.data:", res.data?.data);
        console.log("🏢 Company data:", res.data?.data?.company);
        
        // Extract company data from API response
        const companyData = res?.data?.data?.company || res?.data?.company || res?.data;

        console.log("✅ Extracted company data:", companyData);

        if (companyData) {
          setCompany(companyData);
          console.log("🎉 Company data successfully set:", companyData);
        } else {
          console.error("❌ No company data found in response");
          setError("Company not found in API response");
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("❌ Failed to fetch company:", err);
        console.error("Error details:", err.response?.data || err.message);
        setError("Failed to load company data");
      })
      .finally(() => {
        if (mounted) {
          console.log("🏁 Loading completed");
          setLoading(false);
        }
      });

    // Fetch settings & fixed words in parallel
    Promise.all([getSettings(), getFixedWords()])
      .then(([settingsRes, fixedWordsRes]) => {
        if (!mounted) return;
        console.log("⚙️ Settings loaded:", settingsRes.data);
        console.log("🔤 Fixed words loaded:", fixedWordsRes.data);
        setSettings(settingsRes.data || {});
        setFixedWords(fixedWordsRes.data || {});
      })
      .catch((err) => {
        console.error("Failed to load settings/fixed words:", err);
      });

    return () => {
      console.log("🧹 Cleaning up company page");
      mounted = false;
    };
  }, [categoryId, companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        Company not found.
      </div>
    );
  }

  // Safely extract company properties
  const {
    name,
    title,
    logo,
    banner,
    rating = 0,
    phone,
    location,
    address,
    products = [],
    description
  } = company;

  const displayLocation = location || address;
  const displayRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  const basePath = getBasePath();

  console.log("📍 Base path for navigation:", basePath);
  console.log("📱 Company phone:", phone);
  console.log("⭐ Company rating:", displayRating);
  console.log("📦 Company products count:", products.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* ============ Banner Section ============ */}
      <div
        className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${
            banner || logo || "/api/placeholder/1200/400"
          }) center/cover no-repeat`,
          willChange: "transform, opacity",
        }}
      >
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full
                     border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300"
        >
          <Suspense fallback={<span>←</span>}>
            <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
          </Suspense>
        </button>

        {/* 🔗 Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: name,
                text: `Check out ${name} on Catalogueya!`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          className="absolute top-24 right-4 sm:right-8 z-30 flex items-center justify-center 
                     w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md 
                     hover:bg-white/30 shadow-xl hover:scale-105 transition-all duration-300"
        >
          <MdIosShare className="text-white text-xl sm:text-2xl" />
        </button>

        {/* ===== Company Info ===== */}
        <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-10 w-full">
          <img
            src={logo || "/api/placeholder/200/200"}
            alt={name}
            loading="eager"
            decoding="async"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl 
                       border-2 border-white/50 shadow-2xl backdrop-blur-sm bg-white/10"
            style={{ willChange: "transform" }}
            onError={(e) => {
              e.target.src = "/api/placeholder/200/200";
            }}
          />
          <div className="flex flex-col justify-center text-white flex-1 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-2xl leading-tight">
              {name}
            </h1>
            {title && (
              <p className="text-xs sm:text-sm opacity-90 mt-1">{title}</p>
            )}

            {/* ⭐ Rating + WhatsApp */}
            <div className="flex items-center gap-4 mt-3 text-sm sm:text-base">
              <button
                onClick={() => navigate(`${basePath}/reviews`)}
                className="flex items-center gap-1 text-yellow-400 font-semibold drop-shadow-lg"
              >
                <FaStar className="text-lg sm:text-xl" />
                <span>{displayRating.toFixed(1)}</span>
                <span className="text-gray-200 ml-1 text-xs sm:text-sm hover:underline">
                  (See Reviews)
                </span>
              </button>

              {phone && (
                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 
                             rounded-full bg-green-500 hover:bg-green-600 shadow-xl transition hover:scale-105"
                >
                  <Suspense fallback={<span>💬</span>}>
                    <FaWhatsapp className="text-white text-lg sm:text-2xl" />
                  </Suspense>
                </a>
              )}
            </div>

            {/* 📍 Location */}
            {displayLocation && (
              <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm opacity-85">
                <span role="img" aria-label="location">
                  📍
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    displayLocation
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-200"
                >
                  {displayLocation}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

  

      {/* ============ Products Section ============ */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-light mb-10 text-gray-800 tracking-tight px-6 sm:px-12">
          Our Products
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 sm:px-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden cursor-pointer aspect-square group 
                            bg-white rounded-lg border border-gray-200 
                            shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-400"
                onClick={() => navigate(`${basePath}/product/${product.id}`)}
              >
                {/* Lazy-load images for speed */}
                <img
                  src={product.image || product.img || "/api/placeholder/300/300"}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/300/300";
                  }}
                />

                {/* Product Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                </div>

                {/* ❤️ Favourite Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(product);
                  }}
                  className="absolute top-2 right-2 z-10"
                >
                  <Suspense fallback={<span>♡</span>}>
                    <FaHeart
                      className={`text-xl ${
                        isFavourite(product.id)
                          ? "text-red-500 scale-110"
                          : "text-white/90 hover:text-red-400"
                      } drop-shadow-lg transition-transform duration-200`}
                    />
                  </Suspense>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10 text-lg">
            No products available for this company.
          </p>
        )}
      </section>
    </div>
  );
}