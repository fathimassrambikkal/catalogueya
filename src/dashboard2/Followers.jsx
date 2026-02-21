import React, { useState } from "react";
import { FaUser, FaEnvelope, FaCalendar, FaTrash } from "react-icons/fa";

export default function Followers() {
  // ⛔ REMOVED FollowersContext
  // ✅ Local state instead (replace with API later if needed)
  const [followers, setFollowers] = useState([]);

  const getFollowersCount = () => followers.length;

  const removeFollower = (customerId) => {
    setFollowers((prev) => prev.filter((f) => f.id !== customerId));
  };

  /* REMOVE FOLLOWER HANDLER */
  const handleRemoveFollower = (customerId) => {
    if (window.confirm("Are you sure you want to remove this follower?")) {
      removeFollower(customerId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* EMPTY STATE */
  if (!followers || followers.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-w-0 overflow-x-hidden">
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaUser className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            No Followers Yet
          </h2>
          <p className="text-gray-500 mt-2">
            When customers follow your company, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  /* MAIN UI */
  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Followers
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          You have {getFollowersCount()} follower
          {getFollowersCount() === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 overflow-x-hidden">
        {followers.map((follower) => (
          <div
            key={follower.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* HEADER */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {follower.avatar ? (
                    <img
                      src={follower.avatar}
                      alt={follower.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    follower.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {follower.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <FaEnvelope />
                    <span className="truncate">{follower.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <FaCalendar />
                    <span>Followed {formatDate(follower.followedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REMOVE BUTTON */}
            <div className="px-4 pb-4">
              <button
                onClick={() => handleRemoveFollower(follower.id)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
              >
                <FaTrash />
                Remove Follower
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
