"use client";

import React, { Suspense,useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdIosShare } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { categories as localCategories } from "../data/categoriesData";
import { useFavourites } from "../context/FavouriteContext";
import { getCompany, getSettings, getFixedWords } from "../api";

//  Lazy load heavy icons only
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

  const [category, setCategory] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [fixedWords, setFixedWords] = useState({});

  // Helper to check favourites
  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  // ===== Fetch backend data =====
  useEffect(() => {
    setLoading(true);

    // Fetch company data
    getCompany(companyId)
      .then((res) => {
        const data = res.data;
        if (data) {
          setCompany(data);

          // find matching category in backend response
          if (data.category) setCategory(data.category);
          else {
            // fallback to local category
            const localCat = localCategories.find((c) => c.id === categoryId);
            setCategory(localCat || null);
          }
        } else {
          // fallback to local data
          const localCat = localCategories.find((c) => c.id === categoryId);
          const localComp = localCat?.companies.find((c) => c.id === companyId);
          setCategory(localCat || null);
          setCompany(localComp || null);
        }
      })
      .catch(() => {
        // fallback to local data on error
        const localCat = localCategories.find((c) => c.id === categoryId);
        const localComp = localCat?.companies.find((c) => c.id === companyId);
        setCategory(localCat || null);
        setCompany(localComp || null);
      })
      .finally(() => setLoading(false));

    // Fetch settings & fixed words in parallel
    Promise.all([getSettings(), getFixedWords()])
      .then(([settingsRes, fixedWordsRes]) => {
        setSettings(settingsRes.data || {});
        setFixedWords(fixedWordsRes.data || {});
      })
      .catch(() => {
        // fail silently, optional: console.warn("Failed to load settings/fixed words");
      });
  }, [categoryId, companyId]);

  if (loading)
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;

  if (!category || !company)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        Company not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* ============ Banner Section ============ */}
      <div
        className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${
            company.banner || company.logo || category.image
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
                title: company.name,
                text: `Check out ${company.name} on Catalogueya!`,
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
            src={company.logo || category.image}
            alt={company.name}
            loading="eager"
            decoding="async"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl 
                       border-2 border-white/50 shadow-2xl backdrop-blur-sm"
            style={{ willChange: "transform" }}
          />
          <div className="flex flex-col justify-center text-white flex-1 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-2xl leading-tight">
              {company.name}
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1">{company.title}</p>

            {/* ⭐ Rating + WhatsApp */}
            <div className="flex items-center gap-4 mt-3 text-sm sm:text-base">
              <button
                onClick={() =>
                  navigate(`/category/${categoryId}/company/${companyId}/reviews`)
                }
                className="flex items-center gap-1 text-yellow-400 font-semibold drop-shadow-lg"
              >
                <FaStar className="text-lg sm:text-xl" />
                <span>{company.rating}</span>
                <span className="text-gray-200 ml-1 text-xs sm:text-sm hover:underline">
                  (See Reviews)
                </span>
              </button>

              <a
                href={`https://wa.me/${company.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 
                           rounded-full bg-green-500 hover:bg-green-600 shadow-xl transition hover:scale-105"
              >
                <Suspense fallback={<span>💬</span>}>
                  <FaWhatsapp className="text-white text-lg sm:text-2xl" />
                </Suspense>
              </a>
            </div>

            {/* 📍 Location */}
            {company.location && (
              <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm opacity-85">
                <span role="img" aria-label="location">
                  📍
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    company.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-200"
                >
                  {company.location}
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

        {company.products?.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-1 sm:gap-2 px-4 sm:px-12">
            {company.products.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden cursor-pointer aspect-square group 
                            bg-white/10 backdrop-blur-md border border-white/20 
                            shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-400"
                onClick={() =>
                  navigate(
                    `/category/${categoryId}/company/${companyId}/product/${product.id}`
                  )
                }
              >
                {/* ✅ Lazy-load images for speed */}
                <img
                  src={product.img || product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* ❤️ Favourite Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(product);
                  }}
                  className="absolute top-2 right-2 text-white"
                >
                  <Suspense fallback={<span>♡</span>}>
                    <FaHeart
                      className={`${
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
