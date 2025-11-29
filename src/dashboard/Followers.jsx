import React from "react";
import { useFollowers } from "../context/FollowersContext";
import { FaUser, FaEnvelope, FaCalendar, FaTrash } from "react-icons/fa";

export default function Followers() {
  const { followers, removeFollower, getFollowersCount } = useFollowers();

  const handleRemoveFollower = (customerId) => {
    if (window.confirm("Are you sure you want to remove this follower?")) {
      removeFollower(customerId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (followers.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-w-0">
        <div className="text-center py-8 sm:py-12 min-w-0">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <FaUser className="text-xl sm:text-3xl text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 min-w-0">No Followers Yet</h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base min-w-0 px-2">
            When customers follow your company, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 overflow-x-hidden min-w-0">
      <div className="mb-6 sm:mb-8 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 min-w-0">Followers</h1>
        <p className="text-gray-600 text-sm sm:text-base min-w-0">
          You have {getFollowersCount()} follower{getFollowersCount() === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 min-w-0">
        {followers.map((follower) => (
          <div
            key={follower.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 min-w-0"
          >
            {/* Follower Header */}
            <div className="p-3 sm:p-4 min-w-0">
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  {follower.avatar ? (
                    <img
                      src={follower.avatar}
                      alt={follower.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {follower.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base min-w-0">
                    {follower.name || 'Unknown User'}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 min-w-0">
                    <FaEnvelope className="flex-shrink-0 text-[10px] sm:text-xs" />
                    <span className="truncate min-w-0">{follower.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 min-w-0">
                    <FaCalendar className="flex-shrink-0 text-[10px] sm:text-xs" />
                    <span className="truncate min-w-0">Followed {formatDate(follower.followedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-3 sm:px-4 pb-2 sm:pb-3 min-w-0">
              <button
                onClick={() => handleRemoveFollower(follower.id)}
                className="w-full flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-xs sm:text-sm font-medium min-w-0"
              >
                <FaTrash className="text-[10px] sm:text-xs flex-shrink-0" />
                <span className="truncate">Remove Follower</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Data Notice */}
      {followers.length > 0 && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl min-w-0">
          <p className="text-xs sm:text-sm text-blue-700 text-center min-w-0 px-1">
            💡 <strong>Demo Data:</strong> In a real application, followers data would come from your backend when customers follow your company.
          </p>
        </div>
      )}
    </div>
  );
}