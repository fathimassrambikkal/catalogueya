import React, { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";
import { useFavourites } from "../context/FavouriteContext";
import { MdIosShare } from "react-icons/md";

// Lazy load icons
const FaStar = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaStar }))
);
const FaWhatsapp = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaWhatsapp }))
);
const FaHeart = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaHeart }))
);
const FaArrowLeft = React.lazy(() =>
  import("react-icons/fa").then((mod) => ({ default: mod.FaArrowLeft }))
);

export default function CompanyPage() {
  const { categoryId, companyId } = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();

  const category = categories.find((cat) => cat.id === categoryId);
  const company = category?.companies.find((c) => c.id === companyId);

  if (!category || !company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Company not found.
      </div>
    );
  }

  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      {/* ===== Banner Section ===== */}
      <div
        className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(15,15,15,0.55), rgba(15,15,15,0.6)), url(${
            company.banner || company.logo || category.image
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 md:top-24 left-2 md:left-4 z-30 p-1 md:p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
        >
          <Suspense fallback={<div>←</div>}>
            <FaArrowLeft className="text-gray-700 text-sm md:text-md" />
          </Suspense>
        </button>

        {/* ✅ Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: company.name,
                text: `Check out ${company.name} on our platform!`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          className="absolute top-24 md:top-24 right-3 md:right-5 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg transition"
        >
          <MdIosShare className="text-white text-2xl" />
        </button>

        {/* ===== Company Info Row ===== */}
        <div className="flex flex-row items-center justify-between w-full px-6 sm:px-16 gap-6">
          {/* Logo */}
          <img
            src={company.logo || category.image}
            alt={company.name}
            className="w-16 h-16 sm:w-32 sm:h-32 object-contain rounded-full border-2 border-white shadow-lg"
          />

          {/* Info */}
          <div className="flex flex-col justify-center text-white flex-1 min-w-0">
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-lg">
              {company.name}
            </h1>
            <p className="text-xs sm:text-sm opacity-90">{company.title}</p>

            {/* ✅ Rating + WhatsApp Together */}
            <div className="flex items-center gap-4 mt-2 text-sm sm:text-base">
              <div className="flex items-center gap-1">
                <Suspense fallback={<span>⭐</span>}>
                  <FaStar className="text-yellow-400 text-lg sm:text-xl" />
                </Suspense>
                <span className="font-semibold">{company.rating}</span>
              </div>

              {/* WhatsApp Next to Rating */}
              <a
                href={`https://wa.me/${company.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-green-500 hover:bg-green-600 shadow-md transition"
              >
                <Suspense fallback={<span>💬</span>}>
                  <FaWhatsapp className="text-white text-lg sm:text-2xl" />
                </Suspense>
              </a>
            </div>

            {/* ✅ Location Below */}
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm opacity-85">
              <span role="img" aria-label="location">
                📍
              </span>
              <p>{company.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Products Section (3-column grid) ===== */}
      <div className="px-6 sm:px-12 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
          Our Products
        </h2>

        {company.products && company.products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {company.products.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden rounded-xl group cursor-pointer aspect-square"
                onClick={() =>
                  navigate(
                    `/category/${categoryId}/company/${companyId}/product/${product.id}`
                  )
                }
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Favourite Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(product);
                  }}
                  className="absolute top-3 right-3 text-white"
                >
                  <Suspense fallback={<span>♡</span>}>
                    <FaHeart
                      className={`${
                        isFavourite(product.id)
                          ? "text-red-500"
                          : "text-white/90 hover:text-red-400"
                      } drop-shadow-lg`}
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
      </div>
    </div>
  );
}
