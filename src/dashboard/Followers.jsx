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
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaUser className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Followers Yet</h2>
          <p className="text-gray-500 mb-6">
            When customers follow your company, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Followers</h1>
        <p className="text-gray-600">
          You have {getFollowersCount()} follower{getFollowersCount() === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {followers.map((follower) => (
          <div
            key={follower.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Follower Header */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  {follower.avatar ? (
                    <img
                      src={follower.avatar}
                      alt={follower.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {follower.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{follower.name || 'Unknown User'}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <FaEnvelope className="flex-shrink-0" />
                    <span className="truncate">{follower.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <FaCalendar className="flex-shrink-0" />
                    <span>Followed {formatDate(follower.followedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-3">
              <button
                onClick={() => handleRemoveFollower(follower.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
              >
                <FaTrash className="text-xs" />
                Remove Follower
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Data Notice */}
      {followers.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700 text-center">
            💡 <strong>Demo Data:</strong> In a real application, followers data would come from your backend when customers follow your company.
          </p>
        </div>
      )}
    </div>
  );
}