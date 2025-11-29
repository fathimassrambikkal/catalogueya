import React from "react";
import { useNavigate } from "react-router-dom";
import { useFollowing } from "../context/FollowingContext";
import { FaStar, FaMapMarkerAlt, FaPhone, FaTrash, FaUserPlus } from "react-icons/fa";

export default function Following() {
  const { following, toggleFollow } = useFollowing();
  const navigate = useNavigate();

  const handleUnfollow = (company) => {
    toggleFollow(company);
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  if (following.length === 0) {
    return (
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="text-center py-6 sm:py-8 md:py-12">
          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-24 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaUserPlus className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400" />
          </div>
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 mb-1 sm:mb-2">No Companies Followed</h2>
          <p className="text-gray-500 text-xs xs:text-sm sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6 max-w-md mx-auto px-2 break-words">
            Start following companies to see them here. You'll get updates from companies you follow.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-3 xs:px-4 sm:px-6 py-2 rounded-full hover:bg-blue-600 transition-colors text-xs xs:text-sm sm:text-base"
          >
            Explore Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 xs:p-3 sm:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 break-words">Following</h1>
        <p className="text-gray-600 text-xs xs:text-sm sm:text-sm md:text-base break-words">
          You're following {following.length} compan{following.length === 1 ? 'y' : 'ies'}
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full">
        {following.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full"
          >
            {/* Company Header */}
            <div 
              className="p-3 sm:p-4 cursor-pointer"
              onClick={() => handleCompanyClick(company.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <img
                  src={company.logo || "/api/placeholder/60/60"}
                  alt={company.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/60/60";
                  }}
                />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{company.name}</h3>
                  {company.title && (
                    <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">{company.title}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <FaStar className="text-yellow-400 text-xs sm:text-sm flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">
                      {company.rating ? company.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="px-3 sm:px-4 pb-3">
              {(company.location || company.phone) && (
                <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3">
                  {company.location && (
                    <div className="flex items-center gap-1 min-w-0">
                      <FaMapMarkerAlt className="flex-shrink-0 text-xs" />
                      <span className="truncate text-xs">{company.location}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-1 min-w-0">
                      <FaPhone className="flex-shrink-0 text-xs" />
                      <span className="truncate text-xs">{company.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Unfollow Button */}
              <button
                onClick={() => handleUnfollow(company)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
              >
                <FaTrash className="text-xs flex-shrink-0" />
                Unfollow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-specific spacing */}
      <div className="h-4 sm:h-6"></div>
    </div>
  );
}