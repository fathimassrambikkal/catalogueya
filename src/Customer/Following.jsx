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
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaUserPlus className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Companies Followed</h2>
          <p className="text-gray-500 mb-6">
            Start following companies to see them here. You'll get updates from companies you follow.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Explore Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Following</h1>
        <p className="text-gray-600">
          You're following {following.length} compan{following.length === 1 ? 'y' : 'ies'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {following.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Company Header */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => handleCompanyClick(company.id)}
            >
              <div className="flex items-start gap-3">
                <img
                  src={company.logo || "/api/placeholder/60/60"}
                  alt={company.name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/60/60";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                  {company.title && (
                    <p className="text-sm text-gray-500 truncate">{company.title}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-gray-600">
                      {company.rating ? company.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="px-4 pb-3">
              {(company.location || company.phone) && (
                <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3">
                  {company.location && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-1">
                      <FaPhone className="flex-shrink-0" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Unfollow Button */}
              <button
                onClick={() => handleUnfollow(company)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
              >
                <FaTrash className="text-xs" />
                Unfollow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}