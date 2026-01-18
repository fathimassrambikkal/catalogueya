import React, { useState, useEffect } from "react";
import { FaStar, FaUser, FaBox, FaCogs, FaQuoteLeft } from "react-icons/fa";
import { getCompanyDashboardReviews } from "../companyApi";

const DashboardReviews = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState("services"); // 'services' or 'products'

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await getCompanyDashboardReviews();
            if (res.data?.status === 200) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error("❌ Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const reviewList = data?.[activeType]?.reviews || [];
    const stats = data?.[activeType] || {};

    return (
        <div className="space-y-6">
            {/* OVERALL STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-200/60 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <FaStar className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Global Rating</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data?.company_rating || 0} / 5</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-200/60 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <FaQuoteLeft className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data?.total_reviews_count || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-200/60 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <FaStar className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{activeType === 'services' ? 'Service' : 'Product'} Avg</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats?.avg_rating || 0} / 5</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER TABS */}
            <div className="bg-white/80 backdrop-blur-lg p-1 rounded-2xl border border-gray-200/60 flex shadow-sm max-w-md">
                <button
                    onClick={() => setActiveType("services")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeType === "services"
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <FaCogs /> Service Reviews
                </button>
                <button
                    onClick={() => setActiveType("products")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeType === "products"
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <FaBox /> Product Reviews
                </button>
            </div>

            {/* REVIEWS LIST */}
            <div className="space-y-4">
                {reviewList.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-lg p-12 rounded-2xl border border-gray-200/60 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaQuoteLeft className="text-gray-300 text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
                        <p className="text-gray-500 mt-1">When customers leave reviews, they will appear here.</p>
                    </div>
                ) : (
                    reviewList.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200/60 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* User Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white shadow-sm">
                                        {review.user?.image ? (
                                            <img
                                                src={`https://catalogueyanew.com.awu.zxu.temporary.site/storage/${review.user.image}`}
                                                alt={review.user.name || "User"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://ui-avatars.com/api/?name=" + (review.user?.name || "User");
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                                                <FaUser />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 truncate">{review.user?.name || "Customer"}</h4>
                                            <span className="text-xs text-gray-400">• {new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>

                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {review.comment && (
                                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-3 rounded-xl italic border border-gray-100">
                                                "{review.comment}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Target Info (Service or Product) */}
                                <div className="md:w-64 flex-shrink-0 border-l border-gray-100 md:pl-6">
                                    {activeType === "services" ? (
                                        <div>
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Service</span>
                                            <h5 className="font-bold text-gray-900 mt-1">{review.service_name}</h5>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
                                                <img
                                                    src={`https://catalogueyanew.com.awu.zxu.temporary.site/storage/${review.product?.image}`}
                                                    alt={review.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Product</span>
                                                <h5 className="font-bold text-gray-900 text-sm truncate">{review.product?.name}</h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardReviews;
