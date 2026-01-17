import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaPhone, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import { useSelector } from "react-redux";
import { getCustomerFollowUps, unfollowCompany } from "../api";

export default function Following() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unfollowLoading, setUnfollowLoading] = useState({});
  const navigate = useNavigate();

  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.user);

  // Helper function to get proper image URLs
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/api/placeholder/300/300";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("blob:")) return imgPath;
    if (imgPath.startsWith("data:")) return imgPath;
    
    // Handle relative paths from API
    const cleanPath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
    return `https://catalogueyanew.com.awu.zxu.temporary.site/${cleanPath}`;
  };

  // Fetch followed companies from API
  const fetchFollowing = async () => {
    // Check if user is authenticated
    if (!currentUser?.id) {
      console.warn("⚠️ No customer ID available");
      setLoading(false);
      setFollowing([]);
      return;
    }

    // Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No auth token found. Please log in.");
      setError("Please log in to view followed companies");
      setLoading(false);
      return;
    }

    console.log("📡 Fetching follow-ups...");

    try {
      setLoading(true);
      setError(null);

      const res = await getCustomerFollowUps();
      console.log("✅ Follow-ups API response:", res.data);

      // Handle the nested response format
      let companies = [];
      
      if (res.data?.data && Array.isArray(res.data.data)) {
        // Format: { data: [{ id, company: {...} }] }
        companies = res.data.data.map(item => ({
          ...item.company,
          follow_id: item.id,
        }));
      } else if (res.data?.companies && Array.isArray(res.data.companies)) {
        companies = res.data.companies;
      } else if (Array.isArray(res.data)) {
        companies = res.data;
      }

      // Process companies
      const processedCompanies = companies.map(company => ({
        ...company,
        logo: getImageUrl(company.logo),
        name: company.name_en || company.name_ar || company.name || "Unknown Company",
        address: company.address_en || company.address_ar || company.address || "",
        description: company.description_en || company.description_ar || company.description || "",
        rating: company.rating ? Number(company.rating) : 0,
        number_of_reviews: company.number_of_reviews || 0,
        phone: company.phone || ""
      }));
      
      setFollowing(processedCompanies);

    } catch (err) {
      console.error("❌ Failed to load follow-ups:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
      } else {
        setError(err.response?.data?.message || "Failed to load followed companies");
      }
      setFollowing([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
    
    const handleFollowUpdated = () => {
      console.log("🔄 Received follow-updated event, refreshing following list");
      fetchFollowing();
    };

    window.addEventListener("follow-updated", handleFollowUpdated);
    return () => window.removeEventListener("follow-updated", handleFollowUpdated);
  }, [currentUser?.id]);

  const handleUnfollow = async (company) => {
    if (!company?.id) return;
    
    try {
      setUnfollowLoading(prev => ({ ...prev, [company.id]: true }));
      await unfollowCompany(company.id);
      setFollowing(prev => prev.filter(c => c.id !== company.id));
      window.dispatchEvent(new Event("follow-updated"));
    } catch (err) {
      console.error("❌ Unfollow failed", err);
      setError(err.response?.data?.message || "Failed to unfollow company");
    } finally {
      setUnfollowLoading(prev => ({ ...prev, [company.id]: false }));
    }
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  /* -------------------------
        LOADING STATE - Minimal
  -------------------------- */
  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="h-9 w-40 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-60 bg-gradient-to-r from-gray-50 to-white rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gradient-to-r from-gray-100 to-gray-50 rounded"></div>
                    <div className="h-3 w-1/2 bg-gradient-to-r from-gray-50 to-white rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
        ERROR STATE - Minimal
  -------------------------- */
  if (error) {
    return (
      <div className=" h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-red-50 to-white flex items-center justify-center">
              <FaTimes className="text-2xl text-red-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              Unable to load
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {error}
            </p>
            {error.includes("expired") || error.includes("401") ? (
              <button
                onClick={() => navigate("/sign")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
              >
                Sign In Again
              </button>
            ) : (
              <button
                onClick={fetchFollowing}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2.5 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-200 text-sm font-medium"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
        EMPTY STATE - Minimal
  -------------------------- */
  if (following.length === 0 && !loading) {
    return (
      <div className=" h-full overflow-y-auto 
      
      
      flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-blue-50 to-white flex items-center justify-center">
              <HiOutlineUserRemove className="text-3xl text-blue-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              No companies followed
            </h2>
            <p className="text-gray-600 text-sm mb-7">
              Companies you follow will appear here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
            >
              Browse Companies
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
         MAIN UI - Minimal High-End Design
  -------------------------- */
  return (
    <div className="h-full overflow-y-auto  p-4 sm:p-6">
      <div className=" w-full max-w-full mx-auto overflow-hidden">
        
        {/* Minimal Header */}
        <div className="mb-10 mt-10">
          
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
              Following
            </h1>
        
          </div>
       
        </div>

        {/* Compact Grid - Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {following.map((company) => {
            const isLoading = unfollowLoading[company.id];
            
            return (
              <div
                key={company.id}
                className="group bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card Content */}
                <div className="p-4">
                  {/* Header with Logo and Actions */}
                  <div className="flex items-start justify-between mb-3">
                    {/* Logo and Name */}
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleCompanyClick(company.id)}
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={company.logo || "/api/placeholder/80/80"}
                          alt={company.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/80/80";
                            e.target.className = "w-full h-full object-contain bg-gradient-to-br from-blue-50 to-gray-100 p-2";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {company.name}
                        </h3>
                        {/* Rating - Minimal */}
                        {company.rating > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <FaStar className="text-xs text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-600 font-medium">
                              {company.rating.toFixed(1)}
                            </span>
                            {company.number_of_reviews > 0 && (
                              <span className="text-xs text-gray-400">
                                ({company.number_of_reviews})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {/* Visit Button */}
                      <button
                        onClick={() => handleCompanyClick(company.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        title="Visit company"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                      </button>
                      
                     
                  
                    </div>
                  </div>

                  {/* Description - Minimal */}
                  {company.description && (
                    <p 
                      className="text-xs text-gray-600 line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: company.description }}
                    />
                  )}

                  {/* Contact Info - Minimal */}
                  <div className="space-y-1.5">
                    {company.address && (
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-xs text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">
                          {company.address}
                        </span>
                      </div>
                    )}

                    {company.phone && (
                      <div className="flex items-center gap-1.5">
                        <FaPhone className="text-xs text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {company.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Footer */}
                <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Followed
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfollow(company);
                      }}
                      disabled={isLoading}
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isLoading ? "Removing..." : "Unfollow"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}