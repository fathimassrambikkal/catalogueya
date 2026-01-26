import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaExternalLinkAlt,
  FaTimes
} from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import { useSelector } from "react-redux";
import { getCustomerFollowUps, unfollowCompany } from "../api";

/* ----------------------------------
   IMAGE URL BUILDER (AVIF / WEBP)
----------------------------------- */
const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `https://catalogueyanew.com.awu.zxu.temporary.site/${path.replace(/^\/+/, "")}`;
};

/* ----------------------------------
   IMAGE COMPONENT (APPLE-LEVEL)
----------------------------------- */
const CompanyLogo = ({ image, alt }) => {
  const avif = image?.avif ? buildImageUrl(image.avif) : null;
  const webp = image?.webp ? buildImageUrl(image.webp) : null;

  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={webp || "/api/placeholder/80/80"}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/api/placeholder/80/80";
          e.currentTarget.className =
            "w-full h-full object-contain bg-gradient-to-br from-blue-50 to-gray-100 p-2";
        }}
      />
    </picture>
  );
};

export default function Following() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unfollowLoading, setUnfollowLoading] = useState({});
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  /* ----------------------------------
     FETCH FOLLOWED COMPANIES
  ----------------------------------- */
  const fetchFollowing = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view followed companies");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await getCustomerFollowUps();

      let companies = [];

      if (Array.isArray(res.data?.companies)) {
        companies = res.data.companies;
      } else if (Array.isArray(res.data?.data)) {
        companies = res.data.data.map((item) => ({
          ...item.company,
          follow_id: item.id
        }));
      }

      setFollowing(
        companies.map((company) => ({
          ...company,
          name:
            company.name_en ||
            company.name_ar ||
            "Unknown Company",
          address:
            company.address_en ||
            company.address_ar ||
            "",
          description:
            company.description_en ||
            company.description_ar ||
            "",
          rating: company.rating ? Number(company.rating) : 0,
          number_of_reviews: company.number_of_reviews || 0
        }))
      );
    } catch (err) {
      setError("Failed to load followed companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();

    const refresh = () => fetchFollowing();
    window.addEventListener("follow-updated", refresh);
    return () => window.removeEventListener("follow-updated", refresh);
  }, [currentUser?.id]);

  /* ----------------------------------
     UNFOLLOW
  ----------------------------------- */
  const handleUnfollow = async (company) => {
    try {
      setUnfollowLoading((p) => ({ ...p, [company.id]: true }));
      await unfollowCompany(company.id);
      setFollowing((prev) => prev.filter((c) => c.id !== company.id));
    } catch {
      setError("Failed to unfollow company");
    } finally {
      setUnfollowLoading((p) => ({ ...p, [company.id]: false }));
    }
  };

  if (loading) return null;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaTimes className="text-red-500 mr-2" />
        {error}
      </div>
    );
  }

  if (!following.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <HiOutlineUserRemove className="text-3xl text-gray-400 mr-2" />
        No companies followed
      </div>
    );
  }


/* ----------------------------------
   MAIN UI 
----------------------------------- */
return (
  <div className="min-h-full p-3 sm:p-6 lg:p-10  mt-10">
    
    {/* Header */}
    <h1 className="text-center text-[17px] sm:text-xl font-semibold tracking-tight text-gray-900 mb-8">
      Following
    </h1>

    {/* Responsive Grid */}
    <div
      className="
        grid gap-4 sm:gap-5
        grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
        max-w-[2000px] mx-auto
      "
    >
      {following.map((company) => (
        <div
          key={company.id}
          className="
            group relative
            rounded-2xl
            bg-white/70 backdrop-blur-xl
            border border-black/[0.04]
            shadow-[0_8px_24px_-14px_rgba(0,0,0,0.25)]
            hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.35)]
            transition-all duration-300
            overflow-hidden
          "
        >
          <div className="relative p-4 sm:p-5">
            
            {/* Header */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/company/${company.id}`)}
            >
              <div
                className="
                  w-11 h-11 rounded-xl overflow-hidden
                  border border-black/[0.06]
                  bg-white
                  shadow-sm
                  flex-shrink-0
                "
              >
                <CompanyLogo image={company.logo} alt={company.name} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {company.name}
                </h3>

                {company.rating > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <FaStar className="text-[11px] text-gray-700" />
                    <span className="text-xs text-gray-600 font-medium">
                      {company.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <FaExternalLinkAlt className="text-xs text-gray-400 group-hover:text-gray-700 transition-colors" />
            </div>

            {/* Description */}
            {company.description && (
              <p
                className="mt-3 text-xs leading-relaxed text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: company.description }}
              />
            )}

            {/* Meta */}
            <div className="mt-4 space-y-1.5 text-xs text-gray-500">
              {company.address && (
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-[11px]" />
                  <span className="truncate">{company.address}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-1.5">
                  <FaPhone className="text-[11px]" />
                  <span>{company.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              relative flex items-center justify-between
              px-4 py-3
              border-t border-black/[0.04]
              bg-white/50 backdrop-blur-md
              text-xs
            "
          >
            <span className="text-gray-400">Followed</span>

            <button
              onClick={() => handleUnfollow(company)}
              disabled={unfollowLoading[company.id]}
              className="
                font-medium
                text-red-500 hover:text-red-600
                transition
                disabled:opacity-50
              "
            >
              {unfollowLoading[company.id] ? "Removing…" : "Unfollow"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);


}
