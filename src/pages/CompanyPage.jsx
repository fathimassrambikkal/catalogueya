import React, { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdIosShare } from "react-icons/md";
import { categories } from "../data/categoriesData";
import { useFavourites } from "../context/FavouriteContext";

// Lazy-loaded icons
const FaStar = React.lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaStar }))
);
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

  const category = categories.find((cat) => cat.id === categoryId);
  const company = category?.companies.find((c) => c.id === companyId);

  if (!category || !company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        Company not found.
      </div>
    );
  }

  const isFavourite = (id) => favourites.some((fav) => fav.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      {/* ============ Banner Section ============ */}
      <div
        className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-start overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${
            company.banner || company.logo || category.image
          }) center/cover no-repeat`,
        }}
      >
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-4 sm:top-6 sm:left-6 z-30 flex items-center justify-center 
                     w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-white/20 
                     backdrop-blur-md shadow-md hover:bg-white/30 transition-all duration-300"
        >
          <Suspense fallback={<span>←</span>}>
            <FaArrowLeft className="text-white text-lg sm:text-xl" />
          </Suspense>
        </button>

        {/* 🔗 Share Button */}
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
          className="absolute top-24 right-3 sm:top-24 sm:right-5 z-30 flex items-center justify-center 
                     w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md 
                     hover:bg-white/30 shadow-lg transition"
        >
          <MdIosShare className="text-white text-xl sm:text-2xl" />
        </button>

        {/* ===== Company Info ===== */}
        <div className="relative z-20 flex items-center gap-5 sm:gap-8 px-6 sm:px-16 pb-10 w-full">
          {/* Logo */}
          <img
            src={company.logo || category.image}
            alt={company.name}
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-full 
                       border-2 border-white shadow-xl flex-shrink-0"
          />

          {/* Info */}
          <div className="flex flex-col justify-center text-white flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
              {company.name}
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1">{company.title}</p>

            {/* Rating + WhatsApp */}
            <div className="flex items-center gap-4 mt-3 text-sm sm:text-base">
              <div className="flex items-center gap-1">
                <Suspense fallback={<span>⭐</span>}>
                  <FaStar className="text-yellow-400 text-lg sm:text-xl" />
                </Suspense>
                <span className="font-semibold">{company.rating}</span>
              </div>

              <a
                href={`https://wa.me/${company.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 
                           rounded-full bg-green-500 hover:bg-green-600 shadow-md transition"
              >
                <Suspense fallback={<span>💬</span>}>
                  <FaWhatsapp className="text-white text-lg sm:text-2xl" />
                </Suspense>
              </a>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm opacity-85">
              <span role="img" aria-label="location">
                📍
              </span>
              <p>{company.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Products Section ============ */}
      <section className="py-12">
        <h2 className="text-3xl font-light mb-10 text-gray-800 tracking-tight text-left sm:text-left px-6 sm:px-12">
          Our Products
        </h2>

        {company.products && company.products.length > 0 ? (
          <div className="grid grid-cols-3 gap-[1px] bg-white">
            {company.products.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden cursor-pointer aspect-square group bg-gray-100"
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
